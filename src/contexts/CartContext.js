import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../utils/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      // For guest users, we'll use localStorage
      const savedCart = localStorage.getItem('guest_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      setCart(response.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      if (isAuthenticated) {
        const response = await cartAPI.addToCart({
          product: productId,
          quantity: quantity,
        });

        // Backend may return either the created cart item or the full cart.
        // If the response already contains a full cart (items array), use it.
        // Otherwise fetch the canonical cart representation.
        if (response.data && Array.isArray(response.data.items)) {
          setCart(response.data);
        } else {
          await fetchCart();
        }

        toast.success('Product added to cart!');
      } else {
        // Handle guest cart
        addToGuestCart(productId, quantity);
        toast.success('Product added to cart!');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add product to cart';
      toast.error(message);
    }
  };

  const addToGuestCart = (productId, quantity) => {
    const guestCart = JSON.parse(localStorage.getItem('guest_cart') || '{"items":[],"total_items":0,"total_price":0}');
    
    const existingItem = guestCart.items.find(item => item.product.id === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      guestCart.items.push({
        id: Date.now().toString(),
        product: { id: productId },
        quantity: quantity,
        total_price: 0, // This would need to be calculated with actual product data
      });
    }
    
    // Update totals (simplified)
    guestCart.total_items = guestCart.items.reduce((sum, item) => sum + item.quantity, 0);
    guestCart.total_price = guestCart.items.reduce((sum, item) => sum + (item.total_price || 0), 0);
    
    localStorage.setItem('guest_cart', JSON.stringify(guestCart));
    setCart(guestCart);
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      if (isAuthenticated) {
        const response = await cartAPI.updateCartItem(itemId, { quantity });

        if (response.data && Array.isArray(response.data.items)) {
          setCart(response.data);
        } else {
          await fetchCart();
        }

        toast.success('Cart updated!');
      } else {
        updateGuestCartItem(itemId, quantity);
        toast.success('Cart updated!');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update cart item';
      toast.error(message);
    }
  };

  const updateGuestCartItem = (itemId, quantity) => {
    const guestCart = JSON.parse(localStorage.getItem('guest_cart') || '{"items":[],"total_items":0,"total_price":0}');
    
    const item = guestCart.items.find(item => item.id === itemId);
    if (item) {
      item.quantity = quantity;
      if (quantity <= 0) {
        guestCart.items = guestCart.items.filter(item => item.id !== itemId);
      }
    }
    
    // Update totals
    guestCart.total_items = guestCart.items.reduce((sum, item) => sum + item.quantity, 0);
    guestCart.total_price = guestCart.items.reduce((sum, item) => sum + (item.total_price || 0), 0);
    
    localStorage.setItem('guest_cart', JSON.stringify(guestCart));
    setCart(guestCart);
  };

  const removeFromCart = async (itemId) => {
    try {
      if (isAuthenticated) {
        await cartAPI.removeFromCart(itemId);
        await fetchCart();
        toast.success('Item removed from cart!');
      } else {
        removeFromGuestCart(itemId);
        toast.success('Item removed from cart!');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove item from cart';
      toast.error(message);
    }
  };

  const removeFromGuestCart = (itemId) => {
    const guestCart = JSON.parse(localStorage.getItem('guest_cart') || '{"items":[],"total_items":0,"total_price":0}');
    
    guestCart.items = guestCart.items.filter(item => item.id !== itemId);
    
    // Update totals
    guestCart.total_items = guestCart.items.reduce((sum, item) => sum + item.quantity, 0);
    guestCart.total_price = guestCart.items.reduce((sum, item) => sum + (item.total_price || 0), 0);
    
    localStorage.setItem('guest_cart', JSON.stringify(guestCart));
    setCart(guestCart);
  };

  const clearCart = async () => {
    try {
      if (isAuthenticated) {
        await cartAPI.clearCart();
        await fetchCart();
        toast.success('Cart cleared!');
      } else {
        localStorage.removeItem('guest_cart');
        setCart(null);
        toast.success('Cart cleared!');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to clear cart';
      toast.error(message);
    }
  };

  const getCartItemCount = () => {
    if (!cart) return 0;
    return cart.total_items || 0;
  };

  const getCartTotal = () => {
    if (!cart) return 0;
    return cart.total_price || 0;
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    fetchCart,
    getCartItemCount,
    getCartTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};





