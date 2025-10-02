import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaClock, FaUsers, FaSearch, FaFilter, FaPlane, FaHotel, FaCar, FaCheck } from 'react-icons/fa';

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCriteria, setSearchCriteria] = useState({
    destination: '',
    duration: '',
    priceRange: '',
    travelers: ''
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/packages');
      const data = await response.json();
      setPackages(data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(searchCriteria).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await fetch(`/api/packages/search?${params.toString()}`);
      const data = await response.json();
      setPackages(data.packages);
    } catch (error) {
      console.error('Error searching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Holiday Packages</h1>
            <p className="text-xl">Discover amazing destinations with our curated holiday packages</p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaMapMarkerAlt className="inline mr-1" />
                Destination
              </label>
              <input
                type="text"
                placeholder="Where do you want to go?"
                value={searchCriteria.destination}
                onChange={(e) => setSearchCriteria(prev => ({ ...prev, destination: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaClock className="inline mr-1" />
                Duration
              </label>
              <select
                value={searchCriteria.duration}
                onChange={(e) => setSearchCriteria(prev => ({ ...prev, duration: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Any Duration</option>
                <option value="3">3 Days</option>
                <option value="4">4 Days</option>
                <option value="5">5 Days</option>
                <option value="6">6 Days</option>
                <option value="7">7 Days</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <select
                value={searchCriteria.priceRange}
                onChange={(e) => setSearchCriteria(prev => ({ ...prev, priceRange: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Any Price</option>
                <option value="0-10000">Under ₹10,000</option>
                <option value="10000-20000">₹10,000 - ₹20,000</option>
                <option value="20000-30000">₹20,000 - ₹30,000</option>
                <option value="30000-50000">₹30,000 - ₹50,000</option>
                <option value="50000-999999">Above ₹50,000</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaUsers className="inline mr-1" />
                Travelers
              </label>
              <select
                value={searchCriteria.travelers}
                onChange={(e) => setSearchCriteria(prev => ({ ...prev, travelers: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Any Number</option>
                <option value="2">2 Travelers</option>
                <option value="4">4 Travelers</option>
                <option value="6">6 Travelers</option>
              </select>
            </div>

            <div className="md:col-span-2 lg:col-span-4">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <FaSearch className="mr-2" />
                Search Packages
              </button>
            </div>
          </form>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={pkg.destination.image} 
                  alt={pkg.destination.city} 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                  {pkg.price.discount}% OFF
                </div>
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
                  {pkg.duration}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">{pkg.name}</h3>
                    <p className="text-gray-600 flex items-center">
                      <FaMapMarkerAlt className="mr-1" />
                      {pkg.destination.city}, {pkg.destination.state}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{pkg.rating}</span>
                    <span className="text-sm text-gray-500 ml-1">({pkg.reviewCount})</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-blue-600">
                      {formatPrice(pkg.price.perPerson)}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(pkg.price.originalPrice)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">per person</p>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Highlights</h4>
                  <div className="flex flex-wrap gap-2">
                    {pkg.highlights.slice(0, 3).map((highlight, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">What's Included</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {pkg.inclusions.slice(0, 3).map((inclusion, index) => (
                      <li key={index} className="flex items-center">
                        <FaCheck className="text-green-500 mr-2 text-xs" />
                        {inclusion}
                      </li>
                    ))}
                    {pkg.inclusions.length > 3 && (
                      <li className="text-blue-600 text-xs">+{pkg.inclusions.length - 3} more</li>
                    )}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center text-sm text-gray-600">
                    <FaUsers className="mr-1" />
                    Max {pkg.maxTravelers} travelers
                  </div>
                  <Link
                    to={`/booking/package/${pkg.id}?destination=${pkg.destination.city}&duration=${pkg.duration}`}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {packages.length === 0 && (
          <div className="text-center py-12">
            <FaSearch className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No packages found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Our Packages?</h2>
            <p className="text-gray-600">Experience hassle-free travel with our comprehensive holiday packages</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaPlane className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Flights Included</h3>
              <p className="text-gray-600">All packages include return flights with major airlines</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHotel className="text-2xl text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Hotels</h3>
              <p className="text-gray-600">Stay at handpicked hotels and resorts for the best experience</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCar className="text-2xl text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Guided Tours</h3>
              <p className="text-gray-600">Expert guides and comfortable transportation throughout your journey</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Packages; 