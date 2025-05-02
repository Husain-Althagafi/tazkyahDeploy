import { Outlet } from 'react-router-dom';
import AdminSideBar from './AdminSideBar';

// Layout component that combines SideBar with user content pages
export default function AdminLayout() {
  return (
    <div className="user-dashboard-container">
      <AdminSideBar />
      <main className="user-dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}