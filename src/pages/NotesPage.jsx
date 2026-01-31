import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Pin, FileText, MoreVertical } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import dayjs from 'dayjs';

const NotesPage = () => {
  const navigate = useNavigate();
  const { notes } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (note.description && note.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const pinnedNotes = filteredNotes.filter(n => n.pinned);
  const otherNotes = filteredNotes.filter(n => !n.pinned);

  const NoteCard = ({ note }) => (
    <div 
      onClick={() => navigate(`/notes/${note.id}`)}
      className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 active:scale-[0.98] transition-all cursor-pointer relative"
    >
      {note.pinned === 1 && <Pin size={14} className="absolute top-2 right-2 text-primary" fill="currentColor" />}
      <h3 className="font-semibold text-lg line-clamp-1 pr-4">{note.title}</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 line-clamp-2">
        {note.description || 'No description'}
      </p>
      <div className="flex items-center justify-between mt-4">
        <span className="text-xs text-gray-400">
          {dayjs(note.createdAt).format('MMM D, YYYY')}
        </span>
        {note.linkedExpenseIds?.length > 0 && (
          <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-medium">
            {note.linkedExpenseIds.length} Expenses
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Notes</h1>
        <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <MoreVertical size={24} />
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
        />
      </div>

      {filteredNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400">
            <FileText size={40} />
          </div>
          <div>
            <h3 className="text-lg font-medium">No notes found</h3>
            <p className="text-gray-500">Create your first note to get started</p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {pinnedNotes.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">Pinned</h2>
              <div className="grid gap-4">
                {pinnedNotes.map(note => <NoteCard key={note.id} note={note} />)}
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            {pinnedNotes.length > 0 && <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">Others</h2>}
            <div className="grid gap-4">
              {otherNotes.map(note => <NoteCard key={note.id} note={note} />)}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => navigate('/add-note')}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all sm:hidden z-40"
      >
        <Plus size={32} />
      </button>
    </div>
  );
};

export default NotesPage;
