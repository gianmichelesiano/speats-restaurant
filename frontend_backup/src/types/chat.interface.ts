export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

export interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages: Message[];
}

export interface UserProfile {
  id: string;
  email: string;
  subscription_tier: string;
  subscription_status?: string;
  subscription_end_date?: string;
  created_at: string;
}
