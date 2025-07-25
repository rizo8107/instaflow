import React, { useState } from 'react';
import { 
  Instagram, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  ExternalLink, 
  Copy, 
  RefreshCw,
  Settings as SettingsIcon,
  Globe,
  Key,
  Shield
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useInstagramAuth } from '../hooks/useInstagramAuth';
import { instagramService } from '../services/instagram';

export const Settings: React.FC = () => {
  const { user, isAuthenticated } = useStore();
  const { logout } = useInstagramAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleReconnect = () => {
    const authUrl = instagramService.getAuthUrl();
    window.location.href = authUrl;
  };

  const handleRefreshToken = async () => {
    if (!user) return;
    
    // Check if backend is configured and available
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    if (!apiBaseUrl) {
      console.warn('Backend API URL not configured. Token refresh requires a backend server.');
      return;
    }
    
    setIsRefreshing(true);
    try {
      // Check backend availability first
      const healthCheck = await fetch(`${apiBaseUrl}/health`, { 
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      }).catch(() => null);
      
      if (!healthCheck || !healthCheck.ok) {
        console.warn('Backend server not available at:', apiBaseUrl);
        console.warn('Please start your backend server with: npm run dev');
        return;
      }

      await instagramService.refreshToken();
      // Token refresh will be handled by the auth hook
    } catch (error) {
      console.warn('Manual token refresh failed - this is normal without backend:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const requiredUrls = [
    {
      name: 'OAuth Redirect URI',
      url: `${window.location.origin}/auth/callback`,
      description: 'Add this to your Meta App OAuth settings',
      required: true
    },
    {
      name: 'Webhook Callback URL',
      url: 'https://your-n8n-instance.com/webhook/instagram-automation',
      description: 'Your n8n webhook endpoint for Instagram events',
      required: true,
      placeholder: true
    },
    {
      name: 'Deauthorize Callback',
      url: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/auth/deauthorize`,
      description: 'Required by Meta for app compliance',
      required: true
    },
    {
      name: 'Data Deletion Callback',
      url: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/auth/data-deletion`,
      description: 'Required by Meta for GDPR compliance',
      required: true
    }
  ];

  const requiredPermissions = [
    'pages_manage_engagement',
    'instagram_manage_messages',
    'pages_show_list',
    'instagram_basic',
    'pages_manage_metadata',
    'pages_read_engagement'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your Instagram connection and app configuration</p>
      </div>

      {/* Instagram Connection Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Instagram className="h-5 w-5 text-purple-600" />
            <span>Instagram Business Account</span>
          </h3>
          {isAuthenticated && user?.isConnected ? (
            <span className="flex items-center space-x-2 text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm font-medium">
              <CheckCircle className="h-4 w-4" />
              <span>Connected</span>
            </span>
          ) : (
            <span className="flex items-center space-x-2 text-red-600 bg-red-100 px-3 py-1 rounded-full text-sm font-medium">
              <XCircle className="h-4 w-4" />
              <span>Disconnected</span>
            </span>
          )}
        </div>

        {isAuthenticated && user ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium">
                {user.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-medium text-gray-900">@{user.username}</p>
                <p className="text-sm text-gray-600">Instagram ID: {user.instagramId}</p>
                <p className="text-sm text-gray-600">
                  Token expires: {new Date(user.tokenExpiry).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleRefreshToken}
                disabled={isRefreshing}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Refreshing...' : 'Refresh Token'}</span>
              </button>
              <button
                onClick={handleReconnect}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Instagram className="h-4 w-4" />
                <span>Reconnect</span>
              </button>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <XCircle className="h-4 w-4" />
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Instagram className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Connect Your Instagram Business Account</h4>
            <p className="text-gray-600 mb-6">
              Connect your Instagram Business account to start automating your engagement
            </p>
            <button
              onClick={handleReconnect}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center space-x-2 mx-auto"
            >
              <Instagram className="h-5 w-5" />
              <span>Connect Instagram Business</span>
            </button>
          </div>
        )}
      </div>

      {/* Meta App Configuration Guide */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center space-x-2">
          <SettingsIcon className="h-5 w-5" />
          <span>Meta App Configuration Guide</span>
        </h3>
        
        <div className="space-y-6">
          {/* Step 1: Create Meta App */}
          <div>
            <h4 className="font-medium text-blue-900 mb-2">1. Create Meta Developer App</h4>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                <li>Go to <a href="https://developers.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center">Meta for Developers <ExternalLink className="h-3 w-3 ml-1" /></a></li>
                <li>Click "Create App" → Select "Business" type</li>
                <li>Enter app name: "InstaFlow Automator"</li>
                <li>Add products: "Instagram Basic Display" + "Instagram Graph API"</li>
              </ol>
            </div>
          </div>

          {/* Step 2: Required URLs */}
          <div>
            <h4 className="font-medium text-blue-900 mb-2">2. Configure Required URLs</h4>
            <div className="space-y-3">
              {requiredUrls.map((urlConfig, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-blue-900">{urlConfig.name}</h5>
                    {urlConfig.required && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Required</span>
                    )}
                  </div>
                  <p className="text-sm text-blue-700 mb-2">{urlConfig.description}</p>
                  <div className="flex items-center space-x-2">
                    <code className={`flex-1 p-2 rounded text-xs font-mono ${
                      urlConfig.placeholder 
                        ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {urlConfig.url}
                    </code>
                    <button
                      onClick={() => copyToClipboard(urlConfig.url)}
                      className="text-blue-600 hover:text-blue-700 p-1"
                      title="Copy URL"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  {urlConfig.placeholder && (
                    <p className="text-xs text-yellow-700 mt-1">
                      ⚠️ Replace with your actual n8n webhook URL
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 3: Required Permissions */}
          <div>
            <h4 className="font-medium text-blue-900 mb-2">3. Required Instagram Permissions</h4>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-700 mb-3">Add these permissions in your Meta App Review:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {requiredPermissions.map((permission, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">{permission}</code>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Step 4: Webhook Configuration */}
          <div>
            <h4 className="font-medium text-blue-900 mb-2">4. Webhook Configuration</h4>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-1">Verify Token:</label>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 p-2 bg-gray-100 rounded text-xs font-mono">
                      instaflow_webhook_verify_token_2024
                    </code>
                    <button
                      onClick={() => copyToClipboard('instaflow_webhook_verify_token_2024')}
                      className="text-blue-600 hover:text-blue-700 p-1"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-1">Subscribe to Fields:</label>
                  <div className="flex flex-wrap gap-2">
                    {['messages', 'messaging_postbacks', 'comments', 'mentions'].map((field) => (
                      <span key={field} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 5: Environment Variables */}
          <div>
            <h4 className="font-medium text-blue-900 mb-2">5. Environment Variables</h4>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-700 mb-3">Add these to your environment files:</p>
              <div className="space-y-3">
                <div>
                  <h6 className="text-sm font-medium text-blue-900">Frontend (.env):</h6>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`VITE_META_APP_ID=your_meta_app_id_here
VITE_REDIRECT_URI=${window.location.origin}/auth/callback
VITE_API_BASE_URL=http://localhost:3001
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/instagram-automation`}
                  </pre>
                </div>
                <div>
                  <h6 className="text-sm font-medium text-blue-900">Backend (.env):</h6>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`PORT=3001
META_APP_ID=your_meta_app_id_here
META_APP_SECRET=your_meta_app_secret_here
REDIRECT_URI=${window.location.origin}/auth/callback`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Configuration */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Key className="h-5 w-5" />
          <span>Current Configuration</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta App ID:</label>
            <div className="flex items-center space-x-2">
              <code className="flex-1 p-2 bg-gray-100 rounded text-sm">
                {import.meta.env.VITE_META_APP_ID || 'Not configured'}
              </code>
              {import.meta.env.VITE_META_APP_ID ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Redirect URI:</label>
            <div className="flex items-center space-x-2">
              <code className="flex-1 p-2 bg-gray-100 rounded text-sm">
                {import.meta.env.VITE_REDIRECT_URI || 'Not configured'}
              </code>
              {import.meta.env.VITE_REDIRECT_URI ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Backend API URL:</label>
            <div className="flex items-center space-x-2">
              <code className="flex-1 p-2 bg-gray-100 rounded text-sm">
                {import.meta.env.VITE_API_BASE_URL || 'Not configured'}
              </code>
              {import.meta.env.VITE_API_BASE_URL ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">n8n Webhook URL:</label>
            <div className="flex items-center space-x-2">
              <code className="flex-1 p-2 bg-gray-100 rounded text-sm">
                {import.meta.env.VITE_N8N_WEBHOOK_URL || 'Not configured'}
              </code>
              {import.meta.env.VITE_N8N_WEBHOOK_URL ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Globe className="h-5 w-5" />
          <span>Quick Links</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="https://developers.facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
          >
            <div>
              <h4 className="font-medium text-gray-900">Meta for Developers</h4>
              <p className="text-sm text-gray-600">Configure your Meta App</p>
            </div>
            <ExternalLink className="h-4 w-4 text-gray-400" />
          </a>
          
          <a
            href="https://developers.facebook.com/docs/instagram-api/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
          >
            <div>
              <h4 className="font-medium text-gray-900">Instagram Graph API Docs</h4>
              <p className="text-sm text-gray-600">API documentation</p>
            </div>
            <ExternalLink className="h-4 w-4 text-gray-400" />
          </a>
          
          <a
            href="https://developers.facebook.com/tools/explorer/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
          >
            <div>
              <h4 className="font-medium text-gray-900">Graph API Explorer</h4>
              <p className="text-sm text-gray-600">Test API endpoints</p>
            </div>
            <ExternalLink className="h-4 w-4 text-gray-400" />
          </a>
          
          <a
            href="https://business.facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
          >
            <div>
              <h4 className="font-medium text-gray-900">Facebook Business</h4>
              <p className="text-sm text-gray-600">Manage your business accounts</p>
            </div>
            <ExternalLink className="h-4 w-4 text-gray-400" />
          </a>
        </div>
      </div>
    </div>
  );
};