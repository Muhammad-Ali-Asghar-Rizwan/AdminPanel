"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import Swal from 'sweetalert2';

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === "programingmaster22@gmail.com" && password === "ahmedraja122") {
      localStorage.setItem("isLoggedIn", "true");
      router.push("/admin/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };



  
  const handleProceed = () => {
    Swal.fire({
      title: 'Login Successful',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'OK',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        router.push('/admin/dashboard');
      }
    });
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-600 to-purple-400 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-700">
          Admin Login
        </h2>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="relative mb-4">
            <FiMail className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              placeholder="Your Email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
              value={email}
            />
          </div>
          <div className="relative mb-4">
            <FiLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              placeholder="Create Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
              value={password}
            />
          </div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-500">Password Strength</p>
            <div className="flex space-x-1">
              <span className="w-4 h-1 bg-gray-300 rounded"></span>
              <span className="w-4 h-1 bg-yellow-400 rounded"></span>
              <span className="w-4 h-1 bg-green-500 rounded"></span>
            </div>
          </div>
          <button
            type="submit"
            onClick={handleProceed}
            className="bg-purple-600 text-white font-semibold px-4 py-2 rounded-lg w-full hover:bg-purple-700 transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
