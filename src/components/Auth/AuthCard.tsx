import React from 'react';
import { Instagram, Shield, Zap, Users } from 'lucide-react';
import { instagramService } from '../../services/instagram';

export const AuthCard: React.FC = () => {
  const handleInstagramAuth = () => {
    const authUrl = instagramService.getAuthUrl();
    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-center">
          <Instagram className="h-12 w-12 text-white mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-white mb-1">InstaFlow Automator</h1>
          <p className="text-purple-100 text-sm">Automate your Instagram engagement</p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Connect Your Instagram</h2>
            <p className="text-gray-600 text-sm">
              Get started by connecting your Instagram Business account to enable automation
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-6">
            {[
              { icon: Zap, text: 'Automate DMs and comments' },
              { icon: Users, text: 'Manage multiple workflows' },
              { icon: Shield, text: 'Secure OAuth 2.0 integration' }
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 text-sm">
                <feature.icon className="h-4 w-4 text-purple-600" />
                <span className="text-gray-700">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Connect Button */}
          <button
            onClick={handleInstagramAuth}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <Instagram className="h-5 w-5" />
            <span>Connect Instagram Business</span>
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            By connecting, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};