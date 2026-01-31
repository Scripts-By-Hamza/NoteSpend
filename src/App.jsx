import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import NotesPage from './pages/NotesPage';
import ExpensesPage from './pages/ExpensesPage';
import SettingsPage from './pages/SettingsPage';
import AddNotePage from './pages/AddNotePage';
import AddExpensePage from './pages/AddExpensePage';
import NoteDetailPage from './pages/NoteDetailPage';
import LinksPage from './pages/LinksPage';
import PasswordsPage from './pages/PasswordsPage';
import ProfilePage from './pages/ProfilePage';
import RegistrationPage from './pages/RegistrationPage';
import { useAppContext } from './context/AppContext';

function App() {
  const { userAuth } = useAppContext();

  if (!userAuth) {
    return (
      <Router>
        <Routes>
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="*" element={<Navigate to="/register" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="notes/:id" element={<NoteDetailPage />} />
          <Route path="expenses" element={<ExpensesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="links" element={<LinksPage />} />
          <Route path="passwords" element={<PasswordsPage />} />
          <Route path="add-note" element={<AddNotePage />} />
          <Route path="add-expense" element={<AddExpensePage />} />
          <Route path="expenses/edit/:id" element={<AddExpensePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
