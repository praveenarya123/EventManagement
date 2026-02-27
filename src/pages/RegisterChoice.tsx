import React from "react";
import { Link } from "react-router-dom";

const RegisterChoice: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
      <h2 className="text-2xl font-bold mb-6">Choose Registration Type</h2>
      <div className="flex flex-col gap-4">
        <Link
          to="/register/user"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
        >
          Register as User
        </Link>
        <Link
          to="/register/vendor"
          className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition"
        >
          Register as Vendor
        </Link>
        <Link
          to="/register/admin"
          className="w-full bg-purple-600 text-white py-2 rounded font-semibold hover:bg-purple-700 transition"
        >
          Register as Admin
        </Link>
      </div>
      <div className="mt-6 text-center">
        Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
      </div>
    </div>
  </div>
);

export default RegisterChoice;
