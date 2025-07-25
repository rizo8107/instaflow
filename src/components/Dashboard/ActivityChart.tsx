import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', executions: 45, success: 42 },
  { name: 'Tue', executions: 52, success: 48 },
  { name: 'Wed', executions: 38, success: 35 },
  { name: 'Thu', executions: 61, success: 58 },
  { name: 'Fri', executions: 55, success: 52 },
  { name: 'Sat', executions: 42, success: 40 },
  { name: 'Sun', executions: 35, success: 33 },
];

export const ActivityChart: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Flow Executions</h3>
        <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </select>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="executions" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              name="Total Executions"
            />
            <Line 
              type="monotone" 
              dataKey="success" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Successful"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};