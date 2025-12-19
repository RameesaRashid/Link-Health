import React from "react";
import { type IDoctor } from "../types/interfaces";

interface DoctorCardProps {
  doctor: IDoctor;
  onSelect: (doctor: IDoctor) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onSelect }) => {
  return (
    <div className="bg-white rounded-sm shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col group">
      
      <div className="h-32 bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
        <span className="text-blue-500 text-4xl font-bold group-hover:scale-110 transition-transform">
          {doctor.name.charAt(0)}
        </span>
      </div>

      <div className="p-6 flex-grow">
        <h2 className="text-xl font-bold text-indigo-900 mb-1">{doctor.name}</h2>
        <p className="text-blue-600 text-xs font-medium mb-4">{doctor.specialty}</p>

        <div className="flex justify-between items-center text-sm text-gray-600 mb-6">
          <span>
            Experience: <span className="font-semibold">5+ Years</span>
          </span>
          <span>
            Fee: <span className="font-bold text-green-600">${doctor.fees}</span>
          </span>
        </div>

        <button
          onClick={() => onSelect(doctor)}
          className="cursor-pointer w-full py-3 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;