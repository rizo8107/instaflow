import axios from 'axios';

const META_GRAPH_URL = 'https://graph.facebook.com/v18.0';
const META_APP_ID = import.meta.env.VITE_META_APP_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface InstagramTokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
}

export interface InstagramUserInfo {
  id: string;
  username: string;
  account_type: string;
  media_count: number;
  profile_picture_url?: string;
}

export interface InstagramPage {
  id: string;
  name: string;
  instagram_business_account?: {
    id: string;
    username: string;
  };
}

class InstagramService {
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  // Generate Instagram OAuth URL
  getAuthUrl(): string {
    if (!META_APP_ID) {
      throw new Error('META_APP_ID is not configured. Please check your environment variables.');
    }
    
    if (!REDIRECT_URI) {
      throw new Error('REDIRECT_URI is not configured. Please check your environment variables.');
    }
    
    const scopes = [
      'pages_manage_engagement',
      'instagram_manage_messages', 
      'pages_show_list',
      'instagram_basic',
      'pages_manage_metadata',
      'pages_read_engagement'
    ].join(',');

    const params = new URLSearchParams({
      client_id: META_APP_ID,
      redirect_uri: REDIRECT_URI,
      scope: scopes,
      response_type: 'code',
      state: this.generateState()
    });

    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
    console.log('Generated OAuth URL:', authUrl);
    console.log('Redirect URI:', REDIRECT_URI);
    
    return authUrl;
  }

  // Generate secure state parameter
  private generateState(): string {
    return btoa(Math.random().toString(36).substring(2, 15) + 
                Math.random().toString(36).substring(2, 15));
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(code: string): Promise<InstagramTokenResponse> {
    if (!API_BASE_URL) {
      throw new Error('Backend server not configured. Please set VITE_API_BASE_URL in your environment variables.');
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/exchange-token`, {
        code: code
      });

      const tokenData = response.data;
      this.accessToken = tokenData.access_token;
      
      // Set token expiry (default 60 days for long-lived tokens)
      this.tokenExpiry = new Date(Date.now() + (tokenData.expires_in || 5184000) * 1000);
      
      return tokenData;
    } catch (error) {
      console.error('Token exchange error:', error);
      if (axios.isAxiosError(error) && error.code === 'ECONNREFUSED') {
        throw new Error('Backend server is not running. Please start your backend server at ' + API_BASE_URL);
      }
      throw new Error('Failed to exchange authorization code for token. Check if backend server is running.');
    }
  }

  // Get user's Facebook pages with Instagram accounts
  async getUserPages(): Promise<InstagramPage[]> {
    if (!this.accessToken) {
      throw new Error('No access token available');
    }

    try {
      const response = await axios.get(`${META_GRAPH_URL}/me/accounts`, {
        params: {
          access_token: this.accessToken,
          fields: 'id,name,instagram_business_account{id,username,profile_picture_url}'
        }
      });

      return response.data.data.filter((page: any) => page.instagram_business_account);
    } catch (error) {
      console.error('Get pages error:', error);
      throw new Error('Failed to fetch Instagram pages');
    }
  }

  // Get Instagram account info
  async getInstagramAccountInfo(instagramAccountId: string, pageAccessToken: string): Promise<InstagramUserInfo> {
    try {
      const response = await axios.get(`${META_GRAPH_URL}/${instagramAccountId}`, {
        params: {
          access_token: pageAccessToken,
          fields: 'id,username,account_type,media_count,profile_picture_url'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Get Instagram account error:', error);
      throw new Error('Failed to fetch Instagram account info');
    }
  }

  // Send Instagram direct message
  async sendDirectMessage(recipientId: string, message: string, pageAccessToken: string): Promise<any> {
    try {
      const response = await axios.post(`${META_GRAPH_URL}/me/messages`, {
        recipient: { id: recipientId },
        message: { text: message }
      }, {
        params: {
          access_token: pageAccessToken
        }
      });

      return response.data;
    } catch (error) {
      console.error('Send DM error:', error);
      throw new Error('Failed to send direct message');
    }
  }

  // Reply to Instagram comment
  async replyToComment(commentId: string, message: string, pageAccessToken: string): Promise<any> {
    try {
      const response = await axios.post(`${META_GRAPH_URL}/${commentId}/replies`, {
        message: message
      }, {
        params: {
          access_token: pageAccessToken
        }
      });

      return response.data;
    } catch (error) {
      console.error('Reply to comment error:', error);
      throw new Error('Failed to reply to comment');
    }
  }

  // Subscribe to webhooks
  async subscribeToWebhooks(pageId: string, pageAccessToken: string, callbackUrl: string): Promise<any> {
    try {
      const response = await axios.post(`${META_GRAPH_URL}/${pageId}/subscribed_apps`, {
        subscribed_fields: 'messages,messaging_postbacks,messaging_optins,message_deliveries,message_reads,messaging_payments,messaging_pre_checkouts,messaging_checkout_updates,messaging_account_linking,messaging_referrals'
      }, {
        params: {
          access_token: pageAccessToken
        }
      });

      return response.data;
    } catch (error) {
      console.error('Webhook subscription error:', error);
      throw new Error('Failed to subscribe to webhooks');
    }
  }

  // Refresh access token
  async refreshToken(): Promise<InstagramTokenResponse> {
    if (!this.accessToken) {
      throw new Error('No access token to refresh');
    }

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    if (!apiBaseUrl) {
      throw new Error('Backend server not configured. Please set VITE_API_BASE_URL=http://localhost:3001 in your .env file');
    }

    try {
      // Check if backend is available first
      const healthCheck = await axios.get(`${apiBaseUrl}/health`, { 
        timeout: 5000 
      }).catch(() => null);
      
      if (!healthCheck || healthCheck.status !== 200) {
        throw new Error(`Backend server is not running at ${apiBaseUrl}. Please start your backend server with: cd instaflow-backend && npm run dev`);
      }

      const response = await axios.post(`${apiBaseUrl}/api/auth/refresh-token`, {
        access_token: this.accessToken
      }, {
        timeout: 10000
      });

      const tokenData = response.data;
      this.accessToken = tokenData.access_token;
      this.tokenExpiry = new Date(Date.now() + (tokenData.expires_in || 5184000) * 1000);

      return tokenData;
    } catch (error) {
      console.error('Token refresh error:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED' || error.message === 'Network Error' || error.code === 'ENOTFOUND') {
          throw new Error(`Backend server is not running at ${apiBaseUrl}. Please start your backend server with: cd instaflow-backend && npm run dev`);
        }
        if (error.response?.status === 404) {
          throw new Error(`Backend server found but refresh endpoint not available. Please ensure your backend server is properly configured.`);
        }
      }
      
      throw new Error(`Failed to refresh access token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Check if token is expired
  isTokenExpired(): boolean {
    if (!this.tokenExpiry) return true;
    return new Date() >= this.tokenExpiry;
  }

  // Set access token manually
  setAccessToken(token: string, expiryDate?: Date): void {
    this.accessToken = token;
    this.tokenExpiry = expiryDate || new Date(Date.now() + 5184000 * 1000); // 60 days default
  }

  // Get current access token
  getAccessToken(): string | null {
    return this.accessToken;
  }

  // Clear tokens
  clearTokens(): void {
    this.accessToken = null;
    this.tokenExpiry = null;
  }
}

export const instagramService = new InstagramService();