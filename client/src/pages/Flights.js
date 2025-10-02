import React, { useEffect, useState } from 'react';

const Flights = () => {
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAI = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/ai-travel/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ from: 'Delhi', to: 'Mumbai', date: new Date().toISOString().slice(0,10) })
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Flight Search</h1>
        <div className="bg-white rounded-lg shadow p-6">
          {loading ? (
            <p className="text-gray-600">Loading AI recommendations...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : aiData ? (
            <div>
              <h2 className="text-xl font-semibold mb-2">AI Recommendations</h2>
              {aiData.transportation || aiData.hotels || aiData.routing || aiData.totalEstimatedCost ? (
                <React.Fragment>
                  {aiData.transportation && (
                    <div className="mb-4">
                      <h3 className="font-semibold mb-1">Transportation Options</h3>
                      {aiData.transportation.map((t, i) => (
                        <div key={i} className="mb-2 p-2 border rounded">
                          <strong className="capitalize">{t.type}</strong>: {t.recommendation}<br/>
                          <span className="text-sm">Cost: {t.estimatedCost} | Duration: {t.duration}</span>
                          <div className="text-xs mt-1">Pros: {t.pros?.join(', ')}</div>
                          <div className="text-xs">Cons: {t.cons?.join(', ')}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {aiData.hotels && (
                    <div className="mb-4">
                      <h3 className="font-semibold mb-1">Hotel Recommendations</h3>
                      {aiData.hotels.map((h, i) => (
                        <div key={i} className="mb-2 p-2 border rounded">
                          <strong>{h.name}</strong> ({h.category})<br/>
                          <span className="text-sm">{h.location} | {h.priceRange}</span>
                          <div className="text-xs mt-1">Amenities: {h.amenities?.join(', ')}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {aiData.routing && (
                    <div className="mb-4">
                      <h3 className="font-semibold mb-1">Routing & Tips</h3>
                      <div><strong>Optimal Route:</strong> {aiData.routing.optimalRoute}</div>
                      <div><strong>Alternatives:</strong> {aiData.routing.alternatives?.join('; ')}</div>
                      <div><strong>Tips:</strong> {aiData.routing.tips?.join('; ')}</div>
                    </div>
                  )}
                  {aiData.totalEstimatedCost && (
                    <div className="mb-2"><strong>Total Estimated Cost:</strong> {aiData.totalEstimatedCost}</div>
                  )}
                </React.Fragment>
              ) : (
                <p className="text-gray-600">No recommendations available.</p>
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

export default Flights; 