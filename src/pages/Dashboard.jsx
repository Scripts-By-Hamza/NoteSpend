import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Plus, ChevronRight, FileText, Wallet, ArrowUpCircle, ArrowDownCircle, Edit2, Trash2, Eye, EyeOff, QrCode, ArrowUpRight, ArrowDownLeft, Repeat, History, Link as LinkIcon } from 'lucide-react';
import { db, defaultExpenseCategories, defaultIncomeCategories } from '../db/db';
import dayjs from 'dayjs';
import { CategoryIcon } from '../components/common/CategoryIcon';

const Dashboard = () => {
  const navigate = useNavigate();
  const { notes, expenses, currencySymbol, profile, links } = useAppContext();
  const [showBalance, setShowBalance] = useState(true);

  const currentMonth = dayjs().format('YYYY-MM');
  const monthStats = useMemo(() => {
    const currentMonthExpenses = expenses.filter(e => dayjs(e.date).format('YYYY-MM') === currentMonth);
    const income = currentMonthExpenses.filter(e => e.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const expense = currentMonthExpenses.filter(e => e.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
    return { income, expense, balance: income - expense };
  }, [expenses, currentMonth]);

  const recentNotes = notes.slice(0, 3);
  const recentExpenses = expenses.slice(0, 3);
  const recentLinks = (links || []).slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full border-2 border-primary/20 p-0.5 bg-gradient-to-tr from-primary to-blue-400">
            <img 
              src={profile.avatar} 
              alt="Profile" 
              className="w-full h-full rounded-full object-cover border-2 border-white dark:border-gray-900"
            />
          </div>
          <div>
            <p className="text-gray-400 text-xs font-medium">Hello {profile.name},</p>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Welcome Back!</h1>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-2.5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center min-w-[70px]">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{dayjs().format('MMM')}</p>
          <p className="text-lg font-black text-primary leading-none">{dayjs().format('DD')}</p>
        </div>
      </div>

      {/* Main Banner Card */}
      <div className="bg-gradient-to-br from-[#5D5FEF] to-[#4446D1] rounded-[2.5rem] p-8 text-white shadow-2xl shadow-primary/30 relative overflow-hidden">
        <div className="relative z-10 space-y-8">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white/80">
                <Wallet size={16} />
                <p className="text-xs font-medium tracking-wide">Your wallet Balance</p>
              </div>
              <div className="flex items-center gap-4">
                <h2 className="text-4xl font-extrabold tracking-tight">
                  {showBalance ? `${currencySymbol}${monthStats.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••••'}
                </h2>
                <button 
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  {showBalance ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/links')}
              className="bg-white/10 hover:bg-white/20 p-4 rounded-[1.25rem] backdrop-blur-md transition-all active:scale-95 group"
            >
              <QrCode size={32} className="group-hover:rotate-12 transition-transform" />
            </button>
          </div>

          {/* Combined Stats */}
          <div className="space-y-6 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]"></div>
                <p className="text-xs text-white/70 font-medium">Income:</p>
                <p className="text-sm font-bold tracking-tight text-green-300">{currencySymbol}{monthStats.income.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.6)]"></div>
                <p className="text-xs text-white/70 font-medium">Expense:</p>
                <p className="text-sm font-bold tracking-tight text-red-300">{currencySymbol}{monthStats.expense.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Glass Elements */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-[40px] translate-y-1/2 -translate-x-1/2"></div>
      </div>

      {/* Recent Links Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-bold">Recent Links</h2>
          <button onClick={() => navigate('/links')} className="text-primary text-sm font-semibold flex items-center">
            See all <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid gap-3">
          {recentLinks.length === 0 ? (
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl text-center">
              <p className="text-sm text-gray-500">No links yet</p>
            </div>
          ) : (
            recentLinks.map(link => (
              <div 
                key={link.id} 
                onClick={() => window.open(link.url, '_blank')}
                className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 active:scale-95 transition-all cursor-pointer"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <LinkIcon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{link.name || 'Untitled Link'}</h3>
                  <p className="text-xs text-gray-400 truncate">{link.url}</p>
                </div>
                <ChevronRight size={16} className="text-gray-300" />
              </div>
            ))
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-bold">Recent Notes</h2>
          <button onClick={() => navigate('/notes')} className="text-primary text-sm font-semibold flex items-center">
            See all <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid gap-3">
          {recentNotes.length === 0 ? (
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl text-center">
              <p className="text-sm text-gray-500">No notes yet</p>
            </div>
          ) : (
            recentNotes.map(note => (
              <div 
                key={note.id} 
                onClick={() => navigate(`/notes/${note.id}`)}
                className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 active:scale-95 transition-all"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <FileText size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{note.title}</h3>
                  <p className="text-xs text-gray-400">{dayjs(note.createdAt).format('MMM D')}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="space-y-4 pb-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-bold">Recent Expenses</h2>
          <button onClick={() => navigate('/expenses')} className="text-primary text-sm font-semibold flex items-center">
            See all <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid gap-3">
           {recentExpenses.length === 0 ? (
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl text-center">
              <p className="text-sm text-gray-500">No expenses yet</p>
            </div>
          ) : (
            recentExpenses.map(expense => (
              <div 
                key={expense.id}
                className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between active:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${expense.type === 'income' ? 'bg-income/10 text-income' : 'bg-expense/10 text-expense'}`}>
                    <CategoryIcon 
                      name={[...defaultExpenseCategories, ...defaultIncomeCategories].find(c => c.name === expense.category)?.icon} 
                      size={20} 
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{expense.category}</h3>
                    <p className="text-xs text-gray-400">{dayjs(expense.date).format('MMM D')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className={`font-bold ${expense.type === 'income' ? 'text-income' : 'text-expense'}`}>
                            {expense.type === 'income' ? '+' : '-'}{currencySymbol}{expense.amount.toFixed(2)}
                        </p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/expenses/edit/${expense.id}`);
                                }}
                                className="p-1 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
                            >
                                <Edit2 size={12} />
                            </button>
                            <button 
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    if (confirm('Delete this transaction?')) {
                                        await db.expenses.update(expense.id, { isDeleted: 1 });
                                    }
                                }}
                                className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                    </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
