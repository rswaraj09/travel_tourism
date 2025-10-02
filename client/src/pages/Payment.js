import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    cardNumber: '',
    cvv: '',
    month: '',
    year: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      // Simulate payment and save booking/payment data
      const res = await fetch(`/api/bookings/${bookingId}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Payment failed');
      setConfirmed(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Booking Confirmed!</h2>
          <p className="mb-6">Your payment was successful and your booking is confirmed.</p>
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded font-semibold"
            onClick={() => navigate('/')}
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-bold mb-6 flex justify-between items-center">
          ORDER OVERVIEW
          <span className="text-blue-700 text-lg font-semibold">€ 32.50 EUR</span>
        </h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">First name</label>
          <input name="firstName" value={form.firstName} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Last name</label>
          <input name="lastName" value={form.lastName} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Card number</label>
          <input name="cardNumber" value={form.cardNumber} onChange={handleChange} className="w-full border rounded px-3 py-2" required maxLength={19} />
        </div>
        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <label className="block text-gray-700 mb-1">CVV</label>
            <input name="cvv" value={form.cvv} onChange={handleChange} className="w-full border rounded px-3 py-2" required maxLength={4} />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 mb-1">Valid until</label>
            <div className="flex gap-2">
              <select name="month" value={form.month} onChange={handleChange} className="border rounded px-2 py-2" required>
                <option value="">Month</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i+1} value={String(i+1).padStart(2, '0')}>{String(i+1).padStart(2, '0')}</option>
                ))}
              </select>
              <select name="year" value={form.year} onChange={handleChange} className="border rounded px-2 py-2" required>
                <option value="">Year</option>
                {[...Array(12)].map((_, i) => {
                  const year = new Date().getFullYear() + i;
                  return <option key={year} value={year}>{year}</option>;
                })}
              </select>
            </div>
          </div>
        </div>
        {/* Card logos row (static) */}
        <div className="flex gap-2 mb-6 mt-2">
          <img src="https://img.icons8.com/color/32/000000/visa.png" alt="Visa" />
          <img src="https://img.icons8.com/color/32/000000/mastercard-logo.png" alt="Mastercard" />
          <img src="https://img.icons8.com/color/32/000000/amex.png" alt="Amex" />
          <img src="https://img.icons8.com/color/32/000000/discover.png" alt="Discover" />
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="flex gap-4 mt-6">
          <button
            type="button"
            className="flex-1 bg-gray-700 text-white py-2 rounded font-semibold"
            onClick={() => navigate(-1)}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-green-600 text-white py-2 rounded font-semibold"
            disabled={submitting}
          >
            {submitting ? 'Processing...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Payment; 