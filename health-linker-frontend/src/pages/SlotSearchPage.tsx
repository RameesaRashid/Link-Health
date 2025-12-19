import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, addDays, isSameDay } from "date-fns";
import apiClient from "../api/apiClient";
import {
  type IAppointment,
  type IAvailableSlot,
  type IDoctor,
} from "../types/interfaces";
import SlotCard from "../components/SlotCard";
import BookingSuccessModal from "../components/BookingSuccessModal";
import BookingConfirmationModal from "../components/BookingConfirmationModal";
import { isAxiosError } from "axios";

interface SlotSearchPageProps {
  doctor: IDoctor;
  onBack: () => void;
}

const SlotSearchPage: React.FC<SlotSearchPageProps> = ({ doctor, onBack }) => {
  const [slots, setSlots] = useState<IAvailableSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookedAppointment, setBookedAppointment] =
    useState<IAppointment | null>(null);
  const [slotToConfirm, setSlotToConfirm] = useState<IAvailableSlot | null>(
    null
  );

  const nextFortnight = [...Array(14)].map((_, i) => addDays(new Date(), i));

  const fetchSlots = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        date: format(selectedDate, "yyyy-MM-dd"),
        doctorId: doctor._id,
      };
      const response = await apiClient.get("/appointments/available-slots", {
        params,
      });
      setSlots(response.data);
      if (response.data.length === 0) {
        setError(`No available slots found for this date.`);
      }
    } catch (_err) {
      setError("Failed to fetch slots.");
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [selectedDate]);

  const handleBookSlot = async (slotId: string) => {
    setSlotToConfirm(null);
    setLoading(true);
    try {
      const response = await apiClient.post("/appointments/book", { slotId });
      setBookedAppointment(response.data.appointment);
      setShowSuccessModal(true);
      await fetchSlots();
    } catch (err) {
      alert(isAxiosError(err) ? err.response?.data?.message : "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-10 bg-slate-50 min-h-screen max-w-6xl rounded-3xl shadow-2xl mt-4">
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-blue-50 mb-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Profile */}
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center shadow-inner">
              <span className="text-4xl font-black text-blue-300">
                {doctor.name.charAt(0)}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-4 border-white shadow-sm"></div>
          </div>

          {/* Bio */}
          <div className="flex-1 w-full">
            <div className="mb-4">
              <button
                onClick={onBack}
                className="group cursor-pointer text-[10px] font-bold text-blue-600 hover:underline mb-2 block tracking-widest transition-colors"
              >
                <span className="transition-transform group-hover:-translate-x-1">
                  &larr;{" "}
                </span>
                Back to search
              </button>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-blue-900 uppercase tracking-tight">
                  Dr. {doctor.name}
                </h1>
                
                <span className="bg-blue-100 text-blue-700 text-[9px] px-2 py-1 rounded-full font-black uppercase tracking-tighter">
                  Verified
                </span>
              </div>
              <p className="text-blue-600 font-bold text-sm tracking-widest">
                {doctor.specialty}
              </p>
            </div>

            <p className="text-gray-500 text-sm leading-relaxed max-w-2xl mb-6">
              Dr. {doctor.name} is a highly regarded specialist in{" "}
              {doctor.specialty} with over 10 years of experience. Known for a
              patient-centered approach, they focus on providing advanced
              healthcare management and personalized treatment plans.
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-300 ">
                <p className="text-[10px] font-bold text-gray-400 uppercase">
                  Consultation
                </p>
                <p className="text-xs font-black text-blue-900">
                  ${doctor.fees}
                </p>
              </div>
              <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-300">
                <p className="text-[10px] font-bold text-gray-400 uppercase">
                  Duration
                </p>
                <p className="text-xs font-black text-blue-900">
                  {doctor.slotDuration} Min
                </p>
              </div>
              <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-300">
                <p className="text-[10px] font-bold text-gray-400 uppercase">
                  Experience
                </p>
                <p className="text-xs font-black text-blue-900">10+ Years</p>
              </div>
            </div>

            
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="mb-10">
        <h3 className="text-gray-500 text-xs font-black uppercase tracking-widest mb-4 ml-1">
          Select Appointment Date
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
          {nextFortnight.map((date) => {
            const isSelected = isSameDay(date, selectedDate);
            return (
              <motion.button
                key={date.toString()}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDate(date)}
                className={`flex-shrink-0 w-16 h-20 flex flex-col items-center justify-center transition-all shadow-sm cursor-pointer ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-blue-200 shadow-lg scale-105"
                    : "bg-white text-gray-400 hover:bg-blue-50"
                }`}
              >
                <span className="text-[10px] font-bold uppercase mb-1">
                  {format(date, "EEE")}
                </span>
                <span className="text-xl font-black">{format(date, "d")}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* slots */}
      <div className="bg-white rounded-3xl p-8 shadow-inner min-h-[300px]">
        <h2 className="text-sm font-black text-gray-800 uppercase tracking-tighter mb-8">
          Available Slots
          <span className="text-blue-600 ml-2">({slots.length})</span>
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center text-xs py-10 bg-blue-50/50 rounded-2xl border-2 border-dashed border-blue-100">
            <p className="text-blue-400 font-medium italic">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {slots.map((slot, index) => (
                <motion.div
                  key={slot._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <SlotCard slot={slot} onBook={() => setSlotToConfirm(slot)} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modals */}
      {showSuccessModal && bookedAppointment && (
        <BookingSuccessModal
          appointment={bookedAppointment}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
      {slotToConfirm && (
        <BookingConfirmationModal
          slot={slotToConfirm}
          doctor={doctor}
          onConfirm={handleBookSlot}
          onCancel={() => setSlotToConfirm(null)}
        />
      )}
    </div>
  );
};

export default SlotSearchPage;
