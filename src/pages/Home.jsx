import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { Search, MapPin, Users, Phone, SlidersHorizontal, Trash2 } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [filters, setFilters] = useState({
    locality: '',
    roomType: '',
    genderPreference: '',
    maxRent: '',
    sort: '',
  });

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.locality) params.locality = filters.locality;
      if (filters.roomType) params.roomType = filters.roomType;
      if (filters.genderPreference) params.genderPreference = filters.genderPreference;
      if (filters.maxRent) params.maxRent = filters.maxRent;
      if (filters.sort) params.sort = filters.sort;

      const res = await axiosClient.get('/listings', { params });
      setListings(res.data.data);
    } catch (err) {
      console.error('Failed to load listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Handler to delete listing
  const handleDeleteListing = async (listingId) => {
    const confirmDelete = window.confirm('Are you sure you want to permanently delete this PG listing?');
    if (!confirmDelete) return;

    setDeletingId(listingId);
    try {
      await axiosClient.delete(`/listings/${listingId}`);
      // Optimistically remove from state so UI updates instantly
      setListings((prev) => prev.filter((item) => item._id !== listingId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete listing.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Header Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-4">
          <SlidersHorizontal className="h-4 w-4 text-indigo-600" />
          <span>Filter PGs & Flats in Bengaluru</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Locality</label>
            <input
              type="text"
              name="locality"
              value={filters.locality}
              onChange={handleFilterChange}
              placeholder="e.g. Koramangala"
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-indigo-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Room Type</label>
            <select
              name="roomType"
              value={filters.roomType}
              onChange={handleFilterChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-indigo-600 focus:outline-none bg-white"
            >
              <option value="">All Types</option>
              <option value="single">Single Room</option>
              <option value="double-sharing">Double Sharing</option>
              <option value="triple-sharing">Triple Sharing</option>
              <option value="1bhk">1 BHK</option>
              <option value="2bhk">2 BHK</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Preference</label>
            <select
              name="genderPreference"
              value={filters.genderPreference}
              onChange={handleFilterChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-indigo-600 focus:outline-none bg-white"
            >
              <option value="">Any</option>
              <option value="colive">Colive</option>
              <option value="male">Male Only</option>
              <option value="female">Female Only</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Max Rent (₹)</label>
            <input
              type="number"
              name="maxRent"
              value={filters.maxRent}
              onChange={handleFilterChange}
              placeholder="e.g. 15000"
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-indigo-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Sort By</label>
            <select
              name="sort"
              value={filters.sort}
              onChange={handleFilterChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-indigo-600 focus:outline-none bg-white"
            >
              <option value="">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-2 text-xs font-medium text-slate-500">Loading verified listings...</p>
        </div>
      ) : listings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Search className="mx-auto h-8 w-8 text-slate-400 mb-2" />
          <p className="font-semibold text-slate-700">No PGs match these filters</p>
          <p className="text-xs text-slate-400 mt-1">Try broadening your locality or increasing max rent.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((item) => {
            // Determine if the currently logged-in user is the creator/owner of this card
            const isMyListing = user && item.owner && (user._id === item.owner._id || user.id === item.owner._id);

            return (
              <div
                key={item._id}
                className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition"
              >
                <div className="relative">
                  <img
                    src={item.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'}
                    alt={item.title}
                    className="h-44 w-full object-cover"
                  />
                  {/* Delete Button: Only visible to the actual owner */}
                  {isMyListing && (
                    <button
                      onClick={() => handleDeleteListing(item._id)}
                      disabled={deletingId === item._id}
                      title="Delete Listing"
                      className="absolute top-2 right-2 rounded-full bg-white/90 p-2 text-rose-600 shadow hover:bg-rose-50 hover:text-rose-700 transition disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1 text-xs font-bold text-indigo-600 capitalize">
                      <MapPin className="h-3.5 w-3.5" />
                      {item.locality}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 uppercase">
                      {item.roomType}
                    </span>
                  </div>

                  <h3 className="mt-2 text-base font-bold text-slate-900 line-clamp-1">{item.title}</h3>
                  <p className="mt-1 text-xs text-slate-500 line-clamp-2">{item.description}</p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {item.amenities?.slice(0, 3).map((amenity, idx) => (
                      <span
                        key={idx}
                        className="rounded bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 border border-slate-100"
                      >
                        {amenity}
                      </span>
                    ))}
                    {item.amenities?.length > 3 && (
                      <span className="text-[11px] text-slate-400">+{item.amenities.length - 3} more</span>
                    )}
                  </div>

                  <div className="mt-4 flex items-baseline justify-between border-t border-slate-100 pt-3">
                    <div>
                      <span className="text-xl font-extrabold text-slate-900">
                        ₹{item.rent.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-400"> / month</span>
                    </div>
                    {item.deposit > 0 && (
                      <span className="text-xs text-slate-500">
                        Deposit: ₹{item.deposit.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  {/* Owner Contact Card */}
                  {item.owner && (
                    <div className="mt-3 rounded-lg bg-indigo-50/50 p-2.5 text-xs text-slate-600">
                      <p className="font-semibold text-indigo-950 mb-1 flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" /> Owner: {item.owner.name}
                      </p>
                      {item.owner.phoneNumber && (
                        <p className="flex items-center gap-1 text-slate-500">
                          <Phone className="h-3 w-3" /> {item.owner.phoneNumber}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;