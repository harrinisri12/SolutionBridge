import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Navigation/Sidebar';
import TopHeader from '../Navigation/TopHeader';
import ToastContainer from './ToastContainer';

const PortalLayout = () => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <TopHeader />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Toast Feedback */}
      <ToastContainer />
    </div>
  );
};

export default PortalLayout;
