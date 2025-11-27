import React from 'react';
import { useCart } from '../contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Cart = () => {
  const { cart, loading, updateCartItem, removeFromCart, clearCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Shopping Cart</h1>
          <p className="text-gray-600 mb-4">Your cart is empty.</p>
          <Link to="/products" className="btn btn-primary">Shop Now</Link>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (itemId, quantity) => {
    if (quantity > 0) {
      updateCartItem(itemId, { quantity });
    }
  };

  const handleRemove = (itemId) => {
    removeFromCart(itemId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Shopping Cart</h1>
          <table className="w-full mb-6">
            <thead>
              <tr>
                <th className="text-left py-2">Product</th>
                <th className="text-left py-2">Price</th>
                <th className="text-left py-2">Quantity</th>
                <th className="text-left py-2">Total</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-2">{item.product.title}</td>
                  <td className="py-2">${item.product.price}</td>
                  <td className="py-2">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                      className="border rounded px-2 py-1 w-16"
                    />
                  </td>
                  <td className="py-2">${item.total_price}</td>
                  <td className="py-2">
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleRemove(item.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mb-4">
            <button onClick={clearCart} className="btn btn-outline btn-danger">
              Clear Cart
            </button>
            <div className="text-xl font-bold">
              Total: ${getCartTotal()}
            </div>
          </div>
          <button
            className="btn btn-primary w-full"
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;

