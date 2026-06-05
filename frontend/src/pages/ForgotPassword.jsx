import React, { useState } from "react";
import api from "../utils/axios";
import { useNavigate, Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (!showReset) {
        const { data } = await api.post("/auth/forgot-password", { email });
        setMessage(data.message);
        setShowReset(true);
      } else {
        const { data } = await api.post("/auth/reset-password", {
          email,
          otp,
          newPassword,
        });

        setMessage(data.message);

        setTimeout(() => {
          navigate("/login");
        }, 1200);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">
        Forgot Password
      </h2>

      <p className="text-gray-500 text-center mb-6">
        Reset your Eventora account password
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-center border border-red-100">
          {error}
        </div>
      )}

      {message && (
        <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 text-center border border-green-100">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            required
            disabled={showReset}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-700 transition shadow-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {showReset && (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                OTP
              </label>
              <input
                type="text"
                required
                maxLength="6"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-700 transition shadow-sm text-center font-bold tracking-widest"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                required
                minLength="6"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-700 transition shadow-sm"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-black transition shadow-md"
        >
          {loading
            ? "Processing..."
            : showReset
              ? "Reset Password"
              : "Send OTP"}
        </button>
      </form>

      <p className="text-center mt-6 text-gray-600">
        Remember password?{" "}
        <Link to="/login" className="text-gray-900 font-bold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default ForgotPassword;