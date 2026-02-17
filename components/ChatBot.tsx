
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { CalculatedLevels, ChatMessage, LogicRule } from '../types';
import { BauhausCard } from './ui/BauhausComponents';
import { RijaAvatar } from './RijaAvatar';
import { Send, Sparkles } from 'lucide-react';
import { ADMIN_PASSWORD } from '../constants';

interface ChatBotProps {
  levels: CalculatedLevels;
  systemInstruction: string;
  logicRules: LogicRule[];
  onOpenAdmin: () => void;
}

export const ChatBot: React.FC<ChatBotProps> = ({ levels, systemInstruction, logicRules = [], onOpenAdmin }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'model',
      text: "I am connected to the market grid. Waiting for your input.",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    if (input.trim() === ADMIN_PASSWORD) {
        onOpenAdmin();
        setInput('');
        return;
    }

    if (!process.env.API_KEY) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const contextPrompt = `
        ROLE: You are RIJA, a supportive trading friend.
        MEMORY CORE: "${systemInstruction}"
        MARKET CONTEXT:
        - Pivot 1: ${levels.pivot1.toFixed(2)}
        - Pivot 2: ${levels.pivot2.toFixed(2)}
        - Bias: ${levels.bias}
        USER SAYS: "${userMsg.text}"
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: contextPrompt }] }],
      });

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text || "I'm thinking, but I couldn't find the words just yet.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("AI Error:", error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Connection interrupted.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full">
      <div className="mb-4 md:mb-6 flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3 tracking-tight">
          <span className="w-1.5 h-6 md:h-8 bg-rh-green rounded-full shadow-[0_0_10px_#00C805]"></span>
          RIJA Neural Interface
        </h2>
      </div>

      <div className="h-[500px] md:h-auto md:min-h-[600px] flex flex-col bg-rh-surface rounded-3xl border border-rh-border/50 shadow-soft overflow-hidden relative">
        {/* Header */}
        <div className="bg-rh-surface border-b border-rh-border p-4 flex justify-between items-center z-20">
           <div className="flex items-center gap-3 md:gap-4">
              <RijaAvatar size="sm" state={isLoading ? 'thinking' : 'idle'} />
              <div>
                <span className="text-white font-bold text-xs md:text-sm block tracking-wide">RIJA Core V2</span>
                <span className="text-rh-green text-[10px] md:text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                   Online <span className="w-1.5 h-1.5 bg-rh-green rounded-full animate-pulse"></span>
                </span>
              </div>
           </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-black/50 flex flex-col relative min-h-0">
           <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 z-10 custom-scrollbar">
              {messages.map((msg, idx) => (
                <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  
                  {msg.role === 'model' && (
                    <div className="hidden md:block mr-3 mt-1">
                       <div className="w-8 h-8 rounded-full bg-rh-surfaceHighlight border border-rh-border flex items-center justify-center">
                          <div className="w-2 h-2 bg-rh-green rounded-full shadow-[0_0_5px_#00C805]"></div>
                       </div>
                    </div>
                  )}

                  <div className={`max-w-[85%] px-5 py-3 md:px-6 md:py-4 rounded-3xl text-sm leading-relaxed tracking-wide ${
                    msg.role === 'user' 
                      ? 'bg-rh-green text-black rounded-tr-sm font-bold shadow-[0_0_15px_rgba(0,200,5,0.2)]' 
                      : 'bg-rh-surfaceHighlight text-gray-100 rounded-tl-sm font-medium border border-rh-border/50'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex w-full justify-start">
                   <div className="hidden md:block mr-3 mt-1">
                      <div className="w-8 h-8 rounded-full bg-rh-surfaceHighlight border border-rh-border flex items-center justify-center">
                          <div className="w-2 h-2 bg-rh-green rounded-full animate-pulse"></div>
                       </div>
                   </div>
                   <div className="px-5 py-3 md:px-6 md:py-4 rounded-3xl rounded-tl-sm bg-rh-surfaceHighlight text-white border border-rh-border/50">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-rh-green rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-rh-green rounded-full animate-bounce delay-100"></div>
                        <div className="w-1.5 h-1.5 bg-rh-green rounded-full animate-bounce delay-200"></div>
                      </div>
                   </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
           </div>
        </div>

        {/* Input Area */}
        <div className="bg-rh-surface p-4 md:p-6 border-t border-rh-border z-20">
          <div className="relative flex items-center group">
             <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask RIJA..."
                disabled={isLoading}
                className="w-full pl-5 pr-12 md:pl-6 md:pr-14 py-3 md:py-4 bg-black border border-rh-border rounded-full text-sm md:text-base font-medium text-white focus:outline-none focus:ring-1 focus:ring-rh-green focus:border-rh-green transition-all placeholder:text-gray-600"
             />
             <button 
                onClick={handleSend}
                disabled={isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-rh-green text-black rounded-full hover:scale-105 hover:shadow-[0_0_10px_#00C805] transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
             >
                <Send size={16} className="md:w-[18px] md:h-[18px]" />
             </button>
          </div>
          <p className="mt-3 text-center text-[9px] md:text-[10px] text-gray-500 uppercase tracking-widest">
             AI generated. Verify all signals independently.
          </p>
        </div>

      </div>
    </section>
  );
};
