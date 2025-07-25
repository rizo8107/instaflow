import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { AuthCard } from './components/Auth/AuthCard';
import { AuthCallback } from './components/Auth/AuthCallback';
import { Dashboard } from './pages/Dashboard';
import { Flows } from './pages/Flows';
import { FlowBuilder } from './pages/FlowBuilder';
import { Webhooks } from './pages/Webhooks';
import { Settings } from './pages/Settings';
import { useStore } from './store/useStore';
import { useInstagramAuth } from './hooks/useInstagramAuth';
import { instagramService } from './services/instagram';

// Mock data for development
const mockUser = {
  id: 'user-1',
  username: 'demo_user',
  instagramId: 'ig-123456',
  pageId: 'page-789',
  accessToken: 'mock-token',
  tokenExpiry: new Date(Date.now() + 3600000),
  isConnected: true,
};

const mockFlows = [
  {
    id: 'flow-1',
    name: 'Welcome Message Flow',
    description: 'Automatically welcome new followers with a DM',
    isActive: true,
    nodes: [
      { id: '1', type: 'trigger', position: { x: 0, y: 0 }, data: { label: 'New Follower', nodeType: 'trigger', config: {} }},
      { id: '2', type: 'action', position: { x: 200, y: 0 }, data: { label: 'Send Welcome DM', nodeType: 'action', config: {} }}
    ],
    edges: [{ id: 'e1-2', source: '1', target: '2' }],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-16'),
    executionCount: 45,
  },
  {
    id: 'flow-2',
    name: 'Comment Auto-Reply',
    description: 'Reply to comments containing specific keywords',
    isActive: false,
    nodes: [
      { id: '1', type: 'trigger', position: { x: 0, y: 0 }, data: { label: 'New Comment', nodeType: 'trigger', config: {} }},
      { id: '2', type: 'condition', position: { x: 200, y: 0 }, data: { label: 'Keyword Filter', nodeType: 'condition', config: {} }},
      { id: '3', type: 'action', position: { x: 400, y: 0 }, data: { label: 'Reply to Comment', nodeType: 'action', config: {} }}
    ],
    edges: [{ id: 'e1-2', source: '1', target: '2' }, { id: 'e2-3', source: '2', target: '3' }],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12'),
    executionCount: 128,
  },
];

const mockLogs = [
  {
    id: 'log-1',
    flowId: 'flow-1',
    flowName: 'Welcome Message Flow',
    event: 'new_follower',
    status: 'success' as const,
    details: 'Sent welcome message to @new_user',
    timestamp: new Date(Date.now() - 120000),
    executionTime: 245,
  },
  {
    id: 'log-2',
    flowId: 'flow-2',
    flowName: 'Comment Auto-Reply',
    event: 'new_comment',
    status: 'success' as const,
    details: 'Replied to comment: "Thanks for the info!"',
    timestamp: new Date(Date.now() - 300000),
    executionTime: 189,
  },
  {
    id: 'log-3',
    flowId: 'flow-1',
    flowName: 'Welcome Message Flow',
    event: 'new_follower',
    status: 'error' as const,
    details: 'Failed to send DM: User has restricted messages',
    timestamp: new Date(Date.now() - 720000),
  },
];

function App() {
  const { 
    isAuthenticated, 
    currentPage, 
    sidebarOpen,
    setUser,
    setIsAuthenticated,
    setFlows,
    setActivityLogs,
  } = useStore();
  
  // Initialize Instagram authentication
  useInstagramAuth();

  // Initialize mock data for development
  React.useEffect(() => {
    // Always show dashboard with mock data for development
    setUser(mockUser);
    setIsAuthenticated(true);
    setFlows(mockFlows);
    setActivityLogs(mockLogs);
    // Synchronize mock token with instagram service
    instagramService.setAccessToken(mockUser.accessToken, mockUser.tokenExpiry);
  }, [setUser, setIsAuthenticated, setFlows, setActivityLogs]);


  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'flows':
        return <Flows />;
      case 'flow-builder':
        return <FlowBuilder />;
      case 'webhooks':
        return <Webhooks />;
      case 'activity':
        return <Dashboard />; // Placeholder  
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  const AuthenticatedApp = () => {
    if (currentPage === 'flow-builder') {
      return <FlowBuilder />;
    }

    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
          <Header />
          <main className="flex-1 p-6">
            {renderPage()}
          </main>
        </div>
      </div>
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/dashboard" element={<AuthenticatedApp />} />
        <Route path="/flows" element={<AuthenticatedApp />} />
        <Route path="/flow-builder" element={<AuthenticatedApp />} />
        <Route path="/webhooks" element={<AuthenticatedApp />} />
        <Route path="/activity" element={<AuthenticatedApp />} />
        <Route path="/settings" element={<AuthenticatedApp />} />
        <Route path="*" element={<AuthenticatedApp />} />
      </Routes>
    </Router>
  );
}

export default App;