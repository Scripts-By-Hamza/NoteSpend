import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ProfileModal from '../components/common/ProfileModal';
import { db } from '../db/db';
import { 
  User, 
  Moon, 
  Sun, 
  Monitor, 
  Download, 
  Upload, 
  Trash2, 
  ChevronRight, 
  Globe, 
  Clock,
  Info,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { theme, setTheme, currency, setCurrency, profile, setProfile } = useAppContext();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const exportData = async () => {
    const notes = await db.notes.toArray();
    const expenses = await db.expenses.toArray();
    const data = { notes, expenses, timestamp: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    saveAs(blob, `notespend-backup-${dayjs().format('YYYY-MM-DD')}.json`);
  };

  const importData = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.notes) await db.notes.bulkPut(data.notes);
        if (data.expenses) await db.expenses.bulkPut(data.expenses);
        alert('Data imported successfully!');
        window.location.reload();
      } catch (err) {
        alert('Failed to import data: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = async () => {
    if (confirm('CRITICAL: This will permanently delete all your notes and expenses. Are you absolutely sure?')) {
      await db.notes.clear();
      await db.expenses.clear();
      alert('All data cleared.');
      window.location.reload();
    }
  };

  const SettingItem = ({ icon: Icon, label, value, onClick, color = 'text-gray-500' }) => (
    <div 
      onClick={onClick}
      className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl active:bg-gray-50 dark:active:bg-gray-700 transition-colors cursor-pointer border border-gray-50 dark:border-gray-700"
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 bg-gray-50 dark:bg-gray-900 rounded-xl ${color}`}>
          <Icon size={20} />
        </div>
        <div>
          <p className="text-sm font-semibold">{label}</p>
          {value && <p className="text-xs text-gray-400 capitalize">{value}</p>}
        </div>
      </div>
      <ChevronRight size={18} className="text-gray-300" />
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Settings</h1>
        <div className="flex items-center gap-2">
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-full font-bold">BETA</span>
        </div>
      </div>

      {/* Profile Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-primary/10 flex-shrink-0 border-2 border-white dark:border-gray-700 shadow-sm">
            <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold truncate">{profile.name}</h2>
            <p className="text-sm text-gray-400 truncate">{profile.email}</p>
        </div>
        <button 
            onClick={() => setIsProfileModalOpen(true)}
            className="p-3 bg-primary/10 text-primary rounded-2xl hover:bg-primary/20 transition-colors"
        >
            <User size={20} />
        </button>
      </div>

      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">Appearance</h2>
        <div className="grid gap-2">
          <SettingItem 
            icon={theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor}
            label="Theme" 
            value={theme}
            onClick={() => {
              const modes = ['light', 'dark', 'auto'];
              const next = modes[(modes.indexOf(theme) + 1) % 3];
              setTheme(next);
            }}
            color="text-primary"
          />
          <SettingItem icon={Smartphone} label="Font Size" value="Medium (Default)" />
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">Regional</h2>
        <div className="grid gap-2">
          <SettingItem 
            icon={Globe} 
            label="Currency" 
            value={currency === 'PKR' ? 'PKR (Rs.)' : 'USD ($)'} 
            onClick={() => setCurrency(currency === 'PKR' ? 'USD' : 'PKR')}
          />
          <SettingItem icon={Clock} label="Date Format" value="DD/MM/YYYY" />
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">Data Management</h2>
        <div className="grid gap-2">
          <SettingItem 
            icon={Download} 
            label="Export Data" 
            value="Backup as JSON" 
            onClick={exportData}
            color="text-blue-500"
          />
          <div className="relative">
             <SettingItem 
              icon={Upload} 
              label="Import Data" 
              value="Restore from JSON" 
              onClick={() => document.getElementById('import-input').click()}
              color="text-blue-500"
            />
            <input 
              id="import-input"
              type="file" 
              accept=".json" 
              className="hidden" 
              onChange={importData} 
            />
          </div>
          <SettingItem 
            icon={Trash2} 
            label="Clear All Data" 
            value="Permanent deletion" 
            onClick={clearAllData}
            color="text-red-500"
          />
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">About</h2>
        <div className="grid gap-2">
          <SettingItem icon={ShieldCheck} label="Privacy Policy" />
          <SettingItem icon={Info} label="App Version" value="v1.0.0 (Beta)" />
        </div>
      </div>

      {isProfileModalOpen && (
        <ProfileModal 
            profile={profile} 
            onSave={(updated) => {
                setProfile(updated);
                setIsProfileModalOpen(false);
            }} 
            onClose={() => setIsProfileModalOpen(false)} 
        />
      )}

      {/* <div className="text-center py-6">
        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Designed with ❤️ for NoteSpend</p>
      </div> */}
    </div>
  );
};

export default SettingsPage;
