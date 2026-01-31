import Dexie from 'dexie';

export const db = new Dexie('NoteSpendDB');

db.version(1).stores({
  notes: 'id, title, createdAt, updatedAt, pinned, *tags, isDeleted',
  expenses: 'id, date, category, type, linkedNoteId, isDeleted',
  categories: 'id, type, name',
  settings: 'key',
  links: 'id, name, url, createdAt, updatedAt, isDeleted',
  passwords: 'id, serviceName, username, createdAt, isDeleted',
  auth: 'userId, username, email, password'
});

// Default categories
export const defaultExpenseCategories = [
  { id: '1', name: 'Food & Dining', type: 'expense', icon: 'Utensils', color: '#F87171' },
  { id: '2', name: 'Transportation', type: 'expense', icon: 'Car', color: '#60A5FA' },
  { id: '3', name: 'Shopping', type: 'expense', icon: 'ShoppingBag', color: '#F472B6' },
  { id: '4', name: 'Bills & Utilities', type: 'expense', icon: 'CreditCard', color: '#FBBF24' },
  { id: '5', name: 'Entertainment', type: 'expense', icon: 'Film', color: '#A78BFA' },
  { id: '6', name: 'Healthcare', type: 'expense', icon: 'Activity', color: '#34D399' },
  { id: '7', name: 'Education', type: 'expense', icon: 'BookOpen', color: '#818CF8' },
  { id: '8', name: 'Travel', type: 'expense', icon: 'Plane', color: '#FB923C' },
  { id: '9', name: 'Rent/Mortgage', type: 'expense', icon: 'Home', color: '#4ADE80' },
  { id: '10', name: 'Other', type: 'expense', icon: 'MoreHorizontal', color: '#9CA3AF' },
];

export const defaultIncomeCategories = [
  { id: '11', name: 'Salary', type: 'income', icon: 'Briefcase', color: '#10B981' },
  { id: '12', name: 'Freelance', type: 'income', icon: 'Laptop', color: '#3B82F6' },
  { id: '13', name: 'Business', type: 'income', icon: 'TrendingUp', color: '#8B5CF6' },
  { id: '14', name: 'Investment', type: 'income', icon: 'PieChart', color: '#F59E0B' },
  { id: '15', name: 'Gift/Bonus', type: 'income', icon: 'Gift', color: '#EC4899' },
  { id: '16', name: 'Other', type: 'income', icon: 'MoreHorizontal', color: '#9CA3AF' },
];
