import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaPlane, 
  FaHotel, 
  FaRoute, 
  FaTrain, 
  FaSearch,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
  FaStar,
  FaHeart,
  FaPlay,
  FaChevronDown,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube
} from 'react-icons/fa';

const Home = () => {
  const navigate = useNavigate();
  const bookingRef = useRef(null);
  const [searchType, setSearchType] = useState('flights');
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    departure: '',
    return: '',
    passengers: '1',
    rooms: '1',
    guests: '1',
    checkIn: '',
    checkOut: ''
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    if (searchType === 'hotels') {
      params.append('location', searchData.to);
      params.append('checkIn', searchData.checkIn);
      params.append('checkOut', searchData.checkOut);
      params.append('guests', searchData.guests);
      params.append('rooms', searchData.rooms);
      params.append('includeHotels', 'true');
    } else if (searchType === 'flights') {
      params.append('from', searchData.from);
      params.append('to', searchData.to);
      params.append('departure', searchData.departure);
      if (searchData.return) params.append('return', searchData.return);
      params.append('passengers', searchData.passengers);
      params.append('includeFlights', 'true');
    } else if (searchType === 'trains') {
      params.append('from', searchData.from);
      params.append('to', searchData.to);
      params.append('departure', searchData.departure);
      if (searchData.return) params.append('return', searchData.return);
      params.append('passengers', searchData.passengers);
      params.append('includeTrains', 'true');
    }
    
    navigate(`/search-results?${params.toString()}`);
  };

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const scrollToBooking = () => {
    if (bookingRef.current) {
      bookingRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const featuredDestinations = [
    {
      id: 1,
      name: 'Bali, Indonesia',
      image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      rating: 4.8,
      price: '$899',
      duration: '7 days'
    },
    {
      id: 2,
      name: 'Santorini, Greece',
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      rating: 4.9,
      price: '$1299',
      duration: '6 days'
    },
    {
      id: 3,
      name: 'Tokyo, Japan',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      rating: 4.7,
      price: '$1499',
      duration: '8 days'
    },
    {
      id: 4,
      name: 'New York, USA',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      rating: 4.6,
      price: '$999',
      duration: '5 days'
    }
  ];

  const services = [
    {
      icon: FaPlane,
      title: 'Flights',
      description: 'Book domestic and international flights with the best airlines',
      path: '/flights',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: FaHotel,
      title: 'Hotels',
      description: 'Find the perfect accommodation for your stay',
      path: '/hotels',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: FaRoute,
      title: 'Holiday Packages',
      description: 'All-inclusive vacation packages with amazing deals',
      path: '/packages',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: FaTrain,
      title: 'Trains',
      description: 'Book train tickets for comfortable journeys',
      path: '/trains',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Site Title - absolutely positioned over hero image, no bar */}
      <h1 className="absolute top-8 left-1/2 -translate-x-1/2 z-30 text-4xl md:text-5xl font-extrabold text-cyan-900 text-center tracking-wide drop-shadow-lg">TRAVEL TOURISM</h1>
      {/* Hero Section */}
      <div className="relative w-full h-[80vh] flex items-stretch">
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80"
          alt="Travel Background"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        {/* Overlay with paint effect */}
        <div className="relative z-10 flex flex-1">
          <div className="flex flex-col justify-center pl-12 pr-8 py-12 bg-cyan-900/70 w-full max-w-xl min-h-full rounded-r-[120px] shadow-xl">
            <span className="text-white text-lg font-semibold tracking-widest mb-2">BEST TRAVEL AGENCY</span>
            <h1 className="text-6xl font-extrabold text-white mb-2 drop-shadow-lg">EXPLORE</h1>
            <h2 className="text-3xl font-bold text-white mb-4">THE WORLD</h2>
            <p className="text-cyan-100 mb-8 max-w-md">Discover new places, unique experiences, and the best deals for your next adventure. Book flights, hotels, and more with us!</p>
            <div className="flex space-x-4">
              <Link to="/packages" className="px-6 py-3 bg-white text-cyan-900 font-bold rounded-full shadow hover:bg-cyan-100 transition">Discover</Link>
              <Link to="/about" className="px-6 py-3 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-cyan-900 transition">Know More</Link>
              <Link to="/login" className="px-6 py-3 bg-cyan-600 text-white font-bold rounded-full shadow hover:bg-cyan-700 transition">Login</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Booking/Search Options Section */}
      <div ref={bookingRef} className="max-w-6xl mx-auto px-4 -mt-16 md:-mt-24 relative z-10">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          {/* Search Type Tabs */}
          <div className="flex space-x-1 mb-8">
            <button
              onClick={() => setSearchType('flights')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                searchType === 'flights' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FaPlane className="inline mr-2" />
              Flights
            </button>
            <button
              onClick={() => setSearchType('trains')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                searchType === 'trains' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FaTrain className="inline mr-2" />
              Trains
            </button>
            <button
              onClick={() => setSearchType('hotels')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                searchType === 'hotels' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FaHotel className="inline mr-2" />
              Hotels
            </button>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-6">
            {searchType !== 'hotels' ? (
              // Transportation Search Form
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaMapMarkerAlt className="inline mr-1" />
                    From
                  </label>
                  <input
                    type="text"
                    placeholder={searchType === 'trains' ? 'Enter city or station' : 'Enter city or airport'}
                    value={searchData.from}
                    onChange={(e) => handleInputChange('from', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaMapMarkerAlt className="inline mr-1" />
                    To
                  </label>
                  <input
                    type="text"
                    placeholder={searchType === 'trains' ? 'Enter city or station' : 'Enter city or airport'}
                    value={searchData.to}
                    onChange={(e) => handleInputChange('to', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaCalendarAlt className="inline mr-1" />
                    Departure
                  </label>
                  <input
                    type="date"
                    value={searchData.departure}
                    onChange={(e) => handleInputChange('departure', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaCalendarAlt className="inline mr-1" />
                    Return (Optional)
                  </label>
                  <input
                    type="date"
                    value={searchData.return}
                    onChange={(e) => handleInputChange('return', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaUsers className="inline mr-1" />
                    Passengers
                  </label>
                  <select
                    value={searchData.passengers}
                    onChange={(e) => handleInputChange('passengers', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              // Hotel Search Form
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaMapMarkerAlt className="inline mr-1" />
                    Destination
                  </label>
                  <input
                    type="text"
                    placeholder="Enter city or hotel name"
                    value={searchData.to}
                    onChange={(e) => handleInputChange('to', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaCalendarAlt className="inline mr-1" />
                    Check-in
                  </label>
                  <input
                    type="date"
                    value={searchData.checkIn}
                    onChange={(e) => handleInputChange('checkIn', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaCalendarAlt className="inline mr-1" />
                    Check-out
                  </label>
                  <input
                    type="date"
                    value={searchData.checkOut}
                    onChange={(e) => handleInputChange('checkOut', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaUsers className="inline mr-1" />
                    Guests
                  </label>
                  <select
                    value={searchData.guests}
                    onChange={(e) => handleInputChange('guests', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center mx-auto"
              >
                <FaSearch className="mr-2" />
                Search {searchType.charAt(0).toUpperCase() + searchType.slice(1)}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Us?</h2>
          <p className="text-gray-600">Experience the best in travel booking with our comprehensive platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaPlane className="text-2xl text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Best Flight Deals</h3>
            <p className="text-gray-600">Find the cheapest flights with our advanced search algorithms</p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTrain className="text-2xl text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Railway Tickets</h3>
            <p className="text-gray-600">Book train tickets with real-time availability and instant confirmation</p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaHotel className="text-2xl text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Hotel Stays</h3>
            <p className="text-gray-600">Luxury and budget hotels with best price guarantees</p>
          </div>
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Popular Destinations</h2>
            <p className="text-gray-600">Explore the most sought-after travel destinations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Mumbai', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', description: 'The City of Dreams' },
              { name: 'Delhi', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', description: 'Heart of India' },
              { name: 'Bangalore', image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', description: 'Garden City' },
              { name: 'Chennai', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', description: 'Gateway to South India' },
              { name: 'Kolkata', image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', description: 'City of Joy' },
              { name: 'Hyderabad', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', description: 'Pearl City' }
            ].map((destination, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img src={destination.image} alt={destination.name} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{destination.name}</h3>
                  <p className="text-gray-600 mb-4">{destination.description}</p>
                  <button 
                    onClick={() => {
                      setSearchData(prev => ({ ...prev, to: destination.name }));
                      setSearchType('flights');
                      scrollToBooking();
                    }}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Explore →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 