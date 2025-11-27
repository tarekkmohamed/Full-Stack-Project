import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaTrash } from 'react-icons/fa';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/UI/LoadingSpinner';
// ProductCard previously imported but not used
import toast from 'react-hot-toast';

const Wishlist = () => {
  const { wishlist, loading, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    
    addToCart(productId, 1);
  };

  const handleRemoveFromWishlist = (itemId) => {
    removeFromWishlist(itemId);
  };

  const handleClearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your wishlist?')) {
      clearWishlist();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Wishlist</h1>
          <p className="text-gray-600">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} in your wishlist
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">
              <FaHeart />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-gray-500 mb-6">
              Start adding products you love to your wishlist
            </p>
            <Link to="/products" className="btn btn-primary">
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleClearWishlist}
                  className="text-red-600 hover:text-red-800 flex items-center space-x-2"
                >
                  <FaTrash />
                  <span>Clear Wishlist</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
                  <Link to={`/products/${item.product.id}`}>
                    <div className="relative">
                      {item.product.primary_image ? (
                        <img
                          src={item.product.primary_image.image}
                          alt={item.product.primary_image.alt_text || item.product.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                          <i className="fas fa-image text-4xl text-gray-400"></i>
                        </div>
                      )}
                      
                      {/* Remove from Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemoveFromWishlist(item.id);
                        }}
                        className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-50"
                      >
                        <FaTrash className="text-red-500 text-sm" />
                      </button>
                    </div>
                  </Link>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {item.product.title}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {item.product.is_discount_active ? (
                          <>
                            <span className="text-lg font-bold text-red-600">
                              ${item.product.discounted_price}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ${item.product.price}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-gray-800">
                            ${item.product.price}
                          </span>
                        )}
                      </div>
                      
                      {item.product.brand_name && (
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {item.product.brand_name}
                        </span>
                      )}
                    </div>

                    <div className="text-sm text-gray-500 mb-4">
                      <span className={`font-medium ${
                        item.product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(item.product.id)}
                      disabled={item.product.stock_quantity === 0}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      <FaShoppingCart />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link to="/products" className="btn btn-primary">
                Continue Shopping
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;



