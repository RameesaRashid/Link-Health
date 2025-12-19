import React from 'react';
import { type IAvailableSlot, type IDoctor } from '../types/interfaces'; 

interface BookingConfirmationModalProps {
    slot: IAvailableSlot;
    doctor: IDoctor;
    onConfirm: (slotId: string) => void;
    onCancel: () => void;
}

const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({ 
    slot, 
    doctor,
    onConfirm, 
    onCancel 
}) => {
    
    const startTime = new Date(slot.startTime);
    
    const handleConfirm = () => {
        onConfirm(slot._id);
    };

    return (
        // Full-screen backdrop (z-50)
        <div className="fixed inset-0 bg-[#000000A1] z-50 flex justify-center items-center">
            
            {/* Modal Content Card */}
            <div className="bg-white p-7 rounded-xl shadow-2xl w-full max-w-md">
                
                <h2 className="text-lg font-bold text-red-600 mb-1">Confirm Your Appointment</h2>
                <p className="text-gray-700 mb-6">
                    Are you sure you want to book this appointment with <span className='font-bold'>{doctor.name}</span> ?
                </p>

                <div className="space-y-2 p-4 bg-gray-100 rounded-sm border border-gray-300 mb-6">
                    <div className="flex justify-between text-gray-700">
                        <span className="font-semibold">Doctor:</span>
                        <span className='font-light'>{doctor.name} ({doctor.specialty})</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                        <span className="font-semibold">Date:</span>
                        <span className='font-light'>{startTime.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                        <span className="font-semibold">Time:</span>
                        <span className='font-light'>{startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                        <span className="font-semibold">Fee:</span>
                        <span className="text-green-600 font-semibold">${doctor.fees}</span>
                    </div>
                </div>

                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onCancel}
                        className="cursor-pointer px-4 py-2 bg-gray-300 text-gray-800 text-xs font-semibold rounded-lg hover:bg-gray-400 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="cursor-pointer px-4 py-2 bg-indigo-800 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition"
                    >
                        Confirm Booking
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingConfirmationModal;