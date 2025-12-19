import React from 'react';
import { motion } from 'framer-motion';
import { type IAppointment } from '../types/interfaces';

interface AppointmentCardProps {
  appt: IAppointment;
  index: number;
  onCancel: (id: string) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appt, index, onCancel }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
      className="group bg-white p-6 rounded-2xl shadow-sm border border-transparent hover:border-red-100 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
    >
      {/* Doctor Identity */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-black text-xl">
          {appt.doctorId.name.charAt(0)}
        </div>
        <div>
          <h2 className="text-lg font-black text-gray-800 uppercase tracking-tighter">
            Dr. {appt.doctorId.name}
          </h2>
          <p className="text-xs font-bold text-blue-500 tracking-widest uppercase">
            {appt.doctorId.specialty}
          </p>
        </div>
      </div>

      {/* Schedule Info */}
      <div className="flex flex-col md:items-center">
        <p className="text-sm font-black text-gray-700">
          {new Date(appt.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          {new Date(appt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {/* Action Area */}
      <div className="flex items-center justify-between md:justify-end gap-6">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Status</p>
          <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">
            {appt.status}
          </span>
        </div>
        
        <button 
          onClick={() => onCancel(appt._id)}
          className="px-5 py-2 bg-white border-2 border-red-50 text-red-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
};

export default AppointmentCard;