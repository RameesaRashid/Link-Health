// src/pages/LoginPage.tsx
import React, { useState } from "react";
import apiCLient from "../api/apiClient";
import { isAxiosError } from "axios";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await apiCLient.post("/users/login", { email, password });
      const { token, role, name, userId } = response.data;
      login({ userId, name, role, email }, token); 
      onLoginSuccess();
    } catch (err) {
      if (isAxiosError(err)) {
        setMessage(err.response?.data?.message || "Login failed.");
      } else {
        setMessage("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    
    if (!credentialResponse.credential) {
      setMessage("Google did not provide login credentials.");
      return;
    }

    try {
      setLoading(true);
      const res = await apiCLient.post("/users/google-login", {
        token: credentialResponse.credential,
      });

      const { user, token } = res.data;
      
      
      login(user, token); 
      onLoginSuccess();
      console.log("Google Social Login Successful!");
    } catch (err) {
      console.error("Backend Google Auth Error:", err);
      
      if (isAxiosError(err) && !err.response) {
        setMessage("Server is unreachable. Check if backend is running.");
      } else {
        setMessage("Failed to authenticate with Google.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-full bg-slate-50">
      <form onSubmit={handleSubmit} className="p-8 bg-white shadow-xl rounded-2xl w-full max-w-sm border border-indigo-100">
        <h2 className="text-xl font-black mb-8 text-center text-blue-900 uppercase tracking-tighter">Link Health</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-xs font-bold uppercase mb-1">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border border-gray-200 rounded-xl w-full py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="name@example.com" required />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-xs font-bold uppercase mb-1">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border border-gray-200 rounded-xl w-full py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" required />
        </div>

        <button type="submit" className="w-full bg-blue-700 hover:bg-blue-600 text-white font-black py-3 rounded-xl shadow-lg uppercase tracking-widest text-xs mb-6 cursor-pointer transition-colors disabled:opacity-50" disabled={loading}>
          {loading ? "Authenticating..." : "Log In"}
        </button>

        <div className="flex flex-col items-center border-t border-gray-100 pt-6">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Or sign in with</p>
          <GoogleLogin 
            onSuccess={handleGoogleSuccess} 
            onError={() => setMessage("Google Login Failed")}
            theme="outline"
            shape="pill"
          />
        </div>

        {message && (
          <p className={`mt-4 text-center text-xs font-bold uppercase ${message.includes("Successful") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPage;