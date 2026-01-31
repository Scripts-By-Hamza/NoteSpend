import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, Wallet, Trash2, Edit2, ChevronRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { db, defaultExpenseCategories, defaultIncomeCategories } from '../db/db';
import dayjs from 'dayjs';
import { CategoryIcon } from '../components/common/CategoryIcon';

const ExpensesPage = () => {
  const navigate = useNavigate();
  const { expenses, currencySymbol } = useAppContext();
  const [selectedMonth, setSelectedMonth] = useState('all');

  const filteredExpenses = useMemo(() => {
    if (selectedMonth === 'all') return expenses;
    return expenses.filter(e => {
      if (!e.date) return false;
      // Using startsWith for robust YYYY-MM matching
      return e.date.startsWith(selectedMonth);
    });
  }, [expenses, selectedMonth]);

  const stats = useMemo(() => {
    const income = filteredExpenses.filter(e => e.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const expense = filteredExpenses.filter(e => e.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
    return { income, expense, balance: income - expense };
  }, [filteredExpenses]);

  // Group by date
  const groupedExpenses = useMemo(() => {
    const groups = {};
    filteredExpenses.forEach(e => {
      const date = e.date;
      if (!groups[date]) groups[date] = [];
      groups[date].push(e);
    });
    return Object.entries(groups).sort((a, b) => dayjs(b[0]).unix() - dayjs(a[0]).unix());
  }, [filteredExpenses]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Expenses</h1>
        <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-xl flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase text-gray-400">Month:</span>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-transparent border-none text-xs font-bold focus:ring-0 p-0 pr-6 cursor-pointer"
          >
            <option value="all">All Time</option>
            {Array.from({ length: 12 }).map((_, i) => {
              const m = dayjs().subtract(i, 'month');
              const val = m.format('YYYY-MM');
              return (
                <option key={val} value={val}>
                  {m.format('MMMM YYYY')}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-income/10 p-3 rounded-2xl border border-income/20">
          <p className="text-[10px] uppercase font-bold text-income/70">Income</p>
          <p className="text-sm font-bold text-income">{currencySymbol}{stats.income.toFixed(2)}</p>
        </div>
        <div className="bg-expense/10 p-3 rounded-2xl border border-expense/20">
          <p className="text-[10px] uppercase font-bold text-expense/70">Expense</p>
          <p className="text-sm font-bold text-expense">{currencySymbol}{stats.expense.toFixed(2)}</p>
        </div>
        <div className="bg-primary/10 p-3 rounded-2xl border border-primary/20">
          <p className="text-[10px] uppercase font-bold text-primary/70">Balance</p>
          <p className="text-sm font-bold text-primary">{currencySymbol}{stats.balance.toFixed(2)}</p>
        </div>
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400">
            <Wallet size={40} />
          </div>
          <div>
            <h3 className="text-lg font-medium">No transactions</h3>
            <p className="text-gray-500">Add an expense or income for this month</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {groupedExpenses.map(([date, items]) => (
            <div key={date} className="space-y-2">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">
                {dayjs(date).isSame(dayjs(), 'day') ? 'Today' : 
                 dayjs(date).isSame(dayjs().subtract(1, 'day'), 'day') ? 'Yesterday' : 
                 dayjs(date).format('ddd, D MMM')}
              </h2>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden divide-y divide-gray-50 dark:divide-gray-700">
                {items.map(item => (
                  <div key={item.id} className="p-4 flex items-center justify-between active:bg-gray-50 dark:active:bg-gray-700 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.type === 'income' ? 'bg-income/10 text-income' : 'bg-expense/10 text-expense'}`}>
                        <CategoryIcon 
                          name={[...defaultExpenseCategories, ...defaultIncomeCategories].find(c => c.name === item.category)?.icon} 
                          size={20} 
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{item.category}</p>
                        {item.description && <p className="text-xs text-gray-400 line-clamp-1">{item.description}</p>}
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <p className={`font-bold ${item.type === 'income' ? 'text-income' : 'text-expense'}`}>
                        {item.type === 'income' ? '+' : '-'}{currencySymbol}{item.amount.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => navigate(`/expenses/edit/${item.id}`)}
                          className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (confirm('Delete this transaction?')) {
                              await db.expenses.update(item.id, { isDeleted: 1 });
                            }
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      {item.linkedNoteId && (
                        <span className="text-[10px] text-primary bg-primary/5 px-1.5 py-0.5 rounded-full">Linked</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => navigate('/add-expense')}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all sm:hidden z-40"
      >
        <Plus size={32} />
      </button>
    </div>
  );
};

export default ExpensesPage;
