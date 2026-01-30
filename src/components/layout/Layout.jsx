import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header can be added here if needed for desktop */}
      <main className="flex-grow pb-20 pt-4 px-4 max-w-2xl mx-auto w-full">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default Layout;
