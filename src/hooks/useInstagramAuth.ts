import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { instagramService } from '../services/instagram';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useInstagramAuth = () => {
  const { setUser, setIsAuthenticated, user } = useStore();

  // Initialize auth from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('instagram_access_token');
        const storedExpiry = localStorage.getItem('instagram_token_expiry');
        const storedUser = localStorage.getItem('instagram_user');

        if (storedToken && storedExpiry && storedUser) {
          const expiryDate = new Date(storedExpiry);
          const userData = JSON.parse(storedUser);

          // Check if token is still valid
          if (expiryDate > new Date()) {
            instagramService.setAccessToken(storedToken, expiryDate);
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // Token expired, clear storage
            clearAuthData();
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        clearAuthData();
      }
    };

    initializeAuth();
  }, [setUser, setIsAuthenticated]);

  // Auto-refresh token when it's about to expire
  useEffect(() => {
    if (!user || !user.isConnected || !API_BASE_URL) return;

    const checkTokenExpiry = async () => {
      try {
        const tokenExpiry = new Date(user.tokenExpiry);
        const now = new Date();
        const timeUntilExpiry = tokenExpiry.getTime() - now.getTime();
        const oneDayInMs = 24 * 60 * 60 * 1000;

        // Refresh token if it expires within 24 hours
        if (timeUntilExpiry < oneDayInMs && timeUntilExpiry > 0) {
          console.log('Refreshing Instagram token...');
          try {
            // Check if backend is available before attempting refresh
            const healthCheck = await fetch(`${API_BASE_URL}/health`, { 
              method: 'GET',
              timeout: 5000 
            }).catch(() => null);
            
            if (!healthCheck || !healthCheck.ok) {
              console.warn('Backend server not available, skipping token refresh');
              return;
            }

            const newTokenData = await instagramService.refreshToken();
            
            const updatedUser = {
              ...user,
              accessToken: newTokenData.access_token,
              tokenExpiry: new Date(Date.now() + (newTokenData.expires_in || 5184000) * 1000)
            };

            setUser(updatedUser);
            
            // Update localStorage
            localStorage.setItem('instagram_access_token', newTokenData.access_token);
            localStorage.setItem('instagram_token_expiry', updatedUser.tokenExpiry.toISOString());
            localStorage.setItem('instagram_user', JSON.stringify(updatedUser));
          } catch (refreshError) {
            console.warn('Token refresh failed - backend may not be running:', refreshError);
            // Don't logout on network errors, only on actual auth failures
          }
        }
      } catch (error) {
        console.warn('Token expiry check failed - this is normal without backend:', error);
      }
    };

    // Check token expiry every hour
    const interval = setInterval(checkTokenExpiry, 60 * 60 * 1000);
    
    // Check immediately
    checkTokenExpiry();

    return () => clearInterval(interval);
  }, [user, setUser]);

  const clearAuthData = () => {
    localStorage.removeItem('instagram_access_token');
    localStorage.removeItem('instagram_token_expiry');
    localStorage.removeItem('instagram_user');
    instagramService.clearTokens();
    setUser(null);
    setIsAuthenticated(false);
  };

  const logout = () => {
    clearAuthData();
  };

  const isTokenExpiring = (): boolean => {
    if (!user) return false;
    
    const tokenExpiry = new Date(user.tokenExpiry);
    const now = new Date();
    const timeUntilExpiry = tokenExpiry.getTime() - now.getTime();
    const oneDayInMs = 24 * 60 * 60 * 1000;

    return timeUntilExpiry < oneDayInMs;
  };

  return {
    logout,
    isTokenExpiring
  };
};