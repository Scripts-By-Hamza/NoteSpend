import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'auto');
  const [profile, setProfile] = useState(JSON.parse(localStorage.getItem('profile')) || {
    name: 'User',
    email: 'user@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky'
  });
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'PKR');

  useEffect(() => {
    localStorage.setItem('profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  const currencySymbol = currency === 'PKR' ? 'Rs.' : '$';
  
  const notes = useLiveQuery(() => 
    db.notes.where('isDeleted').equals(0).reverse().sortBy('createdAt'),
    []
  ) || [];

  const expenses = useLiveQuery(() => 
    db.expenses.where('isDeleted').equals(0).reverse().sortBy('date'),
    []
  ) || [];

  const settings = useLiveQuery(() => db.settings.toArray(), []) || [];

  useEffect(() => {
    // Initializing DB or checking status
    db.open().catch(err => {
      console.error("Failed to open db:", err.stack || err);
    });
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const value = useMemo(() => ({
    notes,
    expenses,
    settings,
    theme,
    setTheme,
    currency,
    setCurrency,
    currencySymbol,
    profile,
    setProfile,
    db
  }), [notes, expenses, settings, theme, currency, currencySymbol, profile]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
