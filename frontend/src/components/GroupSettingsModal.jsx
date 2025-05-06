import React, { useState, useEffect } from 'react';
import { FaTimes, FaCamera, FaLink, FaCopy } from 'react-icons/fa';
import axios from 'axios';

const GroupSettingsModal = ({ group, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [newName, setNewName] = useState(group.name);
  const [newCoverImage, setNewCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentCode, setCurrentCode] = useState(group.joining_code);

  // Hide banners when switching tabs
  useEffect(() => {
    setError('');
    setSuccess('');
  }, [activeTab]);

  const handleNameUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.patch(
        `http://localhost:8000/api/groups/${group._id}/name`,
        { name: newName },
        { withCredentials: true }
      );
      setSuccess('Group name updated successfully');
      if (onUpdate) onUpdate();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update group name');
    } finally {
      setLoading(false);
    }
  };

  const handleCoverUpdate = async (e) => {
    e.preventDefault();
    if (!newCoverImage) return;
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', newCoverImage);
      const res = await axios.patch(
        `http://localhost:8000/api/groups/${group._id}/cover`,
        formData,
        { 
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
      setSuccess('Group cover image updated successfully');
      if (onUpdate) onUpdate();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update group cover');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCode = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(
        `http://localhost:8000/api/groups/${group._id}/generate-code`,
        {},
        { withCredentials: true }
      );
      setSuccess('New joining code generated successfully');
      if (res.data && res.data.group && res.data.group.joining_code) {
        setCurrentCode(res.data.group.joining_code);
      }
      if (onUpdate) onUpdate();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate new code');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSuccess('Copied to clipboard!');
  };

  // Dismiss banner handlers
  const handleDismissError = () => setError('');
  const handleDismissSuccess = () => setSuccess('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-2xl relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
          onClick={onClose}
        >
          <FaTimes />
        </button>
        
        <h3 className="text-2xl font-bold mb-4 text-center">Group Settings</h3>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-700 mb-4">
          {['general', 'appearance', 'invite'].map(tab => (
            <button
              key={tab}
              className={`px-4 py-2 ${activeTab === tab ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 p-2 bg-green-900 text-green-200 rounded flex items-center justify-between">
            <span>{success}</span>
            <button className="ml-2 text-green-300 hover:text-white" onClick={handleDismissSuccess}>
              <FaTimes />
            </button>
          </div>
        )}
        {error && (
          <div className="mb-4 p-2 bg-red-900 text-red-200 rounded flex items-center justify-between">
            <span>{error}</span>
            <button className="ml-2 text-red-300 hover:text-white" onClick={handleDismissError}>
              <FaTimes />
            </button>
          </div>
        )}

        {/* General Settings */}
        {activeTab === 'general' && (
          <form onSubmit={handleNameUpdate} className="space-y-4">
            <div>
              <label className="block mb-1 font-semibold">Group Name</label>
              <input
                type="text"
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded disabled:opacity-50"
              disabled={loading || newName === group.name}
            >
              {loading ? 'Updating...' : 'Update Name'}
            </button>
          </form>
        )}

        {/* Appearance Settings */}
        {activeTab === 'appearance' && (
          <form onSubmit={handleCoverUpdate} className="space-y-4">
            <div>
              <label className="block mb-1 font-semibold">Group Cover Image</label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer">
                  <div className="w-32 h-32 rounded-lg bg-gray-800 flex items-center justify-center border-2 border-dashed border-gray-700 hover:border-blue-500">
                    {newCoverImage ? (
                      <img
                        src={URL.createObjectURL(newCoverImage)}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <FaCamera className="text-3xl text-gray-600" />
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => setNewCoverImage(e.target.files[0])}
                  />
                </label>
                <div className="flex-1">
                  <p className="text-sm text-gray-400">Recommended size: 500x500px</p>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded disabled:opacity-50"
              disabled={loading || !newCoverImage}
            >
              {loading ? 'Updating...' : 'Update Cover Image'}
            </button>
          </form>
        )}

        {/* Invite Settings */}
        {activeTab === 'invite' && (
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-semibold">Current Joining Code</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="flex-1 p-2 rounded bg-gray-800 text-white border border-gray-700"
                  value={currentCode}
                  readOnly
                />
                <button
                  className="p-2 bg-gray-800 hover:bg-gray-700 rounded"
                  onClick={() => copyToClipboard(currentCode)}
                >
                  <FaCopy />
                </button>
              </div>
            </div>
            <button
              onClick={handleGenerateCode}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate New Code'}
            </button>
            <p className="text-sm text-gray-400">
              Warning: Generating a new code will invalidate the previous one. Make sure to share the new code with your members.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupSettingsModal; 