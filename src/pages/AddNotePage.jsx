import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { ArrowLeft, Save, X } from 'lucide-react';
import { db } from '../db/db';

const noteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(10000).optional(),
});

const AddNotePage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(noteSchema),
  });

  const onSubmit = async (data) => {
    const newNote = {
      id: uuidv4(),
      ...data,
      tags: [],
      pinned: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      linkedExpenseIds: [],
      isDeleted: 0,
    };
    await db.notes.add(newNote);
    navigate('/notes');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">New Note</h1>
        <button 
          onClick={handleSubmit(onSubmit)}
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-opacity-90 active:scale-95 transition-all flex items-center gap-2"
        >
          <Save size={20} />
          Save
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <input
            {...register('title')}
            type="text"
            placeholder="Note Title"
            className="w-full text-2xl font-bold bg-transparent border-none focus:ring-0 placeholder-gray-400 dark:text-white"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <textarea
          {...register('description')}
          placeholder="Start writing..."
          className="w-full h-[60vh] bg-transparent border-none focus:ring-0 resize-none placeholder-gray-400 dark:text-gray-300"
        />
      </div>
    </div>
  );
};

export default AddNotePage;
