import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem('user_id');
    if (id) {
      setUserId(id);
      setIsLoggedIn(true);
    }
  }, []);

  const login = (id) => {
    if (id) {
      localStorage.setItem('user_id', id);
      setUserId(id);
      setIsLoggedIn(true);
    }
  };

  const logout = () => {
    localStorage.removeItem('user_id');
    setUserId(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
