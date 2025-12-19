import React, { useState, useEffect } from "react";
import apiClient from "../api/apiClient";
import { motion } from "framer-motion";
import { format } from "date-fns";

const DoctorDashboard: React.FC = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const response = await apiClient.get("/appointments/doctor");
        setAppointments(response.data);
      } catch  {
        console.error("Dashboard load failed");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorData();
  }, []);

  return (
    <div className="container mx-auto p-6 md:p-10 bg-slate-50 min-h-screen max-w-6xl rounded-3xl shadow-2xl mt-4">
      <header className="mb-10 flex justify-between items-center border-b border-blue-100 pb-6">
        <div>
          <h1 className="text-3xl font-black text-blue-900 uppercase tracking-tight">
            Physician Portal
          </h1>
          <p className="text-blue-600 font-bold text-xs tracking-widest uppercase">
            My Daily Agenda
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-black text-gray-800">
            {format(new Date(), "EEEE, MMMM do")}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {appointments.length > 0 ? (
          appointments.map((appt: any, index: number) => (
            <motion.div
              key={appt._id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white p-5 rounded-2xl border border-blue-50 shadow-sm flex items-center justify-between hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-6">
                <div className="text-center bg-blue-50 p-3 rounded-xl min-w-[100px]">
                  <p className="text-xs font-black text-blue-600 uppercase">
                    Time
                  </p>
                  <p className="text-lg font-black text-blue-900">
                    {format(new Date(appt.startTime), "HH:mm")}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Patient Name
                  </p>
                  <h3 className="text-lg font-black text-gray-800 uppercase tracking-tighter">
                    {appt.patientId.name}
                  </h3>
                  <p className="text-xs text-blue-500 font-medium">
                    {appt.patientId.email}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="px-4 py-2 bg-slate-100 text-slate-600 text-[10px] font-black uppercase rounded-lg hover:bg-slate-200 transition-colors">
                  View History
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase rounded-lg hover:bg-blue-700 shadow-md transition-all">
                  Start Consult
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-blue-100">
            <p className="text-gray-400 font-black uppercase text-xs tracking-widest">
              No consultations scheduled for today.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
