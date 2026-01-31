import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Lock, 
  Eye, 
  EyeOff, 
  Copy, 
  Trash2, 
  MoreVertical, 
  User as UserIcon, 
  Globe, 
  Key,
  Check,
  X
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { db } from '../db/db';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

const PasswordsPage = () => {
  const { passwords } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPasswordMap, setShowPasswordMap] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  const [formData, setFormData] = useState({
    serviceName: '',
    username: '',
    password: '',
    url: ''
  });

  const filteredPasswords = passwords.filter(p => 
    p.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const togglePasswordVisibility = (id) => {
    setShowPasswordMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.serviceName || !formData.password) return;

    const newPassword = {
      id: uuidv4(),
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: 0
    };

    await db.passwords.add(newPassword);
    setFormData({ serviceName: '', username: '', password: '', url: '' });
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this password?')) {
      await db.passwords.update(id, { isDeleted: 1 });
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between px-1">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Passwords</h1>
      </div>

      <div className="relative group px-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="Search services, usernames..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm transition-all"
        />
      </div>

      <div className="grid gap-4 px-1">
        {filteredPasswords.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-gray-700">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Lock size={32} />
            </div>
            <p className="text-gray-500 font-medium">No passwords saved yet</p>
            <p className="text-xs text-gray-400 mt-1">Keep your credentials safe and accessible</p>
          </div>
        ) : (
          filteredPasswords.map(p => (
            <div 
              key={p.id}
              className="bg-white dark:bg-gray-800 p-5 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <Globe size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{p.serviceName}</h3>
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-0.5">
                      <UserIcon size={12} />
                      <span>{p.username || 'No username'}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(p.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <Key size={16} className="text-gray-400" />
                  <p className="font-mono text-sm tracking-wider">
                    {showPasswordMap[p.id] ? p.password : '••••••••••••'}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => togglePasswordVisibility(p.id)}
                    className="p-2 text-gray-400 hover:text-primary rounded-lg transition-colors"
                  >
                    {showPasswordMap[p.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button 
                    onClick={() => copyToClipboard(p.password, p.id)}
                    className="p-2 text-gray-400 hover:text-primary rounded-lg transition-colors relative"
                  >
                    {copiedId === p.id ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Lock size={20} />
                </div>
                <h2 className="text-2xl font-bold">Add Password</h2>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Service Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Google, Netflix"
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                  value={formData.serviceName}
                  onChange={e => setFormData(p => ({ ...p, serviceName: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Username / Email</label>
                <input 
                  type="text"
                  placeholder="username@example.com"
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                  value={formData.username}
                  onChange={e => setFormData(p => ({ ...p, username: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Password</label>
                <input 
                  type="password"
                  required
                  placeholder="Your secure password"
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                  value={formData.password}
                  onChange={e => setFormData(p => ({ ...p, password: e.target.value }))}
                />
              </div>

              <button 
                type="submit"
                className="w-full py-5 bg-primary text-white rounded-[1.5rem] font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all mt-4"
              >
                Save Password
              </button>
            </form>
          </div>
        </div>
      )}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all sm:hidden z-40"
      >
        <Plus size={32} />
      </button>
    </div>
  );
};

export default PasswordsPage;
