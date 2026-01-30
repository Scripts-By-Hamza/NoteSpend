import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowLeft, Trash2, Pin, PinOff, Plus, Wallet, Clock, Tag } from 'lucide-react';
import { db } from '../db/db';
import { useAppContext } from '../context/AppContext';
import dayjs from 'dayjs';

const NoteDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currencySymbol } = useAppContext();
  
  const note = useLiveQuery(() => db.notes.get(id), [id]);
  const linkedExpenses = useLiveQuery(() => 
    db.expenses.where({ linkedNoteId: id, isDeleted: 0 }).reverse().sortBy('date'),
    [id]
  ) || [];

  const totalLinkedAmount = linkedExpenses.reduce((acc, curr) => 
    curr.type === 'expense' ? acc + curr.amount : acc - curr.amount, 0
  );

  const togglePin = async () => {
    await db.notes.update(id, { pinned: note.pinned ? 0 : 1 });
  };

  const deleteNote = async () => {
    if (confirm('Are you sure you want to delete this note?')) {
      await db.notes.update(id, { isDeleted: 1, deletedAt: new Date().toISOString() });
      navigate('/notes');
    }
  };

  if (!note) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between sticky top-0 bg-gray-50 dark:bg-gray-900 py-4 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-2">
          <button onClick={togglePin} className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ${note.pinned ? 'text-primary' : 'text-gray-400'}`}>
            {note.pinned ? <Pin size={22} fill="currentColor" /> : <Pin size={22} />}
          </button>
          <button onClick={deleteNote} className="p-2 rounded-full hover:bg-red-50 text-red-400">
            <Trash2 size={22} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl font-bold dark:text-white leading-tight">{note.title}</h1>
        <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
          <div className="flex items-center gap-1">
            <Clock size={14} />
            {dayjs(note.createdAt).format('MMMM D, YYYY · h:mm A')}
          </div>
          {note.tags?.length > 0 && (
            <div className="flex items-center gap-1">
              <Tag size={14} />
              {note.tags.join(', ')}
            </div>
          )}
        </div>

        <div className="prose dark:prose-invert max-w-none py-4 text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
          {note.description || <p className="text-gray-400 italic">No content</p>}
        </div>
      </div>

      <div className="pt-8 space-y-4">
        <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-6">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold">Linked Expenses</h2>
            <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{linkedExpenses.length}</span>
          </div>
          <button 
            onClick={() => navigate('/add-expense', { state: { linkedNoteId: id } })}
            className="text-primary text-sm font-semibold flex items-center gap-1 hover:bg-primary/5 px-2 py-1 rounded-lg transition-colors"
          >
            <Plus size={16} /> Add New
          </button>
        </div>

        {linkedExpenses.length > 0 ? (
          <div className="space-y-3">
             <div className="bg-primary/5 p-4 rounded-2xl flex items-center justify-between">
              <span className="text-sm font-medium text-primary">Total for this Note</span>
              <span className="text-lg font-bold text-primary">{currencySymbol}{totalLinkedAmount.toFixed(2)}</span>
            </div>
            
            <div className="grid gap-3">
              {linkedExpenses.map(expense => (
                <div key={expense.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${expense.type === 'income' ? 'bg-income/10 text-income' : 'bg-expense/10 text-expense'}`}>
                      <Wallet size={16} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{expense.category}</h4>
                      <p className="text-[10px] text-gray-400">{dayjs(expense.date).format('MMM D')}</p>
                    </div>
                  </div>
                  <p className={`font-bold text-sm ${expense.type === 'income' ? 'text-income' : 'text-expense'}`}>
                    {expense.type === 'income' ? '+' : '-'}{currencySymbol}{expense.amount.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-3xl text-center space-y-2">
            <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-300 mx-auto">
              <Wallet size={24} />
            </div>
            <p className="text-sm text-gray-400">No expenses linked to this note yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteDetailPage;
