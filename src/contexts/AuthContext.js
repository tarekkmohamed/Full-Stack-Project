import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const response = await authAPI.getUserInfo();
          setUser(response.data);
        } catch (error) {
          console.error('Auth initialization failed:', error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      const { tokens, user: userData } = res.data;
      
      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);
      setUser(userData);
      
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const message = extractErrorMessage(error, 'Login failed');
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      await authAPI.register(userData);
      toast.success('Registration successful! Please check your email for verification.');
      return { success: true };
    } catch (error) {
      const message = extractErrorMessage(error, 'Registration failed');
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    toast.success('Logged out successfully!');
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await authAPI.updateProfile(profileData);
      setUser(res.data);
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      await authAPI.changePassword(passwordData);
      toast.success('Password changed successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Password change failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const passwordResetRequest = async (email) => {
    try {
      await authAPI.passwordResetRequest({ email });
      toast.success('Password reset link sent to your email!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset request failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const passwordResetConfirm = async (token, newPassword, confirmPassword) => {
    try {
      await authAPI.passwordResetConfirm({
        token,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      toast.success('Password reset successfully!');
      return { success: true };
    } catch (error) {
      const message = extractErrorMessage(error, 'Password reset failed');
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Extract a readable error message from axios/DRF error responses
  function extractErrorMessage(error, defaultMessage) {
    if (!error || !error.response || !error.response.data) return defaultMessage;
    const data = error.response.data;

    if (typeof data === 'string') return data;
    if (data.detail) return data.detail;
    if (data.message) return data.message;
    if (data.non_field_errors && Array.isArray(data.non_field_errors) && data.non_field_errors.length) {
      return data.non_field_errors[0];
    }

    // Field errors: return first message found
    if (typeof data === 'object') {
      for (const key of Object.keys(data)) {
        const val = data[key];
        if (Array.isArray(val) && val.length) return String(val[0]);
        if (typeof val === 'string') return val;
      }
    }

    try {
      return JSON.stringify(data);
    } catch (e) {
      return defaultMessage;
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    passwordResetRequest,
    passwordResetConfirm,
    isAuthenticated: !!user,
    isSeller: user?.is_seller || false,
    isAdmin: user?.is_staff || false,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};





