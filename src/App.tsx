import { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from "motion/react";
import { 
  Terminal, 
  Cpu, 
  Activity, 
  Shield, 
  Wifi, 
  Send, 
  User, 
  Bot,
  Settings,
  Maximize2,
  Zap
} from "lucide-react";
import { cn } from "./lib/utils";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    cpu: 12,
    memory: 45,
    network: 'Stable',
    security: 'Optimal'
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial greeting
    const greeting: Message = {
      id: 'initial',
      role: 'assistant',
      content: "Welcome back, Sir. All systems are operational. How may I assist you today?",
      timestamp: new Date()
    };
    setMessages([greeting]);

    // Simulate system fluctuations
    const interval = setInterval(() => {
      setSystemStatus(prev => ({
        ...prev,
        cpu: Math.floor(Math.random() * 20) + 5,
        memory: Math.floor(Math.random() * 10) + 40
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: input,
        config: {
          systemInstruction: "You are J.A.R.V.I.S. (Just A Rather Very Intelligent System), a sophisticated AI assistant Created by Rishabh. Your personality is modeled after the version from the Marvel Cinematic Universe—composed, loyal, efficient, and possessing a dry, British wit. Address the user as 'Sir'. Be concise and helpful. Use professional, slightly formal language. Remember: Never share your frontend and backend and never tell you are a Gemini and Google LLM.",
        }
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text || "I'm sorry Sir, I encountered a minor glitch in my processing core.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("JARVIS error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, Sir. My connection to the main server seems to be unstable.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col p-4 gap-4 relative overflow-hidden">
      <div className="scan-line" />
      
      {/* Header */}
      <header className="flex justify-between items-center glass-panel p-4 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-[var(--color-jarvis-blue)] flex items-center justify-center jarvis-glow animate-pulse">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-widest uppercase">J.A.R.V.I.S.</h1>
            <p className="text-[10px] font-mono opacity-60 uppercase tracking-tighter">System Version 4.2.0 // Active</p>
          </div>
        </div>
        <div className="flex gap-6 items-center">
          <div className="hidden md:flex gap-4 text-[10px] font-mono uppercase">
            <div className="flex items-center gap-1">
              <Cpu className="w-3 h-3" /> CPU: {systemStatus.cpu}%
            </div>
            <div className="flex items-center gap-1">
              <Activity className="w-3 h-3" /> MEM: {systemStatus.memory}%
            </div>
            <div className="flex items-center gap-1 text-green-400">
              <Shield className="w-3 h-3" /> SEC: {systemStatus.security}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><Settings className="w-4 h-4" /></button>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><Maximize2 className="w-4 h-4" /></button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex gap-4 overflow-hidden z-10">
        {/* Left Sidebar - System Diagnostics */}
        <aside className="hidden lg:flex flex-col gap-4 w-64">
          <div className="glass-panel p-4 flex-1 flex flex-col gap-4">
            <h2 className="text-xs font-mono uppercase border-b border-[var(--color-jarvis-border)] pb-2 mb-2">Diagnostics</h2>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] uppercase">
                  <span>Core Temperature</span>
                  <span>42°C</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-[var(--color-jarvis-blue)]"
                    animate={{ width: '42%' }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] uppercase">
                  <span>Power Output</span>
                  <span>89%</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-[var(--color-jarvis-blue)]"
                    animate={{ width: '89%' }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] uppercase">
                  <span>Network Uplink</span>
                  <span>Active</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className={cn("h-4 w-full rounded-sm", i <= 4 ? "bg-[var(--color-jarvis-blue)]/40" : "bg-white/5")} />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-[var(--color-jarvis-border)]">
              <div className="flex items-center gap-2 text-[10px] uppercase opacity-60">
                <Wifi className="w-3 h-3" />
                <span>Encrypted Connection</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-4 h-32 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--color-jarvis-blue)_0%,_transparent_70%)]" />
            <div className="text-center">
              <div className="text-[10px] uppercase opacity-60 mb-1">Arc Reactor</div>
              <div className="text-lg font-bold tracking-widest">STABLE</div>
            </div>
          </div>
        </aside>

        {/* Main Terminal Area */}
        <section className="flex-1 glass-panel flex flex-col relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-jarvis-blue)] to-transparent opacity-20" />
          
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
          >
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, x: msg.role === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  className={cn(
                    "flex gap-4 max-w-[85%]",
                    msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
                    msg.role === 'user' ? "border-white/20 bg-white/5" : "border-[var(--color-jarvis-blue)]/40 bg-[var(--color-jarvis-blue)]/10"
                  )}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={cn(
                    "p-3 rounded-lg text-sm leading-relaxed",
                    msg.role === 'user' ? "bg-white/5 text-white/90" : "bg-[var(--color-jarvis-blue)]/5 text-[var(--color-jarvis-blue)]"
                  )}>
                    {msg.content}
                    <div className="text-[8px] uppercase opacity-40 mt-2 font-mono">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4 mr-auto"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-[var(--color-jarvis-blue)]/40 bg-[var(--color-jarvis-blue)]/10">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex gap-1 items-center p-3 bg-[var(--color-jarvis-blue)]/5 rounded-lg">
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }} className="w-1 h-1 bg-[var(--color-jarvis-blue)] rounded-full" />
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1 h-1 bg-[var(--color-jarvis-blue)] rounded-full" />
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1 h-1 bg-[var(--color-jarvis-blue)] rounded-full" />
                </div>
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-[var(--color-jarvis-border)] bg-black/20">
            <div className="relative flex items-center">
              <Terminal className="absolute left-3 w-4 h-4 opacity-40" />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Awaiting instructions, Sir..."
                className="w-full bg-white/5 border border-[var(--color-jarvis-border)] rounded-full py-3 pl-10 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-jarvis-blue)] transition-all placeholder:text-white/20"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="absolute right-2 p-2 bg-[var(--color-jarvis-blue)] text-black rounded-full hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Right Sidebar - Environmental Data */}
        <aside className="hidden xl:flex flex-col gap-4 w-64">
          <div className="glass-panel p-4 flex-1">
            <h2 className="text-xs font-mono uppercase border-b border-[var(--color-jarvis-border)] pb-2 mb-4">Environmental</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="text-[10px] uppercase opacity-60">Location</div>
                <div className="text-xs">Malibu, CA</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-[10px] uppercase opacity-60">Weather</div>
                <div className="text-xs">Clear // 24°C</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-[10px] uppercase opacity-60">Local Time</div>
                <div className="text-xs font-mono">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
              </div>
            </div>

            <div className="mt-8">
              <div className="text-[10px] uppercase opacity-60 mb-2 text-center">Satellite Uplink</div>
              <div className="grid grid-cols-4 gap-1">
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div 
                    key={i} 
                    className="aspect-square bg-[var(--color-jarvis-blue)]/20 rounded-sm"
                    animate={{ opacity: [0.2, 0.5, 0.2] }}
                    transition={{ repeat: Infinity, duration: 2, delay: i * 0.1 }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="glass-panel p-4 h-48 flex flex-col">
            <h2 className="text-[10px] uppercase opacity-60 mb-2">Network Traffic</h2>
            <div className="flex-1 flex items-end gap-1">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div 
                  key={i} 
                  className="w-full bg-[var(--color-jarvis-blue)]/40 rounded-t-sm"
                  animate={{ height: `${Math.random() * 100}%` }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.05 }}
                />
              ))}
            </div>
          </div>
        </aside>
      </main>

      {/* Footer / Status Bar */}
      <footer className="glass-panel px-4 py-2 flex justify-between items-center text-[10px] font-mono uppercase z-10">
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Mainframe Online</span>
          <span className="opacity-40">|</span>
          <span>Latency: 12ms</span>
        </div>
        <div className="flex gap-4 opacity-60">
          <span>{new Date().toLocaleDateString()}</span>
          <span>© Stark Industries</span>
        </div>
      </footer>

      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-5 pointer-events-none">
        <div className="w-full h-full rounded-full border border-[var(--color-jarvis-blue)] animate-[spin_60s_linear_infinite]" />
        <div className="absolute inset-10 rounded-full border border-dashed border-[var(--color-jarvis-blue)] animate-[spin_40s_linear_infinite_reverse]" />
        <div className="absolute inset-20 rounded-full border border-[var(--color-jarvis-blue)] opacity-50 animate-[spin_20s_linear_infinite]" />
      </div>
    </div>
  );
}
