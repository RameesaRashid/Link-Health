import React from "react";
import { type IAvailableSlot } from "../types/interfaces";

interface SlotCardProps {
  slot: IAvailableSlot;

  onBook: (slotId: string) => void; 
  
}

const formatTime = (isoString: string): string => {
  return new Date(isoString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDateAndDay = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const SlotCard: React.FC<SlotCardProps> = ({ slot, onBook }) => {
  if (!slot.doctorId) {
    return null; 
    
  }

  return (
    
    <div className="mt-3 bg-gray-50 border border-green-200 p-5 rounded-sm shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105">
      {" "}
      <p className="text-base font-semibold text-gray-500 mb-3 border-b pb-2">
         {formatDateAndDay(slot.startTime)}{" "}
      </p>
      {" "}
      <div className="flex justify-between items-start mb-3">
        {" "}
        <h3 className="text-xl font-bold text-blue-900">
          {slot.doctorId.name}
        </h3>
        {" "}
        <span className="text-sm font-medium text-gray-600 bg-indigo-100 px-3 py-1 rounded-full">
           {slot.doctorId.specialty}{" "}
        </span>
        {" "}
      </div>
      
      {" "}
      <div className="mb-4">
        
        {" "}
        <p className="text-3xl font-extrabold text-gray-800">
          {formatTime(slot.startTime)}{" "}
        </p>
        <p className="text-sm text-gray-500">to {formatTime(slot.endTime)}</p>
      </div>
      <div className="border-t pt-3 flex justify-between items-center">
        <p className="text-lg font-semibold text-green-600">
          ${slot.doctorId.fees}
        </p>
        <button
          onClick={() => onBook(slot._id)}
          className="bg-green-800 hover:bg-green-600 cursor-pointer text-xs text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-200"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default SlotCard;
