import { Outlet } from 'react-router-dom';
import SideBar from './SideBar';

// Layout component that combines SideBar with user content pages
export default function UserLayout() {
  return (
    <div className="user-dashboard-container">
      <SideBar />
      <main className="user-dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}