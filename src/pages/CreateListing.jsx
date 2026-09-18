import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { Building, AlertCircle } from 'lucide-react';

const CreateListing = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    locality: 'koramangala',
    rent: '',
    deposit: '',
    roomType: 'single',
    genderPreference: 'colive',
    description: '',
    amenities: 'WiFi, Power Backup, Daily Cleaning',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        ...formData,
        rent: Number(formData.rent),
        deposit: Number(formData.deposit),
        amenities: formData.amenities.split(',').map((item) => item.trim()).filter(Boolean),
      };

      await axiosClient.post('/listings', payload);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post listing. Check form entries.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-4">
      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Building className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Post a PG / Flat Listing</h1>
            <p className="text-xs text-slate-500">Reach verified seekers searching across Bengaluru tech hubs</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-sm text-rose-600 border border-rose-200">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Listing Title</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Modern Coliving Room near Sony Signal"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Bengaluru Locality</label>
              <select
                name="locality"
                value={formData.locality}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-600 focus:outline-none bg-white"
              >
                <option value="koramangala">Koramangala</option>
                <option value="hsr layout">HSR Layout</option>
                <option value="indiranagar">Indiranagar</option>
                <option value="bellandur">Bellandur</option>
                <option value="whitefield">Whitefield</option>
                <option value="marathahalli">Marathahalli</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Room Type</label>
              <select
                name="roomType"
                value={formData.roomType}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-600 focus:outline-none bg-white"
              >
                <option value="single">Single Room</option>
                <option value="double-sharing">Double Sharing</option>
                <option value="triple-sharing">Triple Sharing</option>
                <option value="1bhk">1 BHK</option>
                <option value="2bhk">2 BHK</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Monthly Rent (₹)</label>
              <input
                type="number"
                name="rent"
                required
                min={1000}
                value={formData.rent}
                onChange={handleChange}
                placeholder="12000"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Deposit (₹)</label>
              <input
                type="number"
                name="deposit"
                value={formData.deposit}
                onChange={handleChange}
                placeholder="24000"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Preference</label>
              <select
                name="genderPreference"
                value={formData.genderPreference}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-600 focus:outline-none bg-white"
              >
                <option value="colive">Any / Colive</option>
                <option value="male">Male only</option>
                <option value="female">Female only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Amenities (Comma separated)</label>
            <input
              type="text"
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
              placeholder="WiFi, Power Backup, RO Water, Food"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Description</label>
            <textarea
              name="description"
              required
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Highlight proximity to tech parks, metro stations, food mess, etc."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-600 focus:outline-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {submitting ? 'Publishing Listing...' : 'Publish Listing'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;