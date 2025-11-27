import React, { createContext, useContext, useState, useEffect } from 'react';
import { wishlistAPI } from '../utils/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      // For guest users, we'll use localStorage
      const savedWishlist = localStorage.getItem('guest_wishlist');
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await wishlistAPI.getWishlist();
      setWishlist(response.data.results || []);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    try {
      if (isAuthenticated) {
        await wishlistAPI.addToWishlist({ product: productId });
        await fetchWishlist();
        toast.success('Added to wishlist!');
      } else {
        addToGuestWishlist(productId);
        toast.success('Added to wishlist!');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add to wishlist';
      toast.error(message);
    }
  };

  const addToGuestWishlist = (productId) => {
    const guestWishlist = JSON.parse(localStorage.getItem('guest_wishlist') || '[]');
    
    if (!guestWishlist.find(item => item.product.id === productId)) {
      guestWishlist.push({
        id: Date.now().toString(),
        product: { id: productId },
        created_at: new Date().toISOString(),
      });
      localStorage.setItem('guest_wishlist', JSON.stringify(guestWishlist));
      setWishlist(guestWishlist);
    }
  };

  const removeFromWishlist = async (itemId) => {
    try {
      if (isAuthenticated) {
        await wishlistAPI.removeFromWishlist(itemId);
        await fetchWishlist();
        toast.success('Removed from wishlist!');
      } else {
        removeFromGuestWishlist(itemId);
        toast.success('Removed from wishlist!');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove from wishlist';
      toast.error(message);
    }
  };

  const removeFromGuestWishlist = (itemId) => {
    const guestWishlist = JSON.parse(localStorage.getItem('guest_wishlist') || '[]');
    const updatedWishlist = guestWishlist.filter(item => item.id !== itemId);
    localStorage.setItem('guest_wishlist', JSON.stringify(updatedWishlist));
    setWishlist(updatedWishlist);
  };

  const toggleWishlist = async (productId) => {
    try {
      if (isAuthenticated) {
        const response = await wishlistAPI.toggleWishlist(productId);
        await fetchWishlist();
        toast.success(response.data.message);
      } else {
        toggleGuestWishlist(productId);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to toggle wishlist';
      toast.error(message);
    }
  };

  const toggleGuestWishlist = (productId) => {
    const guestWishlist = JSON.parse(localStorage.getItem('guest_wishlist') || '[]');
    const existingItem = guestWishlist.find(item => item.product.id === productId);
    
    if (existingItem) {
      removeFromGuestWishlist(existingItem.id);
      toast.success('Removed from wishlist!');
    } else {
      addToGuestWishlist(productId);
      toast.success('Added to wishlist!');
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.product.id === productId);
  };

  const getWishlistCount = () => {
    return wishlist.length;
  };

  const clearWishlist = async () => {
    try {
      if (isAuthenticated) {
        // TODO: Implement clear wishlist API
        setWishlist([]);
        toast.success('Wishlist cleared!');
      } else {
        localStorage.removeItem('guest_wishlist');
        setWishlist([]);
        toast.success('Wishlist cleared!');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to clear wishlist';
      toast.error(message);
    }
  };

  const value = {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    getWishlistCount,
    clearWishlist,
    fetchWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};



