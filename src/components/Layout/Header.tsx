import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useInstagramAuth } from '../../hooks/useInstagramAuth';

export const Header: React.FC = () => {
  const { setSidebarOpen, sidebarOpen, activityLogs, user } = useStore();
  const { isTokenExpiring } = useInstagramAuth();
  const unreadCount = activityLogs.filter(log => log.status === 'pending').length;

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-gray-500 hover:text-gray-700"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search flows, logs..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Token Expiry Warning */}
          {user && isTokenExpiring() && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
              <p className="text-sm text-yellow-800">
                Instagram token expires soon. Please reconnect your account.
              </p>
            </div>
          )}
          
          <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};