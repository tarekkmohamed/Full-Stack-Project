import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Profile = () => {
  const { user, loading, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    mobile_phone: '',
    birthdate: '',
    city: '',
    country: '',
    address: '',
    profile_picture: null,
  });
  const [editMode, setEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        mobile_phone: user.mobile_phone || '',
        birthdate: user.birthdate || '',
        city: user.city || '',
        country: user.country || '',
        address: user.address || '',
        profile_picture: null,
      });
      setPreview(user.profile_picture || null);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profile_picture') {
      setFormData((prev) => ({
        ...prev,
        profile_picture: files[0],
      }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Use FormData for image upload
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    try {
      await updateProfile(data);
      window.location.reload();
    } catch (err) {
      alert('Failed to update profile');
    }
    setIsSubmitting(false);
    setEditMode(false);
  };

  if (loading || !user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-lg mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Profile</h1>
          <div className="flex flex-col items-center mb-6">
            <img
              src={preview || '/default-avatar.png'}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mb-2"
            />
            <button
              className="text-blue-600 font-medium"
              onClick={() => setEditMode((v) => !v)}
            >
              {editMode ? 'Cancel Edit' : 'Edit Profile'}
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">First Name</label>
                <input
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="input w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Last Name</label>
                <input
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="input w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Mobile Phone</label>
              <input
                name="mobile_phone"
                value={formData.mobile_phone}
                onChange={handleChange}
                disabled={!editMode}
                className="input w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Birthdate</label>
              <input
                name="birthdate"
                type="date"
                value={formData.birthdate}
                onChange={handleChange}
                disabled={!editMode}
                className="input w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">City</label>
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                disabled={!editMode}
                className="input w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Country</label>
              <input
                name="country"
                value={formData.country}
                onChange={handleChange}
                disabled={!editMode}
                className="input w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!editMode}
                className="input w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Profile Picture</label>
              <input
                name="profile_picture"
                type="file"
                accept="image/*"
                onChange={handleChange}
                disabled={!editMode}
                className="input w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            {editMode && (
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;





