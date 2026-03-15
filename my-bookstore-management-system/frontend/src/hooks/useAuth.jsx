import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

const getStoredToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

const getStoredUser = () => {
  if (typeof window === 'undefined') return null;

  const rawUser = localStorage.getItem('user');
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser);
  } catch (error) {
    localStorage.removeItem('user');
    return null;
  }
};

const initialToken = getStoredToken();
if (initialToken) {
  api.setAuthToken(initialToken);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [token, setToken] = useState(() => initialToken);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      api.setAuthToken(token);
      const storedUser = getStoredUser();
      if (!user && storedUser) {
        setUser(storedUser);
      }
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      api.setAuthToken(null);
      setUser(null);
    }
  }, [token]);

  const login = async (data) => {
    const response = await api.post('/api/auth/login', data);
    const { token: jwtToken, user: userData } = response.data;

    api.setAuthToken(jwtToken);
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(userData));

    setToken(jwtToken);
    setUser(userData);
    return response;
  };

  const register = async (data) => {
    return api.post('/api/auth/register', data);
  };

  const logout = () => {
    api.setAuthToken(null);
    setToken(null);
  };

  const value = useMemo(() => ({ user, token, login, register, logout }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
