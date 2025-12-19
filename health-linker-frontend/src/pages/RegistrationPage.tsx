import React, { useState } from "react";
import apiClient from "../api/apiClient";
import { isAxiosError } from "axios";

interface RegistrationPageProps {
    onSuccessfulRegister: () => void;
}

const RegistrationPage: React.FC<RegistrationPageProps> = ({ onSuccessfulRegister }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('patient');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await apiClient.post("/users/register", { name, email, password, role }); 
            
            setMessage(`Success! Registered as ${role}. Please log in.`);

            setTimeout(() => {
                onSuccessfulRegister();
            }, 2000);

        } catch (error) {
            let errorMessage = 'Registration failed. Please check your network connection.';
            
            if (isAxiosError(error)) {
                errorMessage = error.response?.data?.message || 'Registration failed. Server is unreachable.';
            }

            setMessage(`Error: ${errorMessage}`);
            console.error("Registration Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-130 min-w-screen">
            <form onSubmit={handleSubmit} className="p-8 bg-white shadow-xl rounded-sm w-full max-w-sm border border-indigo-100">
                <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-800">Sign Up</h2>
                
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-1">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="shadow-sm border border-gray-300 rounded-xs w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="shadow-sm border border-gray-300 rounded-xs w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
                        required
                    />
                </div>
                
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="shadow-sm border border-gray-300 rounded-xs w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
                        required
                    />
                </div>
                
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-1">Register as:</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="shadow-sm border border-gray-300 rounded-xs w-full py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
                        required
                    >
                        <option value="patient">Patient</option>
                        <option value="doctor">Doctor</option>
                    </select>
                </div>
                
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className={`w-full bg-indigo-800 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-200 cursor-pointer ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </div>
                
                {message && (
                    <p className={`mt-4 text-center text-sm font-medium ${message.includes('Success') ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
};

export default RegistrationPage;