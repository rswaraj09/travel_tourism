const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

// Mock package data
const mockPackages = [
  {
    id: 1,
    name: 'Mumbai - Goa Beach Paradise',
    destination: {
      city: 'Goa',
      state: 'Goa',
      country: 'India',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    },
    duration: '5 Days / 4 Nights',
    price: {
      perPerson: 25000,
      total: 50000,
      currency: 'INR',
      discount: 15,
      originalPrice: 58824
    },
    inclusions: [
      'Return flights from Mumbai to Goa',
      '4 nights stay at 4-star beach resort',
      'Daily breakfast and dinner',
      'Airport transfers',
      'Half-day city tour',
      'Beach activities',
      'All taxes included'
    ],
    exclusions: [
      'Lunch',
      'Personal expenses',
      'Optional tours',
      'Travel insurance'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Goa',
        description: 'Arrive at Goa airport, transfer to hotel, evening at leisure'
      },
      {
        day: 2,
        title: 'North Goa Tour',
        description: 'Visit Fort Aguada, Calangute Beach, Baga Beach'
      },
      {
        day: 3,
        title: 'South Goa Tour',
        description: 'Explore Old Goa churches, Panjim city tour'
      },
      {
        day: 4,
        title: 'Beach Day',
        description: 'Relax at Colva Beach, water sports activities'
      },
      {
        day: 5,
        title: 'Departure',
        description: 'Check out and transfer to airport'
      }
    ],
    hotel: {
      name: 'Taj Holiday Village Resort & Spa',
      rating: 4.5,
      type: 'Beach Resort',
      amenities: ['Pool', 'Spa', 'Restaurant', 'Beach Access', 'WiFi']
    },
    flight: {
      airline: 'IndiGo',
      departure: '06:00',
      arrival: '07:30',
      duration: '1h 30m'
    },
    validFrom: '2024-01-01',
    validTo: '2024-12-31',
    maxTravelers: 6,
    cancellationPolicy: 'Free cancellation up to 7 days before travel',
    highlights: ['Beach Activities', 'Cultural Tours', 'Water Sports', 'Local Cuisine'],
    rating: 4.8,
    reviewCount: 156
  },
  {
    id: 2,
    name: 'Delhi - Jaipur Heritage Tour',
    destination: {
      city: 'Jaipur',
      state: 'Rajasthan',
      country: 'India',
      image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    },
    duration: '4 Days / 3 Nights',
    price: {
      perPerson: 18000,
      total: 36000,
      currency: 'INR',
      discount: 10,
      originalPrice: 40000
    },
    inclusions: [
      'Return flights from Delhi to Jaipur',
      '3 nights stay at heritage hotel',
      'Daily breakfast and dinner',
      'Airport transfers',
      'Full-day city tour',
      'Elephant ride at Amber Fort',
      'All taxes included'
    ],
    exclusions: [
      'Lunch',
      'Personal expenses',
      'Optional tours',
      'Travel insurance'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Jaipur',
        description: 'Arrive at Jaipur airport, transfer to hotel, evening at leisure'
      },
      {
        day: 2,
        title: 'Pink City Tour',
        description: 'Visit City Palace, Hawa Mahal, Jantar Mantar'
      },
      {
        day: 3,
        title: 'Amber Fort & Local Markets',
        description: 'Elephant ride at Amber Fort, shopping at Johari Bazaar'
      },
      {
        day: 4,
        title: 'Departure',
        description: 'Check out and transfer to airport'
      }
    ],
    hotel: {
      name: 'Rambagh Palace',
      rating: 5.0,
      type: 'Heritage Palace Hotel',
      amenities: ['Pool', 'Spa', 'Restaurant', 'Garden', 'WiFi', 'Butler Service']
    },
    flight: {
      airline: 'Air India',
      departure: '08:00',
      arrival: '09:15',
      duration: '1h 15m'
    },
    validFrom: '2024-01-01',
    validTo: '2024-12-31',
    maxTravelers: 4,
    cancellationPolicy: 'Free cancellation up to 5 days before travel',
    highlights: ['Heritage Sites', 'Cultural Experience', 'Palace Stay', 'Local Markets'],
    rating: 4.9,
    reviewCount: 89
  },
  {
    id: 3,
    name: 'Bangalore - Kerala Backwaters',
    destination: {
      city: 'Kerala',
      state: 'Kerala',
      country: 'India',
      image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    },
    duration: '6 Days / 5 Nights',
    price: {
      perPerson: 32000,
      total: 64000,
      currency: 'INR',
      discount: 20,
      originalPrice: 80000
    },
    inclusions: [
      'Return flights from Bangalore to Kochi',
      '5 nights stay at luxury resorts',
      'All meals included',
      'Airport transfers',
      'Houseboat cruise',
      'Ayurveda massage',
      'All taxes included'
    ],
    exclusions: [
      'Personal expenses',
      'Optional tours',
      'Travel insurance'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Kochi',
        description: 'Arrive at Kochi airport, transfer to resort, evening at leisure'
      },
      {
        day: 2,
        title: 'Kochi City Tour',
        description: 'Visit Fort Kochi, Chinese Fishing Nets, Jewish Synagogue'
      },
      {
        day: 3,
        title: 'Munnar Hill Station',
        description: 'Tea plantation tour, Eravikulam National Park'
      },
      {
        day: 4,
        title: 'Thekkady Wildlife',
        description: 'Periyar Wildlife Sanctuary, spice plantation'
      },
      {
        day: 5,
        title: 'Alleppey Backwaters',
        description: 'Houseboat cruise, traditional Kerala lunch'
      },
      {
        day: 6,
        title: 'Departure',
        description: 'Check out and transfer to airport'
      }
    ],
    hotel: {
      name: 'Kumarakom Lake Resort',
      rating: 4.8,
      type: 'Luxury Backwater Resort',
      amenities: ['Pool', 'Spa', 'Restaurant', 'Backwater View', 'WiFi', 'Boat Service']
    },
    flight: {
      airline: 'IndiGo',
      departure: '07:30',
      arrival: '08:45',
      duration: '1h 15m'
    },
    validFrom: '2024-01-01',
    validTo: '2024-12-31',
    maxTravelers: 4,
    cancellationPolicy: 'Free cancellation up to 10 days before travel',
    highlights: ['Backwaters', 'Wildlife', 'Ayurveda', 'Tea Plantations'],
    rating: 4.7,
    reviewCount: 203
  }
];

