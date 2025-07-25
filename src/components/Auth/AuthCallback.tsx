import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Instagram, CheckCircle, XCircle, Loader } from 'lucide-react';
import { instagramService } from '../../services/instagram';
import { useStore } from '../../store/useStore';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated } = useStore();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get current URL and log for debugging
        const currentUrl = window.location.href;
        console.log('Current callback URL:', currentUrl);
        
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');
        
        // Log all URL parameters for debugging
        console.log('URL Parameters:', {
          code: code ? 'present' : 'missing',
          error,
          errorDescription,
          allParams: Object.fromEntries(urlParams.entries())
        });

        if (error) {
          throw new Error(errorDescription || 'Authentication failed');
        }

        if (!code) {
          throw new Error(`No authorization code received. Please check your Meta App configuration:
            
1. Verify OAuth Redirect URI is set to: ${window.location.origin}/auth/callback
2. Ensure your Meta App ID is correct in environment variables
3. Check that required permissions are approved in Meta App Review
4. Current URL: ${currentUrl}

If you're testing locally, make sure you're using the exact redirect URI configured in your Meta App.`);
        }

        setMessage('Exchanging authorization code...');
        
        // Exchange code for access token
        const tokenResponse = await instagramService.exchangeCodeForToken(code);
        
        setMessage('Fetching Instagram pages...');
        
        // Get user's Instagram pages
        const pages = await instagramService.getUserPages();
        
        if (pages.length === 0) {
          throw new Error('No Instagram Business accounts found. Please connect an Instagram Business account to your Facebook page.');
        }

        // Use the first Instagram business account
        const firstPage = pages[0];
        const instagramAccount = firstPage.instagram_business_account;

        if (!instagramAccount) {
          throw new Error('No Instagram Business account found on this page.');
        }

        setMessage('Setting up your account...');

        // Create user object
        const user = {
          id: instagramAccount.id,
          username: instagramAccount.username,
          instagramId: instagramAccount.id,
          pageId: firstPage.id,
          accessToken: tokenResponse.access_token,
          tokenExpiry: new Date(Date.now() + (tokenResponse.expires_in || 5184000) * 1000),
          profilePicture: instagramAccount.profile_picture_url,
          isConnected: true
        };

        // Store user data
        setUser(user);
        setIsAuthenticated(true);

        // Store tokens in localStorage for persistence
        localStorage.setItem('instagram_access_token', tokenResponse.access_token);
        localStorage.setItem('instagram_token_expiry', user.tokenExpiry.toISOString());
        localStorage.setItem('instagram_user', JSON.stringify(user));

        setStatus('success');
        setMessage('Successfully connected to Instagram!');

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);

      } catch (error) {
        console.error('Authentication error:', error);
        setStatus('error');
        const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
        setMessage(errorMessage);
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 5000); // Increased time to read error message
      }
    };

    handleCallback();
  }, [navigate, setUser, setIsAuthenticated]);

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader className="h-12 w-12 text-purple-600 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-12 w-12 text-green-600" />;
      case 'error':
        return <XCircle className="h-12 w-12 text-red-600" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'text-purple-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-center">
          <Instagram className="h-12 w-12 text-white mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-white mb-1">InstaFlow Automator</h1>
          <p className="text-purple-100 text-sm">Connecting your Instagram account</p>
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <div className="mb-6">
            {getStatusIcon()}
          </div>
          
          <h2 className={`text-xl font-semibold mb-4 ${getStatusColor()}`}>
            {status === 'loading' && 'Connecting...'}
            {status === 'success' && 'Connected Successfully!'}
            {status === 'error' && 'Connection Failed'}
          </h2>
          
          <p className="text-gray-600 mb-6">
            {message}
          </p>

          {status === 'loading' && (
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
              <p className="text-sm text-gray-500">This may take a few moments...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-700">
                Redirecting to your dashboard...
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700 mb-3">
                Please try connecting again or contact support if the issue persists.
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};