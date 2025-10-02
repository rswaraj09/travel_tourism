import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Welcome, {user?.firstName}!</p>
          <p className="text-gray-600">Profile management coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Profile; 