// @route   GET /api/packages
// @desc    Get all packages
// @access  Public
router.get('/', async (req, res) => {
  try {
    res.json(mockPackages);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/packages/search
// @desc    Search packages
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { destination, duration, priceRange, travelers } = req.query;
    
    // Filter packages based on search criteria
    let filteredPackages = mockPackages.filter(pkg => {
      const matchesDestination = !destination || 
                                pkg.destination.city.toLowerCase().includes(destination.toLowerCase()) ||
                                pkg.destination.state.toLowerCase().includes(destination.toLowerCase());
      
      const matchesDuration = !duration || pkg.duration.includes(duration);
      
      const matchesPrice = !priceRange || (() => {
        const [min, max] = priceRange.split('-').map(Number);
        return pkg.price.perPerson >= min && pkg.price.perPerson <= max;
      })();
      
      const matchesTravelers = !travelers || pkg.maxTravelers >= parseInt(travelers);
      
      return matchesDestination && matchesDuration && matchesPrice && matchesTravelers;
    });

    // Sort by price
    filteredPackages.sort((a, b) => a.price.perPerson - b.price.perPerson);

    res.json({
      packages: filteredPackages,
      searchCriteria: { destination, duration, priceRange, travelers },
      totalResults: filteredPackages.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/packages/:id
// @desc    Get package details
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const package = mockPackages.find(p => p.id === parseInt(req.params.id));
    if (!package) {
      return res.status(404).json({ error: 'Package not found' });
    }
    res.json(package);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 