import React from 'react';
import { Activity, Users, MessageSquare, TrendingUp } from 'lucide-react';
import { StatsCard } from '../components/Dashboard/StatsCard';
import { ActivityChart } from '../components/Dashboard/ActivityChart';
import { RecentActivity } from '../components/Dashboard/RecentActivity';
import { useStore } from '../store/useStore';

export const Dashboard: React.FC = () => {
  const { flows, activityLogs } = useStore();
  
  const activeFlows = flows.filter(flow => flow.isActive).length;
  const totalExecutions = flows.reduce((sum, flow) => sum + flow.executionCount, 0);
  const successRate = activityLogs.length > 0 
    ? Math.round((activityLogs.filter(log => log.status === 'success').length / activityLogs.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Monitor your Instagram automation performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Active Flows"
          value={activeFlows}
          change={`${flows.length} total`}
          changeType="neutral"
          icon={Activity}
          color="purple"
        />
        <StatsCard
          title="Total Executions"
          value={totalExecutions.toLocaleString()}
          change="+12% from last week"
          changeType="positive"
          icon={TrendingUp}
          color="blue"
        />
        <StatsCard
          title="Success Rate"
          value={`${successRate}%`}
          change="+2.3% from yesterday"
          changeType="positive"
          icon={MessageSquare}
          color="green"
        />
        <StatsCard
          title="Webhook Events"
          value="2.4k"
          change="+18% from last week"
          changeType="positive"
          icon={Users}
          color="orange"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityChart />
        <RecentActivity />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-left">
            <h4 className="font-medium text-gray-900 mb-1">Create New Flow</h4>
            <p className="text-sm text-gray-600">Build a new automation workflow</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-left">
            <h4 className="font-medium text-gray-900 mb-1">Configure Webhooks</h4>
            <p className="text-sm text-gray-600">Set up event listeners</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-left">
            <h4 className="font-medium text-gray-900 mb-1">View Analytics</h4>
            <p className="text-sm text-gray-600">Check detailed performance metrics</p>
          </button>
        </div>
      </div>
    </div>
  );
};