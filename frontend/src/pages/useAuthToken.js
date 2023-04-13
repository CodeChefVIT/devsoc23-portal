import { useState, useEffect } from 'react';

const useAuthToken = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  useEffect(() => {
    // Try to load tokens from local storage
    const storedAccessToken = localStorage.getItem('access_token');
    const storedRefreshToken = localStorage.getItem('refresh_token');

    if (storedAccessToken && storedRefreshToken) {
      // @ts-ignore
      setAccessToken(storedAccessToken);
      // @ts-ignore
      setRefreshToken(storedRefreshToken);
    }
  }, []);

  // @ts-ignore
  const saveTokens = (accessToken, refreshToken) => {
    // Save tokens to local storage
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);

    // Update state with new tokens
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
  };

  const clearTokens = () => {
    // Remove tokens from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    // Update state with null values
    setAccessToken(null);
    setRefreshToken(null);
  };

  return {
    accessToken,
    refreshToken,
    saveTokens,
    clearTokens,
  };
};

export default useAuthToken;
