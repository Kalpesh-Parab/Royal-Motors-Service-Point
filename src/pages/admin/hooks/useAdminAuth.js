import { useState, useEffect } from 'react';

const TOKEN_KEY = 'admin_token';

export default function useAdminAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) setIsLoggedIn(true);
  }, []);

  const login = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem('shutter_open', 'false');
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('shutter_open');
    setIsLoggedIn(false);
    window.location.reload();
  };

  return { isLoggedIn, login, logout };
}
