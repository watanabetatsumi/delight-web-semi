// Chat related types (for future implementation)

export interface ChatMessage {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  created_at: string;
  read_at?: string;
}

export interface ChatUser {
  id: number;
  username: string;
  email: string;
  online: boolean;
  last_seen?: string;
}

export interface ChatConversation {
  user: ChatUser;
  last_message?: ChatMessage;
  unread_count: number;
}

export interface SendMessageRequest {
  receiver_id: number;
  content: string;
}

export interface ChatContextType {
  conversations: ChatConversation[];
  activeConversation: ChatConversation | null;
  messages: ChatMessage[];
  loading: boolean;
  sendMessage: (message: SendMessageRequest) => Promise<void>;
  selectConversation: (conversation: ChatConversation) => void;
  markAsRead: (conversationId: number) => Promise<void>;
}