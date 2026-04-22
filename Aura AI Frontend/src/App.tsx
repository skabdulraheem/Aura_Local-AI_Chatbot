import React, { useState, useRef } from 'react';
import { Hero } from './components/Hero';
import { ChatInterface } from './components/ChatInterface';
import { Toast } from './components/Toast';
import { Modal } from './components/Modal';
import { motion } from 'motion/react';
import { Github, Twitter, Cpu, Shield, Zap, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { api } from './services/api';

export default function App() {
  const [toast, setToast] = useState<{ isVisible: boolean; message: string }>({
    isVisible: false,
    message: '',
  });

  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(() => {
    const saved = localStorage.getItem('aura_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeModal, setActiveModal] = useState<'login' | 'signup' | null>(null);
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [logoutTimestamp, setLogoutTimestamp] = useState<number>(0);

  const chatRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);

  const showToast = (message: string) => {
    setToast({ isVisible: true, message });
    setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }));
    }, 3000);
  };

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let response;
      if (activeModal === 'signup') {
        response = await api.signup(authForm);
        showToast(`Welcome, ${authForm.name}! Account created.`);
      } else {
        response = await api.login({ email: authForm.email, password: authForm.password });
        showToast("Logged in successfully.");
      }

      setUser(response.user);
      localStorage.setItem('aura_user', JSON.stringify(response.user));
      setActiveModal(null);
      setAuthForm({ name: '', email: '', password: '' });
    } catch (error: any) {
      console.error("Auth error:", error);
      showToast(error.message || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('aura_user');
    localStorage.removeItem('aura_messages');
    showToast("Logged out successfully.");
    setLogoutTimestamp(Date.now());
  };

  return (
    <div className="min-h-screen aura-gradient selection:bg-aura-purple/30">
      {/* Toast Notification */}
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />

      {/* Auth Modal */}
      <Modal
        isOpen={activeModal === 'login' || activeModal === 'signup'}
        onClose={() => !isLoading && setActiveModal(null)}
        title={activeModal === 'login' ? 'Welcome Back' : 'Create Account'}
      >
        <form onSubmit={handleAuth} className="space-y-6">
          {activeModal === 'signup' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/60 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input
                  required
                  type="text"
                  placeholder="John Doe"
                  value={authForm.name}
                  onChange={e => setAuthForm({ ...authForm, name: e.target.value })}
                  disabled={isLoading}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-aura-purple/50 transition-all disabled:opacity-50"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/60 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input
                required
                type="email"
                placeholder="name@example.com"
                value={authForm.email}
                onChange={e => setAuthForm({ ...authForm, email: e.target.value })}
                disabled={isLoading}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-aura-purple/50 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/60 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input
                required
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={authForm.password}
                onChange={e => setAuthForm({ ...authForm, password: e.target.value })}
                disabled={isLoading}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-aura-purple/50 transition-all disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-2xl bg-aura-purple text-white font-bold shadow-lg shadow-aura-purple/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{activeModal === 'login' ? 'Login' : 'Create Account'}</span>
            )}
          </button>

          <p className="text-center text-sm text-white/40">
            {activeModal === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setActiveModal(activeModal === 'login' ? 'signup' : 'login')}
              disabled={isLoading}
              className="text-aura-purple font-bold hover:underline disabled:opacity-50"
            >
              {activeModal === 'login' ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </form>
      </Modal>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between glass rounded-2xl px-6 py-3">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 rounded-lg bg-aura-purple flex items-center justify-center">
              <span className="font-display font-bold text-lg">A</span>
            </div>
            <span className="font-display font-bold text-xl tracking-tight">Aura</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
            <button onClick={() => scrollTo(featuresRef)} className="hover:text-white transition-colors">Features</button>
            <button onClick={() => scrollTo(howItWorksRef)} className="hover:text-white transition-colors">How it Works</button>
            <button onClick={() => scrollTo(aboutRef)} className="hover:text-white transition-colors">About</button>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-white/80">Hi, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setActiveModal('login')}
                  className="hidden sm:block text-sm font-medium text-white/60 hover:text-white transition-colors"
                >
                  Log in
                </button>
                <button
                  onClick={() => setActiveModal('signup')}
                  className="px-5 py-2 rounded-xl bg-aura-purple text-white text-sm font-bold shadow-lg shadow-aura-purple/20 hover:scale-105 active:scale-95 transition-all"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 pb-24">
        <Hero onGetStarted={() => scrollTo(chatRef)} />

        <motion.div
          ref={chatRef}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-12 pt-20"
        >
          {/* Use a div wrapper with key to force re-render on logout */}
          <div key={logoutTimestamp}>
            <ChatInterface user={user} />
          </div>
        </motion.div>

        {/* Features Grid */}
        <section ref={featuresRef} className="mt-32 pt-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Powerful Features</h2>
            <p className="text-white/60 max-w-2xl mx-auto">Everything you need to supercharge your workflow with artificial intelligence.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Cpu, title: "Neural Engine", desc: "Powered by the latest Gemini 3.1 models for unprecedented reasoning." },
              { icon: Shield, title: "Privacy First", desc: "Your data is encrypted and never used for training without consent." },
              { icon: Zap, title: "Instant Response", desc: "Optimized for speed with sub-second latency on most queries." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass p-8 rounded-3xl space-y-4 hover:bg-white/10 transition-colors group cursor-pointer"
                onClick={() => showToast(`${feature.title} is active for your account.`)}
              >
                <div className="w-12 h-12 rounded-2xl bg-aura-purple/10 flex items-center justify-center text-aura-purple group-hover:scale-110 transition-transform">
                  <feature.icon size={24} />
                </div>
                <h3 className="font-display font-bold text-xl">{feature.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How it Works Section */}
        <section ref={howItWorksRef} className="mt-32 pt-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">How it Works</h2>
            <p className="text-white/60 max-w-2xl mx-auto">Three simple steps to unlock the power of Aura AI.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: "01", title: "Connect", desc: "Sign up and connect your workspace to our neural network." },
              { step: "02", title: "Interact", desc: "Chat with Aura using natural language to solve complex problems." },
              { step: "03", title: "Evolve", desc: "Watch your productivity soar as Aura learns your unique style." }
            ].map((item, i) => (
              <div key={i} className="relative p-8 rounded-3xl bg-white/5 border border-white/10">
                <div className="text-5xl font-display font-bold text-aura-purple/20 absolute top-4 right-6">{item.step}</div>
                <h3 className="text-xl font-bold mb-4 relative z-10">{item.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed relative z-10">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* About Section */}
        <section ref={aboutRef} className="mt-32 pt-20">
          <div className="glass p-12 rounded-[40px] overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-aura-purple/10 blur-[100px] -z-10" />
            <div className="max-w-3xl">
              <h2 className="text-4xl font-display font-bold mb-8">About Aura AI</h2>
              <div className="space-y-6 text-lg text-white/70 leading-relaxed">
                <p>
                  Aura AI was born from a simple vision: to bridge the gap between human creativity and artificial intelligence. We believe that AI should be an extension of the human mind, not a replacement for it.
                </p>
                <p>
                  Our team of researchers and designers work tirelessly to create interfaces that feel natural, intuitive, and inspiring. Aura isn't just a chatbot; it's a partner in your creative journey.
                </p>
                <p>
                  Built on the cutting-edge Gemini architecture, Aura provides unparalleled reasoning capabilities while maintaining a focus on privacy, security, and ethical AI development.
                </p>
              </div>
              <div className="mt-12 flex items-center gap-8">
                <div>
                  <div className="text-3xl font-display font-bold text-white">10M+</div>
                  <div className="text-xs uppercase tracking-widest text-white/40 mt-1">Messages Sent</div>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <div>
                  <div className="text-3xl font-display font-bold text-white">50k+</div>
                  <div className="text-xs uppercase tracking-widest text-white/40 mt-1">Active Users</div>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <div>
                  <div className="text-3xl font-display font-bold text-white">99.9%</div>
                  <div className="text-xs uppercase tracking-widest text-white/40 mt-1">Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center">
              <span className="text-[10px] font-bold">A</span>
            </div>
            <span className="text-sm font-display font-bold tracking-tight text-white/40">© 2026 Aura AI. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-white/40">
            <button onClick={() => showToast("Follow us on Twitter!")} className="hover:text-white transition-colors"><Twitter size={20} /></button>
            <button onClick={() => showToast("Check our GitHub!")} className="hover:text-white transition-colors"><Github size={20} /></button>
          </div>

          <div className="flex items-center gap-8 text-xs font-medium text-white/40 uppercase tracking-widest">
            <button onClick={() => scrollTo(aboutRef)} className="hover:text-white transition-colors">About</button>
            <button onClick={() => scrollTo(howItWorksRef)} className="hover:text-white transition-colors">Process</button>
            <button onClick={() => showToast("System Status: All systems operational.")} className="hover:text-white transition-colors">Status</button>
          </div>
        </div>
      </footer>
    </div>
  );
}