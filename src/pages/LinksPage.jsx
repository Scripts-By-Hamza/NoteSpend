import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Plus, Search, Link as LinkIcon, Trash2, ExternalLink, X, ChevronRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

const LinksPage = () => {
  const { links, db } = useAppContext();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newName, setNewName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLinks = links.filter(link => 
    link.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (link.name && link.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddLink = async (e) => {
    e.preventDefault();
    if (!newUrl) return;

    // Basic URL validation/prefixing
    let formattedUrl = newUrl.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const newLink = {
      id: uuidv4(),
      name: newName.trim(),
      url: formattedUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: 0
    };

    try {
      await db.links.add(newLink);
      setNewUrl('');
      setNewName('');
      setShowAddModal(false);
    } catch (error) {
      console.error("Failed to add link:", error);
    }
  };

  const handleDeleteLink = async (id) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      try {
        await db.links.update(id, { isDeleted: 1, updatedAt: new Date().toISOString() });
      } catch (error) {
        console.error("Failed to delete link:", error);
      }
    }
  };

  const LinkCard = ({ link }) => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center space-x-4 group animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-primary/5 p-2 rounded-xl">
        <QRCodeSVG 
          value={link.url} 
          size={64}
          level="M"
          includeMargin={false}
          className="rounded-lg"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
          {link.name || link.url.replace(/^https?:\/\//, '')}
        </h3>
        {link.name && (
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
            {link.url.replace(/^https?:\/\//, '')}
          </p>
        )}
        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
          Added {dayjs(link.createdAt).format('MMM D, YYYY')}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <a 
          href={link.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
          title="Open Link"
        >
          <ExternalLink size={18} />
        </a>
        <button 
          onClick={() => handleDeleteLink(link.id)}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
          title="Delete Link"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Saved Links</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and access your QR codes</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="hidden sm:flex items-center justify-center w-11 h-11 bg-primary text-white rounded-full shadow-lg shadow-primary/20 hover:scale-[1.1] active:scale-[0.9] transition-all"
          title="Add New Link"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
        <input
          type="text"
          placeholder="Search your links..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm transition-all"
        />
      </div>

      {/* Links List */}
      {filteredLinks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-5 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
          <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-3xl flex items-center justify-center text-gray-300 dark:text-gray-600 shadow-xl rotate-3">
            <LinkIcon size={48} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">No links found</h3>
            <p className="text-gray-500 max-w-xs mx-auto">Start saving your important URLs and generating QR codes instantly.</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 text-primary font-bold hover:underline"
          >
            <Plus size={20} />
            <span>Create your first link</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredLinks.map(link => (
            <LinkCard key={link.id} link={link} />
          ))}
        </div>
      )}

      {/* Mobile Add Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all sm:hidden z-40"
      >
        <Plus size={32} />
      </button>

      {/* Add Link Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowAddModal(false)}
          />
          <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 animate-in slide-in-from-bottom sm:zoom-in duration-300">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Add New Link</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddLink} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-1">Link Name</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                    <span className="text-xs font-bold font-mono">Aa</span>
                  </div>
                  <input
                    autoFocus
                    type="text"
                    placeholder="e.g., My Portfolio"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-1">URL Address</label>
                <div className="relative group">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                  <input
                    type="text"
                    placeholder="https://example.com"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  />
                </div>
              </div>

              {newUrl && (
                <div className="bg-primary/5 p-4 rounded-2xl flex items-center space-x-4 border border-primary/10">
                  <div className="bg-white p-2 rounded-xl shadow-sm">
                    <QRCodeSVG value={newUrl} size={60} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary">Previewing QR Code</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{newUrl}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={!newUrl}
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center space-x-2"
              >
                <span>Save Link & Generate QR</span>
                <ChevronRight size={20} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinksPage;
