import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Navigation/Sidebar';
import TopHeader from '../Navigation/TopHeader';
import ToastContainer from './ToastContainer';

const PortalLayout = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      {/* Toast popup notifications */}
      <ToastContainer />

      {/* Dynamic role-based sidebar */}
      <Sidebar />

      {/* Main workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top header with simulation switcher */}
        <TopHeader />

        {/* Dynamic page content */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PortalLayout;
