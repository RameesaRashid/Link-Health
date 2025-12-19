import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import { type IDoctor } from "../types/interfaces";
import DoctorCard from "../components/DoctorCard";
import { motion, AnimatePresence } from "framer-motion";

interface DoctorListPageProps {
  onDoctorSelect: (doctor: IDoctor) => void;
}

const SPECIALTIES = [
  "Cardiology", "Dermatology", "Neurology", "Pediatrics", 
  "Orthopedics", "Psychiatry", "General Medicine", "Oncology"
];

const DoctorListPage: React.FC<DoctorListPageProps> = ({ onDoctorSelect }) => {
  const [doctors, setDoctors] = useState<IDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [jumpValue, setJumpValue] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        // include specialty in api request
        const response = await apiClient.get(
          `/doctors?name=${searchQuery}&specialty=${selectedSpecialty}&page=${currentPage}&limit=10`
        );
        setDoctors(response.data.doctors);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchDoctors();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedSpecialty, currentPage]); 

  // Reset to page 1 (on filter changing)
  const handleFilterChange = (type: 'name' | 'specialty', value: string) => {
    if (type === 'name') setSearchQuery(value);
    if (type === 'specialty') setSelectedSpecialty(value);
    setCurrentPage(1);
  };

  const handleJump = (e?: React.FormEvent) => {
    e?.preventDefault();
    const pageNum = parseInt(jumpValue);
    if (pageNum > 0 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      setJumpValue("");
    }
  };

  const handleSelect = (doctor: IDoctor) => {
    onDoctorSelect(doctor);
    navigate("/slots");
  };

  return (
    <div className="container mx-auto max-w-6xl bg-slate-100 min-h-screen rounded-xl shadow-lg p-10">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-blue-800 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Available Specialists</h1>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => handleFilterChange('name', e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white shadow-sm"
            />
          </div>

          {/* dropdown */}
          <select
            value={selectedSpecialty}
            onChange={(e) => handleFilterChange('specialty', e.target.value)}
            className="px-4 py-2 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white shadow-sm font-medium text-gray-600 cursor-pointer"
          >
            <option value="">All Specialties</option>
            {SPECIALTIES.map((spec) => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 text-blue-600 font-semibold animate-pulse">
          Filtering specialists...
        </div>
      ) : (
        <>
          {doctors.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl">
              <p className="text-gray-400 italic">No doctors found matching these filters.</p>
              <button 
                onClick={() => {setSearchQuery(""); setSelectedSpecialty("");}}
                className="mt-2 text-blue-600 text-xs font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <AnimatePresence mode="wait">
                {doctors.map((doctor, index) => (
                  <motion.div
                    key={doctor._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <DoctorCard doctor={doctor} onSelect={handleSelect} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* pagination */}
          <div className="flex flex-col items-center mt-12 gap-6 p-6">
            
            <div className="flex items-center gap-3">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="px-4 py-2 bg-blue-900 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-800 transition-colors text-[9px] font-bold"
              >
                Previous
              </button>

              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest text-center min-w-[100px]">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-4 py-2 bg-blue-900 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-800 transition-colors text-[9px] font-bold"
              >
                Next
              </button>
            </div>

            <form onSubmit={handleJump} className="flex items-center gap-3 border-t border-blue-700 pt-6 w-full justify-center">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Jump to:</label>
              <input
                type="number"
                placeholder="Ex: 10"
                value={jumpValue}
                onChange={(e) => setJumpValue(e.target.value)}
                className="w-14 p-2 text-[9px] border rounded-md focus:ring-1 focus:ring-blue-400 outline-none text-center"
              />
              <button
                type="submit"
                className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md text-[10px] font-black hover:bg-blue-200 transition-colors"
              >
                GO
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default DoctorListPage;