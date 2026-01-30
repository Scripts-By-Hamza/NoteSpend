import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Plus, ChevronRight, FileText, Wallet, ArrowUpCircle, ArrowDownCircle, Edit2, Trash2 } from 'lucide-react';
import { db } from '../db/db';
import dayjs from 'dayjs';

const Dashboard = () => {
  const navigate = useNavigate();
  const { notes, expenses, currencySymbol, profile } = useAppContext();

  const currentMonth = dayjs().format('YYYY-MM');
  const monthStats = useMemo(() => {
    const currentMonthExpenses = expenses.filter(e => dayjs(e.date).format('YYYY-MM') === currentMonth);
    const income = currentMonthExpenses.filter(e => e.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const expense = currentMonthExpenses.filter(e => e.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
    return { income, expense, balance: income - expense };
  }, [expenses, currentMonth]);

  const recentNotes = notes.slice(0, 3);
  const recentExpenses = expenses.slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Hello, {profile.name}!</h1>
        <p className="text-gray-500 text-sm">Here's your summary for {dayjs().format('MMMM YYYY')}</p>
      </div>

      <div className="bg-primary rounded-[2rem] p-6 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
        <div className="relative z-10 space-y-6">
          <div>
            <p className="text-primary-foreground/70 text-sm font-medium">Net Balance</p>
            <h2 className="text-4xl font-bold mt-1">{currencySymbol}{monthStats.balance.toFixed(2)}</h2>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl">
                <ArrowUpCircle size={20} />
              </div>
              <div>
                <p className="text-white/70 text-[10px] uppercase font-bold tracking-wider">Income</p>
                <p className="font-bold text-sm">{currencySymbol}{monthStats.income.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl text-expense/50 bg-expense/10">
                <ArrowDownCircle size={20} className="text-white" />
              </div>
              <div>
                <p className="text-white/70 text-[10px] uppercase font-bold tracking-wider">Expense</p>
                <p className="font-bold text-sm">{currencySymbol}{monthStats.expense.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
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
                    <Wallet size={20} />
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
