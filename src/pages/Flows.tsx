import React, { useState } from 'react';
import { Plus, Play, Pause, MoreVertical, Download, Copy, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { AutomationFlow } from '../types';

export const Flows: React.FC = () => {
  const { flows, setCurrentPage, updateFlow, deleteFlow } = useStore();
  const [showMenu, setShowMenu] = useState<string | null>(null);

  const handleToggleFlow = (id: string, isActive: boolean) => {
    updateFlow(id, { isActive: !isActive });
  };

  const handleDeleteFlow = (id: string) => {
    deleteFlow(id);
    setShowMenu(null);
  };

  const handleEditFlow = (flow: AutomationFlow) => {
    setCurrentPage('flow-builder');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Automation Flows</h1>
          <p className="text-gray-600 mt-1">Create and manage your Instagram automation workflows</p>
        </div>
        <button 
          onClick={() => setCurrentPage('flow-builder')}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Flow</span>
        </button>
      </div>

      {/* Flows Grid */}
      {flows.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No flows yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first automation flow</p>
            <button 
              onClick={() => setCurrentPage('flow-builder')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
            >
              Create Your First Flow
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {flows.map((flow) => (
            <div key={flow.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{flow.name}</h3>
                  <p className="text-sm text-gray-600">{flow.description}</p>
                </div>
                <div className="relative">
                  <button 
                    onClick={() => setShowMenu(showMenu === flow.id ? null : flow.id)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                  {showMenu === flow.id && (
                    <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-2 min-w-[160px]">
                      <button 
                        onClick={() => handleEditFlow(flow)}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Edit Flow
                      </button>
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                        <Copy className="h-4 w-4" />
                        <span>Duplicate</span>
                      </button>
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                        <Download className="h-4 w-4" />
                        <span>Export</span>
                      </button>
                      <hr className="my-2" />
                      <button 
                        onClick={() => handleDeleteFlow(flow.id)}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{flow.nodes.length} nodes</span>
                  <span>{flow.executionCount} executions</span>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  flow.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {flow.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleToggleFlow(flow.id, flow.isActive)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    flow.isActive
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {flow.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  <span>{flow.isActive ? 'Pause' : 'Start'}</span>
                </button>
                <p className="text-xs text-gray-500">
                  Updated {new Date(flow.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};