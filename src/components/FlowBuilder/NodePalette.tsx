import React from 'react';
import { Clock, Filter, Send, MessageSquare, Hash, User, Zap } from 'lucide-react';

const nodeTypes = [
  {
    type: 'trigger',
    category: 'Triggers',
    items: [
      { id: 'new-message', label: 'New DM', icon: MessageSquare, description: 'Triggered when receiving a new direct message' },
      { id: 'new-comment', label: 'New Comment', icon: Hash, description: 'Triggered when receiving a new comment' },
      { id: 'new-follower', label: 'New Follower', icon: User, description: 'Triggered when gaining a new follower' },
      { id: 'schedule', label: 'Schedule', icon: Clock, description: 'Triggered at specified times' },
    ]
  },
  {
    type: 'condition',
    category: 'Conditions',
    items: [
      { id: 'keyword-filter', label: 'Keyword Filter', icon: Filter, description: 'Check if text contains specific keywords' },
      { id: 'user-filter', label: 'User Filter', icon: User, description: 'Filter based on user properties' },
      { id: 'time-filter', label: 'Time Filter', icon: Clock, description: 'Check current time conditions' },
    ]
  },
  {
    type: 'action',
    category: 'Actions',
    items: [
      { id: 'send-dm', label: 'Send DM', icon: Send, description: 'Send a direct message' },
      { id: 'reply-comment', label: 'Reply to Comment', icon: Hash, description: 'Reply to a comment' },
      { id: 'webhook-call', label: 'Webhook Call', icon: Zap, description: 'Make an HTTP request' },
    ]
  }
];

interface NodePaletteProps {
  onNodeSelect: (nodeType: string, nodeId: string) => void;
}

export const NodePalette: React.FC<NodePaletteProps> = ({ onNodeSelect }) => {
  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Node Palette</h3>
      
      {nodeTypes.map((category) => (
        <div key={category.category} className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide">
            {category.category}
          </h4>
          <div className="space-y-2">
            {category.items.map((item) => (
              <button
                key={item.id}
                onClick={() => onNodeSelect(category.type, item.id)}
                className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors group"
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-purple-100 transition-colors">
                    <item.icon className="h-4 w-4 text-gray-600 group-hover:text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};