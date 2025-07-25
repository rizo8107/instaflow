import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export interface WebhookPayload {
  object: string;
  entry: Array<{
    id: string;
    time: number;
    messaging?: Array<{
      sender: { id: string };
      recipient: { id: string };
      timestamp: number;
      message?: {
        mid: string;
        text: string;
        attachments?: any[];
      };
      postback?: {
        title: string;
        payload: string;
      };
    }>;
    changes?: Array<{
      field: string;
      value: {
        from: { id: string; username: string };
        media: { id: string; media_type: string };
        text: string;
        id: string;
      };
    }>;
  }>;
}

export interface WebhookVerification {
  'hub.mode': string;
  'hub.verify_token': string;
  'hub.challenge': string;
}

class WebhookService {
  private verifyToken = 'instaflow_webhook_verify_token_2024';

  // Verify webhook subscription
  verifyWebhook(params: WebhookVerification): string | null {
    const mode = params['hub.mode'];
    const token = params['hub.verify_token'];
    const challenge = params['hub.challenge'];

    if (mode === 'subscribe' && token === this.verifyToken) {
      console.log('Webhook verified successfully');
      return challenge;
    } else {
      console.error('Webhook verification failed');
      return null;
    }
  }

  // Process incoming webhook payload
  async processWebhook(payload: WebhookPayload): Promise<void> {
    try {
      console.log('Processing webhook payload:', JSON.stringify(payload, null, 2));

      if (payload.object !== 'instagram') {
        console.log('Ignoring non-Instagram webhook');
        return;
      }

      for (const entry of payload.entry) {
        // Process messaging events (DMs)
        if (entry.messaging) {
          for (const messagingEvent of entry.messaging) {
            await this.processMessagingEvent(messagingEvent);
          }
        }

        // Process changes (comments, mentions, etc.)
        if (entry.changes) {
          for (const change of entry.changes) {
            await this.processChangeEvent(change);
          }
        }
      }
    } catch (error) {
      console.error('Error processing webhook:', error);
      throw error;
    }
  }

  // Process messaging events (DMs)
  private async processMessagingEvent(event: any): Promise<void> {
    try {
      if (event.message) {
        const messageData = {
          type: 'message',
          senderId: event.sender.id,
          recipientId: event.recipient.id,
          messageId: event.message.mid,
          text: event.message.text,
          timestamp: new Date(event.timestamp),
          attachments: event.message.attachments || []
        };

        console.log('New DM received:', messageData);
        
        // Send to flow engine for processing
        await this.triggerFlowExecution('new-message', messageData);
      }

      if (event.postback) {
        const postbackData = {
          type: 'postback',
          senderId: event.sender.id,
          title: event.postback.title,
          payload: event.postback.payload,
          timestamp: new Date(event.timestamp)
        };

        console.log('Postback received:', postbackData);
        await this.triggerFlowExecution('postback', postbackData);
      }
    } catch (error) {
      console.error('Error processing messaging event:', error);
    }
  }

  // Process change events (comments, mentions)
  private async processChangeEvent(change: any): Promise<void> {
    try {
      const { field, value } = change;

      switch (field) {
        case 'comments':
          const commentData = {
            type: 'comment',
            commentId: value.id,
            mediaId: value.media?.id,
            text: value.text,
            from: value.from,
            timestamp: new Date()
          };

          console.log('New comment received:', commentData);
          await this.triggerFlowExecution('new-comment', commentData);
          break;

        case 'mentions':
          const mentionData = {
            type: 'mention',
            mediaId: value.media?.id,
            commentId: value.id,
            text: value.text,
            from: value.from,
            timestamp: new Date()
          };

          console.log('New mention received:', mentionData);
          await this.triggerFlowExecution('new-mention', mentionData);
          break;

        default:
          console.log('Unhandled change event:', field, value);
      }
    } catch (error) {
      console.error('Error processing change event:', error);
    }
  }

  // Trigger flow execution based on event
  private async triggerFlowExecution(eventType: string, eventData: any): Promise<void> {
    try {
      // In a real implementation, this would:
      // 1. Query active flows that match this trigger
      // 2. Execute matching flows with the event data
      // 3. Log execution results
      
      console.log(`Triggering flows for event: ${eventType}`, eventData);
      
      // For now, just simulate flow execution
      const response = await axios.post(`${API_BASE_URL}/api/flows/execute`, {
        eventType,
        eventData,
        timestamp: new Date().toISOString()
      }).catch(error => {
        console.log('Flow execution service not available:', error.message);
      });

      if (response) {
        console.log('Flow execution response:', response.data);
      }
    } catch (error) {
      console.error('Error triggering flow execution:', error);
    }
  }

  // Test webhook with sample data
  async testWebhook(webhookUrl: string): Promise<boolean> {
    try {
      if (!webhookUrl) {
        console.error('No webhook URL provided for testing');
        return false;
      }

      const testPayload: WebhookPayload = {
        object: 'instagram',
        entry: [{
          id: 'test_page_id',
          time: Date.now(),
          messaging: [{
            sender: { id: 'test_user_id' },
            recipient: { id: 'test_page_id' },
            timestamp: Date.now(),
            message: {
              mid: 'test_message_id',
              text: 'This is a test message from InstaFlow Automator'
            }
          }]
        }]
      };

      const response = await axios.post(webhookUrl, testPayload, {
        headers: {
          'Content-Type': 'application/json',
          'X-Hub-Signature-256': 'test_signature',
          'User-Agent': 'InstaFlow-Automator-Backend/1.0'
        },
        timeout: 10000
      });

      return response.status === 200;
    } catch (error) {
      console.error('Webhook test failed:', error);
      return false;
    }
  }

  // Get webhook verification token
  getVerifyToken(): string {
    return this.verifyToken;
  }

  // Get backend webhook URL
  getBackendWebhookUrl(): string {
    return `${API_BASE_URL}/webhook/instagram`;
  }
}

export const webhookService = new WebhookService();