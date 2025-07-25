import { create } from 'zustand';
import { User, WebhookConfig, AutomationFlow, ActivityLog, WebhookEvent } from '../types';

interface AppState {
  // User & Auth
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (status: boolean) => void;

  // Webhooks
  webhookConfig: WebhookConfig | null;
  setWebhookConfig: (config: WebhookConfig) => void;
  webhookEvents: WebhookEvent[];
  addWebhookEvent: (event: WebhookEvent) => void;

  // Flows
  flows: AutomationFlow[];
  setFlows: (flows: AutomationFlow[]) => void;
  addFlow: (flow: AutomationFlow) => void;
  updateFlow: (id: string, flow: Partial<AutomationFlow>) => void;
  deleteFlow: (id: string) => void;
  activeFlow: AutomationFlow | null;
  setActiveFlow: (flow: AutomationFlow | null) => void;

  // Activity Logs
  activityLogs: ActivityLog[];
  addActivityLog: (log: ActivityLog) => void;
  setActivityLogs: (logs: ActivityLog[]) => void;

  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export const useStore = create<AppState>((set) => ({
  // User & Auth
  user: null,
  setUser: (user) => set({ user }),
  isAuthenticated: false,
  setIsAuthenticated: (status) => set({ isAuthenticated: status }),

  // Webhooks
  webhookConfig: null,
  setWebhookConfig: (config) => set({ webhookConfig: config }),
  webhookEvents: [],
  addWebhookEvent: (event) => set((state) => ({ 
    webhookEvents: [event, ...state.webhookEvents].slice(0, 100) 
  })),

  // Flows
  flows: [],
  setFlows: (flows) => set({ flows }),
  addFlow: (flow) => set((state) => ({ flows: [...state.flows, flow] })),
  updateFlow: (id, flowUpdate) => set((state) => ({
    flows: state.flows.map(flow => 
      flow.id === id ? { ...flow, ...flowUpdate } : flow
    )
  })),
  deleteFlow: (id) => set((state) => ({
    flows: state.flows.filter(flow => flow.id !== id)
  })),
  activeFlow: null,
  setActiveFlow: (flow) => set({ activeFlow: flow }),

  // Activity Logs
  activityLogs: [],
  addActivityLog: (log) => set((state) => ({ 
    activityLogs: [log, ...state.activityLogs].slice(0, 500) 
  })),
  setActivityLogs: (logs) => set({ activityLogs: logs }),

  // UI State
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  currentPage: 'dashboard',
  setCurrentPage: (page) => set({ currentPage: page }),
}));