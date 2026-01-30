import React, { useState } from 'react';
import { X, Save, User as UserIcon, Mail, Camera } from 'lucide-react';

const ProfileModal = ({ profile, onSave, onClose }) => {
  const [formData, setFormData] = useState({ ...profile });
  const [activeAvatar, setActiveAvatar] = useState(profile.avatar);

  const avatars = [
    'Lucky', 'Spooky', 'Ginger', 'Snowball', 'Sassy', 'Mittens'
  ].map(seed => `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Edit Profile</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-8">
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
                <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-primary/20 shadow-lg">
                    <img src={activeAvatar} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-2 -right-2 p-2 bg-primary text-white rounded-xl shadow-lg">
                    <Camera size={16} />
                </div>
            </div>
            <div className="flex gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-x-auto w-full no-scrollbar">
                {avatars.map((url, i) => (
                    <button 
                        key={i}
                        onClick={() => {
                            setActiveAvatar(url);
                            setFormData(prev => ({ ...prev, avatar: url }));
                        }}
                        className={`w-12 h-12 rounded-xl flex-shrink-0 border-2 transition-all ${activeAvatar === url ? 'border-primary scale-110 shadow-md' : 'border-transparent opacity-50'}`}
                    >
                        <img src={url} alt="Avatar option" className="w-full h-full" />
                    </button>
                ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase px-1">Full Name</label>
              <div className="relative">
                <UserIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none focus:ring-2 focus:ring-primary transition-all font-medium"
                  placeholder="Enter your name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase px-1">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none focus:ring-2 focus:ring-primary transition-all font-medium"
                  placeholder="name@example.com"
                />
              </div>
            </div>
          </div>

          <button 
            onClick={() => onSave(formData)}
            className="w-full py-5 bg-primary text-white rounded-[1.5rem] font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
