import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaPlane, FaTrain, FaBus, FaHotel, FaStar, FaClock, FaMapMarkerAlt, FaUsers, FaFilter, FaSort } from 'react-icons/fa';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState({
    flights: [],
    trains: [],
    buses: [],
    hotels: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all-transport');
  const [filters, setFilters] = useState({
    priceRange: '',
    sortBy: 'price',
    amenities: []
  });

  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const departure = searchParams.get('departure') || '';
  const returnDate = searchParams.get('return') || '';
  const passengers = searchParams.get('passengers') || '1';

  // Map airport codes to city names for hotel search
  const getCityFromCode = (code) => {
    const cityMap = {
      'DEL': 'Delhi',
      'BOM': 'Mumbai',
      'BLR': 'Bangalore',
      'HYD': 'Hyderabad',
      'CCU': 'Kolkata',
      'MAA': 'Chennai',
      'PNQ': 'Pune',
      'GOI': 'Goa',
      'JAI': 'Jaipur',
      'AMD': 'Ahmedabad'
    };
    return cityMap[code] || code;
  };

  useEffect(() => {
    // Set default tab based on search type
    if (searchParams.get('includeFlights') === 'true') setActiveTab('flights');
    else if (searchParams.get('includeTrains') === 'true') setActiveTab('trains');
    else if (searchParams.get('includeBuses') === 'true') setActiveTab('buses');
    else if (searchParams.get('includeHotels') === 'true') setActiveTab('hotels');
    else setActiveTab('all-transport');
  }, [searchParams]);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        let hotelData = { hotels: [] };
        let flightData = { flights: [] };
        let trainData = { trains: [] };
        let busData = { buses: [] };
        if (searchParams.get('includeHotels') === 'true') {
          // Only fetch hotels
          const location = searchParams.get('location') || '';
          const checkIn = searchParams.get('checkIn') || '';
          const checkOut = searchParams.get('checkOut') || '';
          const guests = searchParams.get('guests') || '1';
          const rooms = searchParams.get('rooms') || '1';
          const hotelResponse = await fetch(`/api/hotels/search?location=${encodeURIComponent(location)}&checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&guests=${guests}&rooms=${rooms}`);
          hotelData = await hotelResponse.json();
        } else {
          // Always fetch flights and trains regardless of search type
          const flightResponse = await fetch(`/api/flights/search?from=${from}&to=${to}&departure=${departure}&return=${returnDate}&passengers=${passengers}`);
          flightData = await flightResponse.json();

          // Always fetch trains regardless of search type
          const trainResponse = await fetch(`/api/trains/search?from=${from}&to=${to}&departure=${departure}&return=${returnDate}&passengers=${passengers}`);
          trainData = await trainResponse.json();

          // Fetch buses only if specifically requested
          if (searchParams.get('includeBuses') === 'true') {
            const busResponse = await fetch(`/api/buses/search?from=${from}&to=${to}&departure=${departure}&return=${returnDate}&passengers=${passengers}`);
            busData = await busResponse.json();
          }
        }
        setResults({
          flights: flightData.flights || [],
          trains: trainData.trains || [],
          buses: busData.buses || [],
          hotels: hotelData.hotels || []
        });
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [from, to, departure, returnDate, passengers, searchParams]);

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const renderFlightCard = (flight) => (
    <div key={flight.id} className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img src={flight.airline?.logo || "/default-flight-logo.png"} alt={flight.airline?.name || "Airline"} className="w-12 h-8 object-contain" />
          <div>
            <h3 className="font-semibold text-lg">{flight.airline?.name || "Airline"}</h3>
            <p className="text-gray-600">{flight.flightNumber}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-600">{flight.seats?.economy?.price != null ? formatPrice(flight.seats.economy.price) : "N/A"}</p>
          <p className="text-sm text-gray-500">per person</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="text-center">
          <p className="text-lg font-semibold">{flight.departure.time}</p>
          <p className="text-sm text-gray-600">{flight.origin.airport.code}</p>
          <p className="text-xs text-gray-500">{flight.origin.airport.city}</p>
        </div>
        
        <div className="flex-1 mx-4">
          <div className="flex items-center justify-center">
            <div className="flex-1 h-px bg-gray-300"></div>
            <FaPlane className="mx-2 text-blue-500" />
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-1">{isNaN(Number(flight.duration)) ? "N/A" : formatDuration(Number(flight.duration))}</p>
        </div>
        
        <div className="text-center">
          <p className="text-lg font-semibold">{flight.arrival.time}</p>
          <p className="text-sm text-gray-600">{flight.destination.airport.code}</p>
          <p className="text-xs text-gray-500">{flight.destination.airport.city}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4 pt-4 border-t">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span className="flex items-center">
            <FaUsers className="mr-1" />
            {flight.seats.economy.available} seats left
          </span>
          <span className="flex items-center">
            <FaClock className="mr-1" />
            {flight.departure.terminal}
          </span>
        </div>
        {flight.id ? (
          <Link 
            to={`/booking/flight/${flight.id}?from=${from}&to=${to}&date=${departure}&passengers=${passengers}`}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Book Now
          </Link>
        ) : (
          <button className="bg-blue-300 text-white px-6 py-2 rounded-lg cursor-not-allowed" disabled>
            Book Now
          </button>
        )}
      </div>
    </div>
  );

  const renderTrainCard = (train) => (
    <div key={train.id} className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img src={train.operator?.logo || "/default-train-logo.png"} alt={train.operator?.name || "Train Operator"} className="w-12 h-8 object-contain" />
          <div>
            <h3 className="font-semibold text-lg">{train.trainName}</h3>
            <p className="text-gray-600">{train.trainNumber}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-green-600">{train.seats?.ac3?.price != null ? formatPrice(train.seats.ac3.price) : "N/A"}</p>
          <p className="text-sm text-gray-500">AC 3 Tier</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="text-center">
          <p className="text-lg font-semibold">{train.departure.time}</p>
          <p className="text-sm text-gray-600">{train.origin.station.code}</p>
          <p className="text-xs text-gray-500">{train.origin.station.city}</p>
        </div>
        
        <div className="flex-1 mx-4">
          <div className="flex items-center justify-center">
            <div className="flex-1 h-px bg-gray-300"></div>
            <FaTrain className="mx-2 text-green-500" />
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-1">{isNaN(Number(train.duration)) ? "N/A" : formatDuration(Number(train.duration))}</p>
        </div>
        
        <div className="text-center">
          <p className="text-lg font-semibold">{train.arrival.time}</p>
          <p className="text-sm text-gray-600">{train.destination.station.code}</p>
          <p className="text-xs text-gray-500">{train.destination.station.city}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4 pt-4 border-t">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span className="flex items-center">
            <FaUsers className="mr-1" />
            {train.seats?.ac3?.available ?? 0} seats left
          </span>
          <span className="flex items-center">
            <FaMapMarkerAlt className="mr-1" />
            Platform {train.departure.platform}
          </span>
        </div>
        {train.id ? (
          <Link 
            to={`/booking/train/${train.id}?from=${from}&to=${to}&date=${departure}&passengers=${passengers}`}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Book Now
          </Link>
        ) : (
          <button className="bg-green-300 text-white px-6 py-2 rounded-lg cursor-not-allowed" disabled>
            Book Now
          </button>
        )}
      </div>
    </div>
  );

  const renderBusCard = (bus) => (
    <div key={bus.id} className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img src={bus.operator?.logo || "/default-bus-logo.png"} alt={bus.operator?.name || "Bus Operator"} className="w-12 h-8 object-contain" />
          <div>
            <h3 className="font-semibold text-lg">{bus.busName}</h3>
            <p className="text-gray-600">{bus.busNumber}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-orange-600">{bus.seats?.sleeper?.price != null ? formatPrice(bus.seats.sleeper.price) : "N/A"}</p>
          <p className="text-sm text-gray-500">AC Sleeper</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="text-center">
          <p className="text-lg font-semibold">{bus.departure.time}</p>
          <p className="text-sm text-gray-600">{bus.origin.station.code}</p>
          <p className="text-xs text-gray-500">{bus.origin.station.city}</p>
        </div>
        
        <div className="flex-1 mx-4">
          <div className="flex items-center justify-center">
            <div className="flex-1 h-px bg-gray-300"></div>
            <FaBus className="mx-2 text-orange-500" />
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-1">{isNaN(Number(bus.duration)) ? "N/A" : formatDuration(Number(bus.duration))}</p>
        </div>
        
        <div className="text-center">
          <p className="text-lg font-semibold">{bus.arrival.time}</p>
          <p className="text-sm text-gray-600">{bus.destination.station.code}</p>
          <p className="text-xs text-gray-500">{bus.destination.station.city}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4 pt-4 border-t">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span className="flex items-center">
            <FaUsers className="mr-1" />
            {bus.seats?.sleeper?.available ?? 0} seats left
          </span>
          <span className="flex items-center">
            <FaMapMarkerAlt className="mr-1" />
            Platform {bus.departure.platform}
          </span>
        </div>
        {bus.id ? (
          <Link 
            to={`/booking/bus/${bus.id}?from=${from}&to=${to}&date=${departure}&passengers=${passengers}`}
            className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Book Now
          </Link>
        ) : (
          <button className="bg-orange-300 text-white px-6 py-2 rounded-lg cursor-not-allowed" disabled>
            Book Now
          </button>
        )}
      </div>
    </div>
  );

  const renderHotelCard = (hotel) => (
    <div key={hotel.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex">
        <img src={Array.isArray(hotel.images) && hotel.images.length > 0 ? hotel.images[0] : '/default-hotel.jpg'} alt={hotel.name} className="w-48 h-32 object-cover" />
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{hotel.name}</h3>
              <p className="text-gray-600 flex items-center mt-1">
                <FaMapMarkerAlt className="mr-1" />
                {hotel.location?.address || 'No address provided'}
              </p>
              <div className="flex items-center mt-2">
                {[...Array(hotel.rating)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 text-sm" />
                ))}
                <span className="ml-2 text-sm text-gray-600">({hotel.reviewCount} reviews)</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-purple-600">{formatPrice(hotel.price ?? 0)}</p>
              <p className="text-sm text-gray-500">per night</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(hotel.amenities) ? hotel.amenities.slice(0, 4) : []).map((amenity, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                  {amenity}
                </span>
              ))}
            </div>
            <Link 
              to={`/booking/hotel/${hotel.id}?location=${to}&checkIn=${departure}&guests=${passengers}`}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Searching for the best options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Search Results</h1>
          <div className="flex items-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center">
              <FaMapMarkerAlt className="mr-2" />
              <span className="font-semibold">{from}</span>
              <span className="mx-2">→</span>
              <span className="font-semibold">{to}</span>
            </div>
            <div className="flex items-center">
              <FaClock className="mr-2" />
              <span>{departure}</span>
            </div>
            <div className="flex items-center">
              <FaUsers className="mr-2" />
              <span>{passengers} {passengers === '1' ? 'passenger' : 'passengers'}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white rounded-lg shadow-md p-1 mb-6">
          {(results.hotels.length > 0 || searchParams.get('includeHotels') === 'true') && (
            <button
              onClick={() => setActiveTab('hotels')}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
                activeTab === 'hotels' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FaHotel className="inline mr-2" />
              Hotels ({results.hotels.length})
            </button>
          )}
          {searchParams.get('includeHotels') !== 'true' && (
            <>
              <button
                onClick={() => setActiveTab('all-transport')}
                className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
                  activeTab === 'all-transport' ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FaPlane className="inline mr-1" />
                <FaTrain className="inline mr-2" />
                All Transport ({results.flights.length + results.trains.length})
              </button>
              <button
                onClick={() => setActiveTab('flights')}
                className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
                  activeTab === 'flights' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FaPlane className="inline mr-2" />
                Flights ({results.flights.length})
              </button>
              <button
                onClick={() => setActiveTab('trains')}
                className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
                  activeTab === 'trains' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FaTrain className="inline mr-2" />
                Trains ({results.trains.length})
              </button>
              {(results.buses.length > 0 || searchParams.get('includeBuses') === 'true') && (
                <button
                  onClick={() => setActiveTab('buses')}
                  className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
                    activeTab === 'buses' ? 'bg-orange-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <FaBus className="inline mr-2" />
                  Buses ({results.buses.length})
                </button>
              )}
            </>
          )}
        </div>

        {/* Results */}
        <div className="space-y-6">
          {activeTab === 'hotels' && (
            <div>
              {results.hotels.length > 0 ? (
                results.hotels.map(renderHotelCard)
              ) : (
                <div className="text-center py-12">
                  <FaHotel className="text-6xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No hotels found</h3>
                  <p className="text-gray-500">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'all-transport' && (
            <div>
              {results.flights.length > 0 || results.trains.length > 0 ? (
                <>
                  {results.flights.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Flights</h2>
                      {results.flights.map(renderFlightCard)}
                    </div>
                  )}
                  {results.trains.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Trains</h2>
                      {results.trains.map(renderTrainCard)}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <FaPlane className="text-6xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No flights or trains found</h3>
                  <p className="text-gray-500">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'flights' && (
            <div>
              {results.flights.length > 0 ? (
                results.flights.map(renderFlightCard)
              ) : (
                <div className="text-center py-12">
                  <FaPlane className="text-6xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No flights found</h3>
                  <p className="text-gray-500">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'trains' && (
            <div>
              {results.trains.length > 0 ? (
                results.trains.map(renderTrainCard)
              ) : (
                <div className="text-center py-12">
                  <FaTrain className="text-6xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No trains found</h3>
                  <p className="text-gray-500">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'buses' && (
            <div>
              {results.buses.length > 0 ? (
                results.buses.map(renderBusCard)
              ) : (
                <div className="text-center py-12">
                  <FaBus className="text-6xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No buses found</h3>
                  <p className="text-gray-500">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults; 