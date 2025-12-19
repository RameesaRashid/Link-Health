import React, { useState } from 'react';
import MenuButton from './MenuButton';



function Layout() {
    
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative min-h-screen">
        
      <MenuButton toggleSidebar={toggleSidebar} />
      
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      {/* 5. Main Content Area */}
      <div className={`p-4 transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-0'}`}>
        <h1 className="text-2xl font-bold">Main Content Area</h1>
        <p>Click the menu button to toggle the sidebar.</p>
      </div>

    </div>
  );
}

export default Layout;