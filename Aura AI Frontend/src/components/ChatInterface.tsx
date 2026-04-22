import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { api, formatHistoryForOllama } from '../services/api';
import { cn } from '../utils/cn';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  user: { name: string; email: string } | null;
  chatKey?: number;  // Add this
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    // Try to load from localStorage
    const saved = localStorage.getItem('aura_messages');
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const testBackendConnection = async () => {
      try {
        const result = await api.testConnection();
        console.log('Backend connection test:', result);
        if (!result.success) {
          console.error('Cannot connect to backend:', result.error);
        }
      } catch (error) {
        console.error('Connection test failed:', error);
      }
    };

    testBackendConnection();
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem('aura_messages', JSON.stringify(messages));

    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // components/ChatInterface.tsx (partial update - just the error handling part)
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // First check if backend is available
      try {
        const status = await api.checkStatus();
        console.log('Backend status:', status);
      } catch (statusError) {
        console.error('Status check failed:', statusError);
        throw new Error('Cannot connect to backend server. Please make sure the server is running on http://localhost:8080');
      }

      const history = formatHistoryForOllama([...messages, userMessage]);
      console.log('Sending with history:', history); // Debug log

      const response = await api.chat(input, history);
      console.log('Received response:', response); // Debug log

      if (response && response.response) {
        setMessages(prev => [...prev, { role: 'assistant', content: response.response }]);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Chat error:', error);

      let errorMessage = "I'm sorry, I encountered an error. Please try again.";
      if (error instanceof Error) {
        if (error.message.includes('Cannot connect to backend')) {
          errorMessage = "🔴 **Cannot connect to backend server.**\n\nPlease make sure:\n1. Spring Boot backend is running on port 8080\n2. Run `mvn spring-boot:run` in your backend directory\n3. Check if http://localhost:8080/api/chat/status is accessible";
        } else if (error.message.includes('Ollama')) {
          errorMessage = `⚠️ **Ollama Error:** ${error.message}`;
        } else {
          errorMessage = `❌ **Error:** ${error.message}`;
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      setMessages([]);
      localStorage.removeItem('aura_messages');
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-4xl mx-auto glass rounded-3xl overflow-hidden shadow-2xl relative z-10">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-aura-purple to-aura-pink flex items-center justify-center shadow-lg shadow-aura-purple/20">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg tracking-tight">Aura Assistant</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-medium">
                {user ? user.name : 'Guest'}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white"
          title="Clear Chat"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
            <Bot size={48} strokeWidth={1} />
            <p className="font-display text-xl">
              How can I help you today{user ? `, ${user.name}` : ''}?
            </p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "flex gap-4 max-w-[85%]",
                message.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center",
                message.role === 'user' ? "bg-white/10" : "bg-aura-purple/20"
              )}>
                {message.role === 'user' ? <User size={16} /> : <Bot size={16} className="text-aura-purple" />}
              </div>
              <div className={cn(
                "px-4 py-3 rounded-2xl text-sm",
                message.role === 'user'
                  ? "bg-aura-purple text-white rounded-tr-none shadow-lg shadow-aura-purple/20"
                  : "bg-white/5 border border-white/10 rounded-tl-none"
              )}>
                <div className="markdown-body">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-4 mr-auto"
          >
            <div className="w-8 h-8 rounded-full bg-aura-purple/20 flex items-center justify-center">
              <Bot size={16} className="text-aura-purple" />
            </div>
            <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-aura-purple" />
              <span className="text-xs text-white/40 font-medium uppercase tracking-widest">Aura is thinking...</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 bg-white/5 border-t border-white/10">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pr-14 focus:outline-none focus:ring-2 focus:ring-aura-purple/50 focus:border-aura-purple/50 transition-all placeholder:text-white/20 text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={cn(
              "absolute right-2 p-2.5 rounded-xl transition-all",
              input.trim() && !isLoading
                ? "bg-aura-purple text-white hover:scale-105 active:scale-95 shadow-lg shadow-aura-purple/30"
                : "text-white/20 cursor-not-allowed"
            )}
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-[10px] text-center mt-3 text-white/20 uppercase tracking-[0.2em] font-medium">
          Powered by Ollama • Phi3 Model
        </p>
      </div>
    </div>
  );
};