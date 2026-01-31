import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { ArrowLeft, Save, Plus, Link as LinkIcon, Trash2 } from 'lucide-react';
import { db, defaultExpenseCategories, defaultIncomeCategories } from '../db/db';
import { useAppContext } from '../context/AppContext';
import { useEffect } from 'react';
import { CategoryIcon } from '../components/common/CategoryIcon';

const expenseSchema = z.object({
  type: z.enum(['expense', 'income']),
  amount: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'Amount must be a positive number'),
  category: z.string().min(1, 'Category is required'),
  date: z.string(),
  description: z.string().max(500).optional(),
  linkedNoteId: z.string().optional().nullable(),
});

const AddExpensePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { notes, currencySymbol } = useAppContext();
  const [type, setType] = useState('expense');
  const isEdit = !!id;
  
  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
      category: defaultExpenseCategories[0].name,
    }
  });

  useEffect(() => {
    if (isEdit) {
      db.expenses.get(id).then(expense => {
        if (expense) {
          setType(expense.type);
          reset({
            ...expense,
            amount: expense.amount.toString(),
            date: dayjs(expense.date).format('YYYY-MM-DD')
          });
        }
      });
    }
  }, [id, isEdit, reset]);

  const selectedCategory = watch('category');

  const onSubmit = async (data) => {
    const amount = parseFloat(data.amount);
    const expenseData = {
      ...data,
      amount,
      updatedAt: new Date().toISOString(),
      isDeleted: 0,
    };
    
    if (isEdit) {
      await db.expenses.update(id, expenseData);
    } else {
      await db.expenses.add({
        id: uuidv4(),
        ...expenseData,
        createdAt: new Date().toISOString(),
      });
    }
    
    // Update linked note count if applicable (simplified for now)
    if (data.linkedNoteId) {
      const note = await db.notes.get(data.linkedNoteId);
      if (note) {
        const existingLinks = note.linkedExpenseIds || [];
        if (!existingLinks.includes(isEdit ? id : expenseData.id)) {
            await db.notes.update(data.linkedNoteId, {
              linkedExpenseIds: [...existingLinks, isEdit ? id : expenseData.id],
              updatedAt: new Date().toISOString()
            });
        }
      }
    }
    
    navigate('/expenses');
  };

  const deleteExpense = async () => {
    if (confirm('Are you sure you want to delete this transaction?')) {
        await db.expenses.update(id, { isDeleted: 1 });
        navigate('/expenses');
    }
  }

  const categories = type === 'expense' ? defaultExpenseCategories : defaultIncomeCategories;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">{isEdit ? 'Edit' : 'Add'} Transaction</h1>
        <div className="flex items-center gap-2">
            {isEdit && (
                <button 
                  onClick={deleteExpense}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 size={20} />
                </button>
            )}
            <button 
              onClick={handleSubmit(onSubmit)}
              className="bg-primary text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-opacity-90 active:scale-95 transition-all flex items-center gap-2"
            >
              <Save size={20} />
              {isEdit ? 'Update' : 'Save'}
            </button>
        </div>
      </div>

      <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
        <button
          onClick={() => { setType('expense'); setValue('type', 'expense'); setValue('category', defaultExpenseCategories[0].name); }}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${type === 'expense' ? 'bg-white dark:bg-gray-700 shadow-sm text-expense' : 'text-gray-500'}`}
        >
          Expense
        </button>
        <button
          onClick={() => { setType('income'); setValue('type', 'income'); setValue('category', defaultIncomeCategories[0].name); }}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${type === 'income' ? 'bg-white dark:bg-gray-700 shadow-sm text-income' : 'text-gray-500'}`}
        >
          Income
        </button>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">{currencySymbol}</span>
          <input
            {...register('amount')}
            type="number"
            step="0.01"
            placeholder="0.00"
            className="w-full pl-10 pr-4 py-6 text-4xl font-bold bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
          />
          {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-500 px-1">Category</label>
          <div className="grid grid-cols-5 gap-2">
            {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setValue('category', cat.name)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${selectedCategory === cat.name ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 dark:border-gray-700 dark:bg-gray-800 text-gray-400'}`}
                >
                  <div className="w-8 h-8 flex items-center justify-center rounded-full mb-1" style={{ backgroundColor: selectedCategory === cat.name ? cat.color + '20' : 'transparent', color: selectedCategory === cat.name ? cat.color : undefined }}>
                    <CategoryIcon name={cat.icon} size={18} />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-tight text-center line-clamp-1">{cat.name}</span>
                </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500 px-1">Date</label>
            <div className="flex flex-col gap-2">
              <input
                {...register('date')}
                type="date"
                className="w-full p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm text-sm"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setValue('date', dayjs().format('YYYY-MM-DD'))}
                  className="flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setValue('date', dayjs().subtract(1, 'day').format('YYYY-MM-DD'))}
                  className="flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  Yesterday
                </button>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500 px-1 flex items-center gap-1">
              <LinkIcon size={14} /> Link Note
            </label>
            <select
              {...register('linkedNoteId')}
              className="w-full p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm appearance-none text-sm"
            >
              <option value="">No Note</option>
              {notes.map(note => (
                <option key={note.id} value={note.id}>{note.title}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-500 px-1">Description (Optional)</label>
          <input
            {...register('description')}
            type="text"
            placeholder="What was this for?"
            className="w-full p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
          />
        </div>
      </div>
    </div>
  );
};

import dayjs from 'dayjs';
export default AddExpensePage;
