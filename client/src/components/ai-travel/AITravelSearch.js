import React, { useState } from 'react';
import { FaPlane, FaTrain, FaHotel, FaRobot, FaLightbulb, FaRoute, FaDollarSign, FaClock, FaStar } from 'react-icons/fa';

const AITravelSearch = () => {
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    date: '',
    budget: 'flexible',
    preferences: {
      transportType: 'any',
      comfort: 'standard',
      timePreference: 'flexible'
    },
    includeHotels: false
  });

  const [aiResults, setAiResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('recommendations');

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setSearchData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setSearchData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAiResults(null);

    try {
      const response = await fetch('/api/ai-travel/comprehensive-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchData)
      });

      const data = await response.json();
      
      if (data.success) {
        setAiResults(data.data);
      } else {
        alert('Failed to get AI recommendations');
      }
    } catch (error) {
      console.error('AI Search Error:', error);
      alert('Error getting AI recommendations');
    } finally {
      setLoading(false);
    }
  };

  const renderTransportationCard = (transport, index) => (
    <div key={index} className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {transport.type === 'flight' && <FaPlane className="text-blue-500 text-xl" />}
          {transport.type === 'train' && <FaTrain className="text-green-500 text-xl" />}
          {transport.type === 'bus' && <FaHotel className="text-orange-500 text-xl" />}
          <h3 className="text-lg font-semibold capitalize">{transport.type}</h3>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-blue-600">{transport.estimatedCost}</p>
          <p className="text-sm text-gray-500">{transport.duration}</p>
        </div>
      </div>
      
      <p className="text-gray-700 mb-4">{transport.recommendation}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-green-600 mb-2">Pros:</h4>
          <ul className="text-sm text-gray-600">
            {transport.pros?.map((pro, i) => (
              <li key={i} className="flex items-center mb-1">
                <FaStar className="text-green-500 mr-2 text-xs" />
                {pro}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-red-600 mb-2">Cons:</h4>
          <ul className="text-sm text-gray-600">
            {transport.cons?.map((con, i) => (
              <li key={i} className="flex items-center mb-1">
                <FaStar className="text-red-500 mr-2 text-xs" />
                {con}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  const renderHotelCard = (hotel, index) => (
    <div key={index} className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">{hotel.name}</h3>
          <p className="text-sm text-gray-500 capitalize">{hotel.category}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-purple-600">{hotel.priceRange}</p>
          <p className="text-sm text-gray-500">{hotel.location}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Amenities:</h4>
        <div className="flex flex-wrap gap-2">
          {hotel.amenities?.map((amenity, i) => (
            <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
              {amenity}
            </span>
          ))}
        </div>
      </div>
      
      {hotel.nearbyAttractions && (
        <div>
          <h4 className="font-semibold mb-2">Nearby Attractions:</h4>
          <div className="flex flex-wrap gap-2">
            {hotel.nearbyAttractions.map((attraction, i) => (
              <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                {attraction}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderCostAnalysis = (analysis, type) => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex items-center mb-4">
        {type === 'flights' && <FaPlane className="text-blue-500 text-xl mr-2" />}
        {type === 'trains' && <FaTrain className="text-green-500 text-xl mr-2" />}
        <h3 className="text-lg font-semibold capitalize">{type} Cost Analysis</h3>
      </div>
      
      {analysis.currentPrices && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Current Prices:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{analysis.currentPrices.average}</p>
              <p className="text-sm text-gray-500">Average</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">{analysis.currentPrices.range}</p>
              <p className="text-sm text-gray-500">Range</p>
            </div>
            <div className="text-center">
              <p className={`text-lg font-semibold ${
                analysis.currentPrices.trend === 'increasing' ? 'text-red-600' : 
                analysis.currentPrices.trend === 'decreasing' ? 'text-green-600' : 'text-gray-600'
              }`}>
                {analysis.currentPrices.trend}
              </p>
              <p className="text-sm text-gray-500">Trend</p>
            </div>
          </div>
        </div>
      )}
      
      {analysis.bookingAdvice && (
        <div>
          <h4 className="font-semibold mb-2">Booking Advice:</h4>
          <p className="text-gray-700 mb-2">{analysis.bookingAdvice.bestTimeToBook}</p>
          <p className="text-gray-700 mb-2">{analysis.bookingAdvice.pricePrediction}</p>
          <div>
            <h5 className="font-medium mb-1">Tips:</h5>
            <ul className="text-sm text-gray-600">
              {analysis.bookingAdvice.tips?.map((tip, i) => (
                <li key={i} className="flex items-center mb-1">
                  <FaLightbulb className="text-yellow-500 mr-2 text-xs" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <FaRobot className="text-4xl text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">AI-Powered Travel Search</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get intelligent recommendations for flights, trains, hotels, and optimal routes using advanced AI technology.
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                <input
                  type="text"
                  placeholder="Enter departure city"
                  value={searchData.from}
                  onChange={(e) => handleInputChange('from', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                <input
                  type="text"
                  placeholder="Enter destination city"
                  value={searchData.to}
                  onChange={(e) => handleInputChange('to', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={searchData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                <select
                  value={searchData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="flexible">Flexible</option>
                  <option value="budget">Budget</option>
                  <option value="mid-range">Mid-Range</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeHotels"
                  checked={searchData.includeHotels}
                  onChange={(e) => handleInputChange('includeHotels', e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="includeHotels" className="text-sm font-medium text-gray-700">
                  Include hotel recommendations
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Getting AI Recommendations...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <FaRobot className="mr-2" />
                  Get AI Recommendations
                </div>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        {aiResults && (
          <div className="space-y-8">
            {/* Tabs */}
            <div className="flex space-x-1 bg-white rounded-lg shadow-md p-1">
              <button
                onClick={() => setActiveTab('recommendations')}
                className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
                  activeTab === 'recommendations' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FaLightbulb className="inline mr-2" />
                Recommendations
              </button>
              <button
                onClick={() => setActiveTab('costs')}
                className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
                  activeTab === 'costs' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FaDollarSign className="inline mr-2" />
                Cost Analysis
              </button>
              <button
                onClick={() => setActiveTab('routes')}
                className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
                  activeTab === 'routes' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FaRoute className="inline mr-2" />
                Route Optimization
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'recommendations' && (
              <div>
                {aiResults.travelRecommendations?.transportation && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Transportation Recommendations</h2>
                    {aiResults.travelRecommendations.transportation.map(renderTransportationCard)}
                  </div>
                )}
                
                {aiResults.hotelRecommendations?.hotels && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Hotel Recommendations</h2>
                    {aiResults.hotelRecommendations.hotels.map(renderHotelCard)}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'costs' && (
              <div>
                {aiResults.costAnalysis?.flights && renderCostAnalysis(aiResults.costAnalysis.flights, 'flights')}
                {aiResults.costAnalysis?.trains && renderCostAnalysis(aiResults.costAnalysis.trains, 'trains')}
              </div>
            )}

            {activeTab === 'routes' && aiResults.routeOptimization && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Route Optimization</h2>
                {aiResults.routeOptimization.optimalRoutes?.map((route, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
                    <h3 className="text-lg font-semibold mb-2">{route.route}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Transport Modes:</p>
                        <p className="text-gray-600">{route.transportModes?.join(', ')}</p>
                      </div>
                      <div>
                        <p className="font-medium">Total Time:</p>
                        <p className="text-gray-600">{route.totalTime}</p>
                      </div>
                      <div>
                        <p className="font-medium">Total Cost:</p>
                        <p className="text-gray-600">{route.totalCost}</p>
                      </div>
                      <div>
                        <p className="font-medium">Comfort:</p>
                        <p className="text-gray-600">{route.comfort}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AITravelSearch; 