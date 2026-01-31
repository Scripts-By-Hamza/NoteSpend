import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileText, Wallet, Settings, Link as LinkIcon, User, Lock } from 'lucide-react';

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-around px-1 z-50">
      <NavLink 
        to="/profile" 
        className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-primary font-bold' : 'text-gray-500 dark:text-gray-400'}`}
      >
        <User size={20} />
        <span className="text-[9px]">Profile</span>
      </NavLink>

      <NavLink 
        to="/links" 
        className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-primary font-bold' : 'text-gray-500 dark:text-gray-400'}`}
      >
        <LinkIcon size={20} />
        <span className="text-[9px]">Links</span>
      </NavLink>

      <NavLink 
        to="/passwords" 
        className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-primary font-bold' : 'text-gray-500 dark:text-gray-400'}`}
      >
        <Lock size={20} />
        <span className="text-[9px]">Password</span>
      </NavLink>
      
      <div className="relative -mt-10">
        <NavLink 
          to="/" 
          className={({ isActive }) => `flex flex-col items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all active:scale-95 border-4 border-white dark:border-gray-900 ${isActive ? 'bg-gradient-to-br from-[#5D5FEF] to-[#4446D1] text-white ring-4 ring-primary/20' : 'bg-white dark:bg-gray-800 text-gray-400'}`}
        >
          <Home size={24} />
        </NavLink>
      </div>

      <NavLink 
        to="/expenses" 
        className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-primary font-bold' : 'text-gray-500 dark:text-gray-400'}`}
      >
        <Wallet size={20} />
        <span className="text-[9px]">Expenses</span>
      </NavLink>

      <NavLink 
        to="/notes" 
        className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-primary font-bold' : 'text-gray-500 dark:text-gray-400'}`}
      >
        <FileText size={20} />
        <span className="text-[9px]">Notes</span>
      </NavLink>

      <NavLink 
        to="/settings" 
        className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-primary font-bold' : 'text-gray-500 dark:text-gray-400'}`}
      >
        <Settings size={20} />
        <span className="text-[9px]">Settings</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
