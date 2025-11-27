import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { ordersAPI } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    shipping_first_name: '',
    shipping_last_name: '',
    shipping_email: '',
    shipping_phone: '',
    shipping_address: '',
    shipping_city: '',
    shipping_country: '',
    shipping_zip_code: '',
    payment_method: 'online',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [order, setOrder] = useState(null);

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Checkout</h1>
          <p className="text-gray-600">Your cart is empty.</p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const orderData = {
        ...formData,
        items: cart.items.map((item) => ({
          product: item.product.id,
          quantity: item.quantity,
        })),
        total_amount: getCartTotal(),
      };
      // Simulate payment and create order
      const res = await ordersAPI.createOrder(orderData);
      setOrder(res.data);
      clearCart();
    } catch (err) {
      alert('Checkout failed');
    }
    setIsSubmitting(false);
  };

  if (order) {
    // Order confirmation
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-lg">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order number is <span className="font-bold">{order.order_number}</span>.
          </p>
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">Order Summary</h2>
            <ul>
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.product.title} x {item.quantity} = ${item.total_price}
                </li>
              ))}
            </ul>
            <div className="mt-2 font-bold">Total: ${order.total_amount}</div>
          </div>
          <button className="btn btn-primary w-full" onClick={() => navigate('/orders')}>
            View My Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-lg mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Checkout</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block">First Name</label>
                <input name="shipping_first_name" value={formData.shipping_first_name} onChange={handleChange} className="input w-full border px-3 py-2 rounded" required />
              </div>
              <div>
                <label className="block">Last Name</label>
                <input name="shipping_last_name" value={formData.shipping_last_name} onChange={handleChange} className="input w-full border px-3 py-2 rounded" required />
              </div>
            </div>
            <div>
              <label className="block">Email</label>
              <input name="shipping_email" type="email" value={formData.shipping_email} onChange={handleChange} className="input w-full border px-3 py-2 rounded" required />
            </div>
            <div>
              <label className="block">Phone</label>
              <input name="shipping_phone" value={formData.shipping_phone} onChange={handleChange} className="input w-full border px-3 py-2 rounded" required />
            </div>
            <div>
              <label className="block">Address</label>
              <input name="shipping_address" value={formData.shipping_address} onChange={handleChange} className="input w-full border px-3 py-2 rounded" required />
            </div>
            <div>
              <label className="block">City</label>
              <input name="shipping_city" value={formData.shipping_city} onChange={handleChange} className="input w-full border px-3 py-2 rounded" required />
            </div>
            <div>
              <label className="block">Country</label>
              <input name="shipping_country" value={formData.shipping_country} onChange={handleChange} className="input w-full border px-3 py-2 rounded" required />
            </div>
            <div>
              <label className="block">ZIP Code</label>
              <input name="shipping_zip_code" value={formData.shipping_zip_code} onChange={handleChange} className="input w-full border px-3 py-2 rounded" required />
            </div>
            <div>
              <label className="block">Payment Method</label>
              <select name="payment_method" value={formData.payment_method} onChange={handleChange} className="input w-full border px-3 py-2 rounded">
                <option value="online">Online (Simulated)</option>
                <option value="cod">Cash on Delivery</option>
              </select>
            </div>
            <div className="mt-4 font-bold text-xl">
              Total: ${getCartTotal()}
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;





