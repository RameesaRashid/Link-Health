import React, { useEffect } from 'react';
import { type IAppointment } from '../types/interfaces'; // Ensure this type is correct

interface BookingSuccessModalProps {
    appointment: IAppointment;
    onClose: () => void;
}

const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({ appointment, onClose }) => {
    
    
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 60000); 

        
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        
        <div className="fixed inset-0 bg-[#000000A1] z-50 flex justify-center items-center">
            
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform scale-100 transition-transform duration-300">
                
                <div className="flex flex-col items-center">
                    
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Appointment Confirmed!</h2>
                    <p className="text-xs text-gray-600 mb-6">Your booking request was successful.</p>
                </div>

                <div className="space-y-3 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex justify-between text-gray-700">
                        <span className="font-semibold">Doctor:</span>
                        
                        <span className='font-extralight'>{appointment.doctorId.name}</span> 
                    </div>
                    <div className="flex justify-between text-gray-700">
                        <span className="font-semibold">Specialty:</span>
                        <span className='font-extralight'>{appointment.doctorId.specialty}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                        <span className="font-semibold">Time:</span>
                        <span className='font-extralight'>{new Date(appointment.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                        <span className="font-semibold">Date:</span>
                        <span className='font-extralight'>{new Date(appointment.startTime).toLocaleDateString()}</span>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="mt-6 w-full py-2 bg-indigo-800 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default BookingSuccessModal;