import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileText, Plus, Wallet, Settings } from 'lucide-react';

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-around px-2 z-50">
      <NavLink 
        to="/" 
        className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}
      >
        <Home size={24} />
        <span className="text-xs">Home</span>
      </NavLink>
      
      <NavLink 
        to="/notes" 
        className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}
      >
        <FileText size={24} />
        <span className="text-xs">Notes</span>
      </NavLink>

      <div className="relative -mt-8">
        <NavLink 
          to="/add-note" // Placeholder, might use a modal later
          className="flex items-center justify-center w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-opacity-90 transition-all active:scale-95"
        >
          <Plus size={32} />
        </NavLink>
      </div>

      <NavLink 
        to="/expenses" 
        className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}
      >
        <Wallet size={24} />
        <span className="text-xs">Expenses</span>
      </NavLink>

      <NavLink 
        to="/settings" 
        className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}
      >
        <Settings size={24} />
        <span className="text-xs">Settings</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
