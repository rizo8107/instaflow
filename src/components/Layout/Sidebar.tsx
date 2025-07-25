import React from 'react';
import { 
  Home, 
  Workflow, 
  Webhook, 
  Activity, 
  Settings, 
  LogOut,
  ChevronLeft,
  Instagram
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useInstagramAuth } from '../../hooks/useInstagramAuth';
import clsx from 'clsx';

const navigation = [
  { name: 'Dashboard', icon: Home, id: 'dashboard' },
  { name: 'Flows', icon: Workflow, id: 'flows' },
  { name: 'Webhooks', icon: Webhook, id: 'webhooks' },
  { name: 'Activity', icon: Activity, id: 'activity' },
  { name: 'Settings', icon: Settings, id: 'settings' },
];

export const Sidebar: React.FC = () => {
  const { sidebarOpen, setSidebarOpen, currentPage, setCurrentPage, user, isAuthenticated } = useStore();
  const { logout } = useInstagramAuth();

  return (
    <div className={clsx(
      "fixed inset-y-0 left-0 z-50 flex flex-col bg-gray-900 transition-all duration-300 ease-in-out",
      sidebarOpen ? "w-64" : "w-16"
    )}>
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-800">
        <div className={clsx("flex items-center space-x-3", !sidebarOpen && "justify-center")}>
          <div className="flex-shrink-0">
            <Instagram className="h-8 w-8 text-purple-500" />
          </div>
          {sidebarOpen && (
            <div>
              <h1 className="text-lg font-bold text-white">InstaFlow</h1>
              <p className="text-xs text-gray-400">Automator</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft className={clsx("h-5 w-5 transition-transform", !sidebarOpen && "rotate-180")} />
        </button>
      </div>

      {/* User Info */}
      {isAuthenticated && user && (
        <div className="p-4 border-b border-gray-800">
          <div className={clsx("flex items-center space-x-3", !sidebarOpen && "justify-center")}>
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium">
                {user.username?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
            {sidebarOpen && (
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">@{user.username}</p>
                <p className="text-xs text-gray-400">
                  {user.isConnected ? 'Connected' : 'Disconnected'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.name}
              onClick={() => setCurrentPage(item.id)}
              className={clsx(
                "w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-gray-800",
                !sidebarOpen && "justify-center"
              )}
            >
              <item.icon className={clsx("h-5 w-5", sidebarOpen && "mr-3")} />
              {sidebarOpen && item.name}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      {isAuthenticated && (
        <div className="p-2 border-t border-gray-800">
          <button
            onClick={logout}
            className={clsx(
              "w-full flex items-center px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors",
              !sidebarOpen && "justify-center"
            )}
          >
            <LogOut className={clsx("h-5 w-5", sidebarOpen && "mr-3")} />
            {sidebarOpen && "Logout"}
          </button>
        </div>
      )}
    </div>
  );
};