import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../db/db';
import { Lock, User, Mail, Key, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

const RegistrationPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [registeredUser, setRegisteredUser] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const generateUserId = (username) => {
        const randomDigits = Math.floor(1000 + Math.random() * 9000);
        return `${username}${randomDigits}`;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const userId = generateUserId(formData.username);
        const newUser = {
            userId,
            username: formData.username,
            email: formData.email,
            password: formData.password
        };

        try {
            await db.auth.add(newUser);
            setRegisteredUser(newUser);
        } catch (error) {
            console.error("Registration failed:", error);
            alert("Registration failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (registeredUser) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-950 animate-in fade-in duration-500">
                <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-[2.5rem] p-10 shadow-2xl border border-gray-100 dark:border-gray-800 text-center space-y-8 animate-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto text-green-600 dark:text-green-400">
                        <CheckCircle2 size={48} />
                    </div>
                    
                    <div className="space-y-2">
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Account Created!</h2>
                        <p className="text-gray-500 dark:text-gray-400">Welcome to NoteSpend. Here are your credentials:</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-6 space-y-4 border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center px-2">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">User ID</span>
                            <span className="text-lg font-mono font-bold text-primary">{registeredUser.userId}</span>
                        </div>
                        <div className="h-px bg-gray-200 dark:bg-gray-700 w-full"></div>
                        <div className="flex justify-between items-center px-2">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Password</span>
                            <span className="text-lg font-mono font-bold text-gray-900 dark:text-white">{registeredUser.password}</span>
                        </div>
                    </div>

                    <p className="text-xs text-red-500 font-medium">Please save these details. You'll need them to access your account.</p>

                    <button 
                        onClick={() => window.location.reload()}
                        className="w-full py-5 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/30 hover:opacity-90 active:scale-[0.98] transition-all"
                    >
                        Let's Get Started
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-6 sm:p-12">
            <div className="max-w-md w-full space-y-10">
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary mb-6">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Create Account</h1>
                    <p className="text-gray-500 dark:text-gray-400">Join NoteSpend to secure your data locally.</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Your Name</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                            <input 
                                type="text" 
                                required
                                placeholder="e.g., Hamza"
                                className="w-full pl-12 pr-5 py-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium"
                                value={formData.username}
                                onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                            <input 
                                type="email" 
                                required
                                placeholder="name@example.com"
                                className="w-full pl-12 pr-5 py-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium"
                                value={formData.email}
                                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Choose Password</label>
                        <div className="relative group">
                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                            <input 
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="Your secure password"
                                className="w-full pl-12 pr-12 py-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium"
                                value={formData.password}
                                onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-5 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/30 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            'Create My Account'
                        )}
                    </button>
                </form>

                <p className="text-center text-xs text-gray-400 max-w-[280px] mx-auto leading-relaxed">
                    By registering, you agree to store your data locally on this device. NoteSpend does not upload your data to any server.
                </p>
            </div>
        </div>
    );
};

export default RegistrationPage;
