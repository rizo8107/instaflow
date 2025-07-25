import React, { useState } from 'react';
import { Globe, CheckCircle, XCircle, AlertCircle, Copy, RefreshCw as Refresh, Settings } from 'lucide-react';
import { useStore } from '../store/useStore';
import { webhookService } from '../services/webhookService';

export const Webhooks: React.FC = () => {
  const { webhookConfig, setWebhookConfig } = useStore();
  const [webhookUrl, setWebhookUrl] = useState(webhookConfig?.url || `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/webhook/instagram`);
  const [isEditing, setIsEditing] = useState(!webhookConfig);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'failed' | null>(null);

  const handleSaveWebhook = () => {
    const newConfig = {
      id: webhookConfig?.id || 'webhook-1',
      url: webhookUrl,
      isActive: true,
      lastDelivery: new Date(),
      deliveryStatus: 'success' as const,
      events: ['message', 'comment', 'follow', 'mention']
    };
    setWebhookConfig(newConfig);
    setIsEditing(false);
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl) return;
    
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const success = await webhookService.testWebhook(webhookUrl || undefined);
      setTestResult(success ? 'success' : 'failed');
    } catch (error) {
      setTestResult('failed');
    } finally {
      setIsTesting(false);
    }
  };

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
  };

  const events = [
    { id: 'message', name: 'Direct Messages', description: 'New DMs received', enabled: true },
    { id: 'comment', name: 'Comments', description: 'New comments on posts', enabled: true },
    { id: 'follow', name: 'Followers', description: 'New followers', enabled: true },
    { id: 'mention', name: 'Mentions', description: 'When tagged in posts/stories', enabled: false },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Webhook Configuration</h1>
        <p className="text-gray-600 mt-1">Configure endpoints to receive Instagram events in real-time</p>
      </div>

      {/* Webhook URL Configuration */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Webhook Endpoint</h3>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="text-purple-600 hover:text-purple-700 font-medium flex items-center space-x-1"
            >
              <Settings className="h-4 w-4" />
              <span>Edit</span>
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Webhook URL
              </label>
              <div className="flex space-x-3">
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://your-app.com/webhooks/instagram"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  onClick={handleSaveWebhook}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              This n8n webhook will receive POST requests with Instagram event data
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Globe className="h-5 w-5 text-gray-600" />
              <span className="flex-1 font-mono text-sm text-gray-900">{webhookUrl || 'No webhook configured'}</span>
              {webhookUrl && (
                <button onClick={copyWebhookUrl} className="text-gray-500 hover:text-gray-700">
                  <Copy className="h-4 w-4" />
                </button>
              )}
            </div>
            
            {webhookConfig && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {testResult === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : testResult === 'failed' ? (
                    <XCircle className="h-5 w-5 text-red-600" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                  <span className="text-sm text-gray-700">
                    {testResult === 'success' && 'Webhook test successful'}
                    {testResult === 'failed' && 'Webhook test failed'}
                    {testResult === null && 'Active and receiving events'}
                  </span>
                </div>
                <button
                  onClick={handleTestWebhook}
                  disabled={isTesting}
                  className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center space-x-1"
                >
                  <Refresh className={`h-4 w-4 ${isTesting ? 'animate-spin' : ''}`} />
                  <span>{isTesting ? 'Testing...' : 'Test Webhook'}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Webhook Setup Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Webhook Setup Instructions</h3>
        <div className="space-y-4 text-sm text-blue-800">
          <div>
            <h4 className="font-medium mb-2">1. Backend Webhook Endpoint</h4>
            <p>Your backend server hosts the webhook endpoint at:</p>
            <code className="block bg-blue-100 p-2 rounded mt-1 font-mono text-xs">
              {webhookUrl}
            </code>
          </div>
          <div>
            <h4 className="font-medium mb-2">2. Configure Meta App Webhook</h4>
            <p>In your Meta App dashboard, use your backend webhook URL and this verify token:</p>
            <div className="flex items-center space-x-2 mt-1">
              <code className="bg-blue-100 p-2 rounded font-mono text-xs flex-1">
                {webhookService.getVerifyToken()}
              </code>
              <button
                onClick={() => navigator.clipboard.writeText(webhookService.getVerifyToken())}
                className="text-blue-600 hover:text-blue-700"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">3. Backend Processing</h4>
            <p>Your backend server automatically processes Instagram events:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Receives webhook events from Instagram</li>
              <li>Routes different event types (messages, comments, mentions)</li>
              <li>Processes automation rules and triggers responses</li>
              <li>Integrates with Instagram Graph API for actions</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">4. Required Webhook Fields in Meta App</h4>
            <p>Subscribe to these webhook fields in your Meta App:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li><code>messages</code> - For direct messages</li>
              <li><code>messaging_postbacks</code> - For button interactions</li>
              <li><code>comments</code> - For post comments</li>
              <li><code>mentions</code> - For story/post mentions</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">5. Automation Examples</h4>
            <p>Your backend can handle various automation scenarios:</p>
            <div className="bg-blue-100 p-3 rounded mt-2 font-mono text-xs">
              • Auto-reply to messages containing "price"<br/>
              • Respond to comments with keywords<br/>
              • Send welcome messages to new followers<br/>
              • Forward important messages to email/Slack
            </div>
          </div>
        </div>
      </div>
      {/* Event Configuration */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Subscriptions</h3>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${event.enabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                  {event.enabled ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-gray-400" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{event.name}</h4>
                  <p className="text-sm text-gray-600">{event.description}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked={event.enabled} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Deliveries</h3>
        {webhookConfig ? (
          <div className="space-y-3">
            {[
              { id: 1, event: 'message', status: 'success', timestamp: '2 minutes ago', responseTime: '142ms' },
              { id: 2, event: 'comment', status: 'success', timestamp: '5 minutes ago', responseTime: '89ms' },
              { id: 3, event: 'follow', status: 'failed', timestamp: '12 minutes ago', responseTime: '—' },
              { id: 4, event: 'message', status: 'success', timestamp: '18 minutes ago', responseTime: '156ms' },
            ].map((delivery) => (
              <div key={delivery.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  {delivery.status === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : delivery.status === 'failed' ? (
                    <XCircle className="h-4 w-4 text-red-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                  )}
                  <div>
                    <span className="text-sm font-medium text-gray-900 capitalize">{delivery.event}</span>
                    <span className="text-sm text-gray-600 ml-2">{delivery.timestamp}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    delivery.status === 'success' 
                      ? 'bg-green-100 text-green-800'
                      : delivery.status === 'failed'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {delivery.status}
                  </span>
                  {delivery.responseTime !== '—' && (
                    <p className="text-xs text-gray-500 mt-1">{delivery.responseTime}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Configure a webhook URL to see delivery status</p>
          </div>
        )}
      </div>
    </div>
  );
};