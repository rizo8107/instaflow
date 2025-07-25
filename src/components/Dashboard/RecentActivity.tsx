import React from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { ActivityLog } from '../../types';

const statusIcons = {
  success: CheckCircle,
  error: XCircle,
  pending: AlertCircle,
};

const statusColors = {
  success: 'text-green-600 bg-green-100',
  error: 'text-red-600 bg-red-100',
  pending: 'text-yellow-600 bg-yellow-100',
};

export const RecentActivity: React.FC = () => {
  const { activityLogs } = useStore();
  const recentLogs = activityLogs.slice(0, 10);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {recentLogs.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No recent activity</p>
            <p className="text-sm text-gray-400">Activity will appear here once your flows start running</p>
          </div>
        ) : (
          recentLogs.map((log) => {
            const StatusIcon = statusIcons[log.status];
            return (
              <div key={log.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`p-1 rounded-full ${statusColors[log.status]}`}>
                  <StatusIcon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{log.flowName}</p>
                  <p className="text-sm text-gray-600 truncate">{log.details}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {log.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                {log.executionTime && (
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    {log.executionTime}ms
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};