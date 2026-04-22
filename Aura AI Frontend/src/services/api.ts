// services/api.ts
const API_BASE = 'http://localhost:8080/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthResponse {
  user: User;
  token?: string;
}

interface ChatResponse {
  response: string;
}

interface ChatRequest {
  message: string;
  history: any[];
}

export const api = {
  // Auth methods
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Login failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async signup(userData: SignupData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Signup failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  // Chat methods
  async chat(message: string, history: any[]): Promise<ChatResponse> {
    try {
      const requestBody: ChatRequest = {
        message,
        history
      };

      console.log('Sending chat request:', requestBody); // Debug log

      const response = await fetch(`${API_BASE}/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Chat response status:', response.status); // Debug log

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText); // Debug log
        throw new Error(`Chat request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Chat response data:', data); // Debug log
      return data;
    } catch (error) {
      console.error('Chat error:', error);
      throw error;
    }
  },

  async checkStatus(): Promise<{ status: string }> {
    try {
      const response = await fetch(`${API_BASE}/chat/status`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Status check failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Status check error:', error);
      throw error;
    }
  },

  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_BASE}/chat/status`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        return { success: true };
      }
      return { success: false, error: `Backend responded with status: ${response.status}` };
    } catch (error) {
      return { success: false, error: 'Cannot connect to backend. Make sure the server is running on http://localhost:8080' };
    }
  }
};

export const formatHistoryForOllama = (messages: any[]) => {
  return messages.map(msg => ({
    role: msg.role === 'assistant' ? 'assistant' : 'user',
    content: msg.content
  }));
};