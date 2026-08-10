import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi, getMeApi } from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('classconnect_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('classconnect_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await getMeApi();
          if (res.success) {
            setUser(res.user);
            localStorage.setItem('classconnect_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Session expired or invalid token');
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (credentials) => {
    const data = await loginApi(credentials);
    if (data.success) {
      setToken(data.accessToken);
      setUser(data.user);
      localStorage.setItem('classconnect_token', data.accessToken);
      localStorage.setItem('classconnect_user', JSON.stringify(data.user));
    }
    return data;
  };

  const register = async (registrationPayload) => {
    const data = await registerApi(registrationPayload);
    if (data.success) {
      setToken(data.accessToken);
      setUser(data.user);
      localStorage.setItem('classconnect_token', data.accessToken);
      localStorage.setItem('classconnect_user', JSON.stringify(data.user));
    }
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('classconnect_token');
    localStorage.removeItem('classconnect_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || null,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
