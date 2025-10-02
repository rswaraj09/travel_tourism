import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { FaPlane, FaTrain, FaBus, FaHotel, FaStar, FaClock, FaMapMarkerAlt, FaUsers, FaCalendarAlt, FaCreditCard, FaShieldAlt, FaCheck } from 'react-icons/fa';

const BookingDetails = () => {
  const { type, id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    passengers: [],
    contactInfo: {
      name: '',
      email: '',
      phone: ''
    },
    paymentMethod: 'card'
  });

  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const date = searchParams.get('date') || '';
  const passengers = parseInt(searchParams.get('passengers')) || 1;

  useEffect(() => {
    const fetchItemDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/${type}/${id}`);
        const data = await response.json();
        setItem(data);
        
        // Initialize passengers array
        const passengersArray = [];
        for (let i = 0; i < passengers; i++) {
          passengersArray.push({
            firstName: '',
            lastName: '',
            age: '',
            gender: 'male',
            seatPreference: ''
          });
        }
        setBookingData(prev => ({
          ...prev,
          passengers: passengersArray
        }));
      } catch (error) {
        console.error('Error fetching item details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [type, id, passengers]);

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

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...bookingData.passengers];
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value
    };
    setBookingData(prev => ({
      ...prev,
      passengers: updatedPassengers
    }));
  };

  const handleContactChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value
      }
    }));
  };

  const getBasePrice = () => {
    if (!item) return null;
    if (type === 'flights') return item.seats?.economy?.price ?? item.price ?? null;
    if (type === 'trains') return item.seats?.ac3?.price ?? item.price ?? null;
    if (type === 'buses') return item.seats?.sleeper?.price ?? item.price ?? null;
    if (type === 'hotels') return item.rooms?.deluxe?.price ?? item.price ?? null;
    return null;
  };

  const calculateTotal = () => {
    const basePrice = getBasePrice();
    if (basePrice == null) return 0;
    return basePrice * passengers;
  };

  const handleBooking = async () => {
    try {
      const bookingPayload = {
        type,
        itemId: id,
        passengers: bookingData.passengers,
        contactInfo: bookingData.contactInfo,
        totalAmount: calculateTotal(),
        from,
        to,
        date
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(bookingPayload)
      });

      if (response.ok) {
        const booking = await response.json();
        navigate(`/payment/${booking.id}`);
      } else {
        alert('Booking failed. Please try again.');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Booking failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Item not found</h2>
          <p className="text-gray-600">The requested item could not be found.</p>
        </div>
      </div>
    );
  }

  const renderItemDetails = () => {
    switch (type) {
      case 'flights':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <img src={item.airline.logo} alt={item.airline.name} className="w-16 h-12 object-contain" />
                <div>
                  <h2 className="text-2xl font-bold">{item.airline.name}</h2>
                  <p className="text-gray-600">Flight {item.flightNumber}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-600">{formatPrice(item.seats.economy.price)}</p>
                <p className="text-gray-500">per person</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="text-center">
                <p className="text-2xl font-semibold">{item.departure.time}</p>
                <p className="text-lg text-gray-600">{item.origin.airport.code}</p>
                <p className="text-sm text-gray-500">{item.origin.airport.city}</p>
                <p className="text-xs text-gray-400">Terminal {item.departure.terminal}</p>
              </div>
              
              <div className="flex-1 mx-8">
                <div className="flex items-center justify-center">
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <FaPlane className="mx-4 text-blue-500 text-2xl" />
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>
                <p className="text-center text-gray-600 mt-2">{formatDuration(item.duration)}</p>
              </div>
              
              <div className="text-center">
                <p className="text-2xl font-semibold">{item.arrival.time}</p>
                <p className="text-lg text-gray-600">{item.destination.airport.code}</p>
                <p className="text-sm text-gray-500">{item.destination.airport.city}</p>
                <p className="text-xs text-gray-400">Terminal {item.arrival.terminal}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p><strong>Aircraft:</strong> {item.aircraft}</p>
                <p><strong>Available Seats:</strong> {item.seats.economy.available}</p>
              </div>
              <div>
                <p><strong>Amenities:</strong> {item.amenities.join(', ')}</p>
                <p><strong>Baggage:</strong> {item.baggage.cabin.weight}kg cabin, {item.baggage.checked.weight}kg checked</p>
              </div>
            </div>
          </div>
        );

      case 'trains':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <img src={item.operator.logo} alt={item.operator.name} className="w-16 h-12 object-contain" />
                <div>
                  <h2 className="text-2xl font-bold">{item.trainName}</h2>
                  <p className="text-gray-600">Train {item.trainNumber}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-green-600">{formatPrice(item.seats.ac3.price)}</p>
                <p className="text-gray-500">AC 3 Tier</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="text-center">
                <p className="text-2xl font-semibold">{item.departure.time}</p>
                <p className="text-lg text-gray-600">{item.origin.station.code}</p>
                <p className="text-sm text-gray-500">{item.origin.station.city}</p>
                <p className="text-xs text-gray-400">Platform {item.departure.platform}</p>
              </div>
              
              <div className="flex-1 mx-8">
                <div className="flex items-center justify-center">
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <FaTrain className="mx-4 text-green-500 text-2xl" />
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>
                <p className="text-center text-gray-600 mt-2">{formatDuration(item.duration)}</p>
              </div>
              
              <div className="text-center">
                <p className="text-2xl font-semibold">{item.arrival.time}</p>
                <p className="text-lg text-gray-600">{item.destination.station.code}</p>
                <p className="text-sm text-gray-500">{item.destination.station.city}</p>
                <p className="text-xs text-gray-400">Platform {item.arrival.platform}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p><strong>Distance:</strong> {item.distance} km</p>
                <p><strong>Available Seats:</strong> {item.seats.ac3.available}</p>
              </div>
              <div>
                <p><strong>Amenities:</strong> {item.amenities.join(', ')}</p>
                <p><strong>Running Days:</strong> {item.runningDays.join(', ')}</p>
              </div>
            </div>
          </div>
        );

      case 'buses':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <img src={item.operator.logo} alt={item.operator.name} className="w-16 h-12 object-contain" />
                <div>
                  <h2 className="text-2xl font-bold">{item.busName}</h2>
                  <p className="text-gray-600">Bus {item.busNumber}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-orange-600">{formatPrice(item.seats.sleeper.price)}</p>
                <p className="text-gray-500">AC Sleeper</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="text-center">
                <p className="text-2xl font-semibold">{item.departure.time}</p>
                <p className="text-lg text-gray-600">{item.origin.station.code}</p>
                <p className="text-sm text-gray-500">{item.origin.station.city}</p>
                <p className="text-xs text-gray-400">Platform {item.departure.platform}</p>
              </div>
              
              <div className="flex-1 mx-8">
                <div className="flex items-center justify-center">
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <FaBus className="mx-4 text-orange-500 text-2xl" />
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>
                <p className="text-center text-gray-600 mt-2">{formatDuration(item.duration)}</p>
              </div>
              
              <div className="text-center">
                <p className="text-2xl font-semibold">{item.arrival.time}</p>
                <p className="text-lg text-gray-600">{item.destination.station.code}</p>
                <p className="text-sm text-gray-500">{item.destination.station.city}</p>
                <p className="text-xs text-gray-400">Platform {item.arrival.platform}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p><strong>Distance:</strong> {item.distance} km</p>
                <p><strong>Available Seats:</strong> {item.seats.sleeper.available}</p>
              </div>
              <div>
                <p><strong>Amenities:</strong> {item.amenities.join(', ')}</p>
                <p><strong>Bus Type:</strong> {item.busType}</p>
              </div>
            </div>
          </div>
        );

      case 'hotels':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start space-x-4">
                <img src={item.images[0]} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                <div>
                  <h2 className="text-2xl font-bold">{item.name}</h2>
                  <p className="text-gray-600">{item.location.address}</p>
                  <div className="flex items-center mt-2">
                    {[...Array(item.rating)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 text-sm" />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">({item.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-purple-600">
                  {getBasePrice() != null ? formatPrice(getBasePrice()) : 'Price not available'}
                </p>
                <p className="text-gray-500">per night</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold mb-2">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {item.amenities.slice(0, 6).map((amenity, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Policies</h3>
                <p className="text-sm text-gray-600">Check-in: {item.policies.checkIn}</p>
                <p className="text-sm text-gray-600">Check-out: {item.policies.checkOut}</p>
                <p className="text-sm text-gray-600">{item.policies.cancellation}</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Booking Details</h1>
          <p className="text-gray-600">Complete your booking by providing passenger and contact information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Item Details */}
          <div className="lg:col-span-2">
            {renderItemDetails()}

            {/* Passenger Information */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="text-xl font-semibold mb-4">Passenger Information</h3>
              {bookingData.passengers.map((passenger, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
                  <h4 className="font-medium mb-3">Passenger {index + 1}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        value={passenger.firstName}
                        onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        value={passenger.lastName}
                        onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                      <input
                        type="number"
                        value={passenger.age}
                        onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <select
                        value={passenger.gender}
                        onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={bookingData.contactInfo.name}
                    onChange={(e) => handleContactChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={bookingData.contactInfo.email}
                    onChange={(e) => handleContactChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={bookingData.contactInfo.phone}
                    onChange={(e) => handleContactChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Proceed to Payment Button at the bottom */}
            <div className="flex justify-end mt-8">
              <button
                onClick={handleBooking}
                className="bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails; 