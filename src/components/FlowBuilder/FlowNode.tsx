import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { MessageSquare, Filter, Send, Clock, Hash, User } from 'lucide-react';

const nodeIcons = {
  trigger: Clock,
  condition: Filter,
  action: Send,
  message: MessageSquare,
  comment: Hash,
  follow: User,
};

const nodeColors = {
  trigger: 'from-blue-500 to-blue-600',
  condition: 'from-yellow-500 to-yellow-600',
  action: 'from-green-500 to-green-600',
  message: 'from-purple-500 to-purple-600',
  comment: 'from-pink-500 to-pink-600',
  follow: 'from-indigo-500 to-indigo-600',
};

interface FlowNodeProps {
  data: {
    label: string;
    nodeType: string;
    config: Record<string, any>;
  };
}

export const FlowNode: React.FC<FlowNodeProps> = ({ data }) => {
  const Icon = nodeIcons[data.nodeType as keyof typeof nodeIcons] || MessageSquare;
  const colorClass = nodeColors[data.nodeType as keyof typeof nodeColors] || 'from-gray-500 to-gray-600';

  return (
    <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 hover:border-purple-300 transition-colors min-w-[200px]">
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-gray-400" />
      
      <div className={`p-3 bg-gradient-to-r ${colorClass} text-white rounded-t-lg`}>
        <div className="flex items-center space-x-2">
          <Icon className="h-4 w-4" />
          <span className="font-medium text-sm">{data.label}</span>
        </div>
      </div>
      
      <div className="p-3">
        <div className="text-xs text-gray-600 space-y-1">
          {Object.entries(data.config || {}).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="capitalize">{key}:</span>
              <span className="font-medium truncate ml-2">{String(value)}</span>
            </div>
          ))}
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-gray-400" />
    </div>
  );
};