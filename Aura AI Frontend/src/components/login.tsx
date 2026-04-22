// components/Login.tsx
import React, { useState } from 'react';
import { LogIn, User, Lock } from 'lucide-react';
import { cn } from '../utils/cn';

interface LoginProps {
    onLogin: (user: { id: string; username: string }) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim() || !password.trim()) return;

        setIsLoading(true);
        setError('');

        try {
            // Call your backend login API
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Invalid credentials');
            }

            const user = await response.json();
            onLogin(user);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[600px] w-full max-w-md mx-auto glass rounded-3xl overflow-hidden shadow-2xl relative z-10">
            <div className="p-8">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-tr from-aura-purple to-aura-pink flex items-center justify-center shadow-lg shadow-aura-purple/20">
                        <User size={32} className="text-white" />
                    </div>
                    <h2 className="font-display font-bold text-2xl">Welcome Back</h2>
                    <p className="text-white/40 text-sm mt-2">Sign in to continue to Aura</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-white/40 font-medium">
                            Username
                        </label>
                        <div className="relative">
                            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 focus:outline-none focus:ring-2 focus:ring-aura-purple/50 focus:border-aura-purple/50 transition-all placeholder:text-white/20"
                                placeholder="Enter your username"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-white/40 font-medium">
                            Password
                        </label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 focus:outline-none focus:ring-2 focus:ring-aura-purple/50 focus:border-aura-purple/50 transition-all placeholder:text-white/20"
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-400 text-sm text-center">{error}</div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || !username.trim() || !password.trim()}
                        className={cn(
                            "w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2",
                            isLoading || !username.trim() || !password.trim()
                                ? "bg-white/5 text-white/20 cursor-not-allowed"
                                : "bg-aura-purple text-white hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-aura-purple/30"
                        )}
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Signing in...</span>
                            </>
                        ) : (
                            <>
                                <LogIn size={18} />
                                <span>Sign In</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};