export interface User {
  id: string;
  username: string;
  instagramId: string;
  pageId: string;
  accessToken: string;
  tokenExpiry: Date;
  profilePicture?: string;
  isConnected: boolean;
}

export interface WebhookConfig {
  id: string;
  url: string;
  isActive: boolean;
  lastDelivery?: Date;
  deliveryStatus: 'success' | 'failed' | 'pending';
  events: string[];
}

export interface FlowNode {
  id: string;
  type: 'trigger' | 'condition' | 'action';
  position: { x: number; y: number };
  data: {
    label: string;
    config: Record<string, any>;
    nodeType: string;
  };
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
}

export interface AutomationFlow {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  nodes: FlowNode[];
  edges: FlowEdge[];
  createdAt: Date;
  updatedAt: Date;
  executionCount: number;
}

export interface ActivityLog {
  id: string;
  flowId: string;
  flowName: string;
  event: string;
  status: 'success' | 'error' | 'pending';
  details: string;
  timestamp: Date;
  executionTime?: number;
}

export interface WebhookEvent {
  id: string;
  type: 'message' | 'comment' | 'follow' | 'mention';
  content: string;
  userId: string;
  username: string;
  postId?: string;
  commentId?: string;
  timestamp: Date;
  processed: boolean;
}