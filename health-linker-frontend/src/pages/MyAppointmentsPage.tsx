import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import apiClient from "../api/apiClient";
import { type IAppointment } from "../types/interfaces";
import AppointmentCard from "../components/AppointmentCard";

const MyAppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState<"active" | "history">("active");

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/appointments/patient");

      const allData = response.data.appointments || response.data;
      setAppointments(allData);
    } catch {
      console.error("Fetch failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await apiClient.delete(`/appointments/${id}`);

      fetchAppointments();
    } catch {
      alert("Error cancelling appointment.");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter((appt) =>
    view === "active"
      ? appt.status !== "Cancelled"
      : appt.status === "Cancelled"
  );

  if (loading)
    return (
      <div className="p-20 text-center animate-pulse font-black text-blue-900">
        Loading Journey...
      </div>
    );

  const totalSpent = appointments
    .filter((appt) => appt.status !== "Cancelled")
    .reduce((sum, appt) => sum + (appt.doctorId.fees || 0), 0);

  return (
    <div className="container mx-auto p-6 md:p-10 bg-slate-50 min-h-screen max-w-5xl rounded-3xl shadow-2xl mt-4">
      <div className="mb-6 pb-6 border-b border-blue-100">
        <h1 className="text-3xl font-black text-blue-900 uppercase tracking-tight">
          My Journey
        </h1>
      </div>

      <div className="flex gap-6 mb-8 ml-2">
        <button
          onClick={() => setView("active")}
          className={`pb-2 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${
            view === "active"
              ? "text-blue-600 border-blue-600"
              : "text-gray-400 border-transparent hover:text-gray-600"
          }`}
        >
          Active Bookings
        </button>
        <button
          onClick={() => setView("history")}
          className={`pb-2 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${
            view === "history"
              ? "text-blue-600 border-blue-600"
              : "text-gray-400 border-transparent hover:text-gray-600"
          }`}
        >
          Cancelled History
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="wait">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appt, index) => (
              <AppointmentCard
                key={appt._id}
                appt={appt}
                index={index}
                onCancel={handleCancel}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-blue-100"
            >
              <p className="text-gray-400 font-black uppercase text-[10px] tracking-widest">
                {view === "active"
                  ? "No Active Bookings Found"
                  : "No Cancellation History"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      
      {view === "active" && appointments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 p-6 bg-gray-50 rounded-xs border border-blue-100 shadow-sm flex flex-col md:flex-row justify-between items-center"
        >
          <div>
            <h3 className="text-gray-400 font-black uppercase text-[10px] tracking-widest">
              Healthcare Investment
            </h3>
            <p className="text-blue-900 font-black text-xl tracking-tighter">
              Total Spent: <span className="text-blue-600 text-lg">${totalSpent}</span>
            </p>
          </div>

          <div className="mt-4 md:mt-0 px-6 py-2 bg-blue-50 text-blue-700 text-[10px] font-black uppercase rounded-full border border-blue-100">
            {appointments.filter((a) => a.status !== "Cancelled").length} Total
            Consultations
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MyAppointmentsPage;
