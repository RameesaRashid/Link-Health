import React, { useState } from "react";
import "./App.css";
import { motion, AnimatePresence } from "framer-motion";
import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import SlotSearchPage from "./pages/SlotSearchPage";
import DoctorListPage from "./pages/DoctorListPage";
import MyAppointmentsPage from "./pages/MyAppointmentsPage";
import DoctorDashboard from "./pages/DoctorDashboard"; 
import Sidebar from "./components/SideBar";
import Header from "./components/Header";

import { useAuth } from "./context/AuthContext";
import type { IDoctor } from "./types/interfaces";

const App: React.FC = () => {
  
  const { user, logout, loading } = useAuth();
  
  const [showLogin, setShowLogin] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<IDoctor | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const handleToggleView = () => setShowLogin((prev) => !prev);

  
  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-blue-900 uppercase">Loading Journey...</div>;

  
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        {showLogin ? (
          <LoginPage onLoginSuccess={() => {}} /> 
        ) : (
          <RegistrationPage onSuccessfulRegister={handleToggleView} />
        )}
        <button onClick={handleToggleView} className="mt-4 text-sm font-bold text-blue-600 cursor-pointer hover:underline">
          {showLogin ? "Need an account? Sign Up" : "Already have an account? Log In"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {isSidebarOpen && (
        <div onClick={toggleSidebar} className="fixed inset-0 bg-black opacity-50 z-10 lg:hidden" />
      )}

      <main className={`flex-1 transition-all duration-300 relative ${isSidebarOpen ? "ml-64 w-[calc(100%-16rem)]" : "ml-20 w-[calc(100%-5rem)]"}`}>
        <AnimatePresence>
          {!isSidebarOpen && <Header />}
        </AnimatePresence>

        <motion.div
          key={window.location.pathname}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="p-8 md:p-8"
        >
          <Routes>
            
            <Route path="/" element={
                user.role === 'doctor' ? <Navigate to="/doctor-dashboard" /> : <Navigate to="/doctors" />
            } />

            <Route path="/doctor-dashboard" element={
                user.role === 'doctor' ? <DoctorDashboard /> : <Navigate to="/doctors" />
            } />


            <Route path="/doctors" element={
                user.role === 'patient' ? <DoctorListPage onDoctorSelect={setSelectedDoctor} /> : <Navigate to="/doctor-dashboard" />
            } />
            <Route path="/appointments" element={
                user.role === 'patient' ? <MyAppointmentsPage /> : <Navigate to="/doctor-dashboard" />
            } />

            <Route path="/slots" element={
                selectedDoctor ? (
                  <SlotSearchPage doctor={selectedDoctor} onBack={() => window.history.back()} />
                ) : <Navigate to="/doctors" />
            } />

            <Route path="/settings" element={<div className="font-black text-blue-900 uppercase p-10">Account Settings</div>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </motion.div>
      </main>
    </div>
  );
};

export default App;