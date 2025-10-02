import React, { useEffect, useState } from 'react';

const Hotels = () => {
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAI = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/ai-travel/hotel-recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ location: 'Mumbai', checkIn: new Date().toISOString().slice(0,10), checkOut: new Date().toISOString().slice(0,10), guests: 2 })
        });
        const data = await response.json();
        if (data.success) setAiData(data.data);
        else setError('No recommendations found.');
      } catch (err) {
        setError('Failed to fetch AI recommendations.');
      } finally {
        setLoading(false);
      }
    };
    fetchAI();
  }, []);

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Hotel Search</h1>
        <div className="bg-white rounded-lg shadow p-6">
          {loading ? (
            <p className="text-gray-600">Loading AI recommendations...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : aiData ? (
            <div>
              <h2 className="text-2xl font-bold">{aiData.hotels[0].name}</h2>
              <h2 className="text-xl font-semibold mb-2">AI Hotel Recommendations</h2>
              {aiData.hotels && aiData.hotels.length > 0 ? (
                <div>
                  {aiData.hotels.map((h, i) => (
                    <div key={i} className="mb-2 p-2 border rounded">
                      <strong>{h.name}</strong> ({h.category})<br/>
                      <span className="text-sm">{h.location} | {h.priceRange}</span>
                      <div className="text-xs mt-1">Amenities: {h.amenities?.join(', ')}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No hotel recommendations available.</p>
              )}
            </div>
          ) : (
            <p className="text-gray-600">No recommendations available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hotels; 