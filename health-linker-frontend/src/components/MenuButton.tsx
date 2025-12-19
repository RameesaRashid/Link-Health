import React from 'react';

interface MenuButtonProps {
    toggleSidebar: () => void;
    isOpen: boolean; 
}

const MenuButton: React.FC<MenuButtonProps> = ({ toggleSidebar, isOpen }) => {
    return (
        <button
            onClick={toggleSidebar}
            
            className={`
                fixed top-6 left-4 z-50 p-2 text-white bg-indigo-800 rounded-lg shadow-md
                transition duration-300 ease-in-out hover:shadow-xl hover:bg-indigo-700 cursor-pointer
                
                // hide sidebar
                ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'} 
            `}
            aria-label="Toggle Sidebar"
        >
            
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
        </button>
    );
};

export default MenuButton;