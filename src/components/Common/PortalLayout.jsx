import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Navigation/Sidebar';
import TopHeader from '../Navigation/TopHeader';
import ToastContainer from './ToastContainer';

const PortalLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#f8f9ff] overflow-hidden font-sans text-[#0d1c2e]">
      {/* Left Sidebar (Desktop Fixed + Mobile Slide-over Drawer) */}
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <TopHeader onToggleMenu={() => setIsMobileMenuOpen((prev) => !prev)} />
        
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-5 lg:p-8">
          <div className="max-w-[1600px] mx-auto space-y-4 sm:space-y-6">
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
