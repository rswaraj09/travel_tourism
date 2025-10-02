import React, { useEffect, useState } from 'react';

const Trains = () => {
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
          body: JSON.stringify({ from: 'Delhi', to: 'Mumbai', date: new Date().toISOString().slice(0,10), preferences: { transportType: 'train' } })
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Train Booking</h1>
        <div className="bg-white rounded-lg shadow p-6">
          {loading ? (
            <p className="text-gray-600">Loading AI recommendations...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : aiData ? (
            <div>
              <h2 className="text-xl font-semibold mb-2">AI Train Recommendations</h2>
              {aiData.transportation && aiData.transportation.length > 0 ? (
                <div>
                  {aiData.transportation.filter(t => t.type === 'train').map((t, i) => (
                    <div key={i} className="mb-2 p-2 border rounded">
                      <strong className="capitalize">{t.type}</strong>: {t.recommendation}<br/>
                      <span className="text-sm">Cost: {t.estimatedCost} | Duration: {t.duration}</span>
                      <div className="text-xs mt-1">Pros: {t.pros?.join(', ')}</div>
                      <div className="text-xs">Cons: {t.cons?.join(', ')}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No train recommendations available.</p>
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

export default Trains; 