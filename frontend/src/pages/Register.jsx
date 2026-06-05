// import React, { useState, useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate, Link } from "react-router-dom";
// // import { verifyOtp } from "../../../backend/controllers/authController";

// const Register = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [otp, setOtp] = useState("");
//   const [showOTP, setShowOTP] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const { register, verifyOtp } = useContext(AuthContext);
//   const navigate = useNavigate();
// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);
//   setError("");

//   try {
//     if (!showOTP) {
//       await register(name, email, password);
//       setShowOTP(true);
//       setError("");
//     } else {
//       await verifyOtp(email, otp);
//       navigate("/dashboard");
//     }
//   } catch (err) {
//     setError(
//       typeof err === "string"
//         ? err
//         : err?.response?.data?.message ||
//           err?.response?.data?.error ||
//           err?.message ||
//           "Signup failed"
//     );
//   } finally {
//     setLoading(false); // 🔥 MOST IMPORTANT FIX
//   }
// };

//   return (
//     <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
//       <div className="text-center mb-8">
//         <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
//           Create an Account
//         </h2>
//         <p className="text-gray-500">Join Eventora today</p>
//       </div>

//       {error && (
//         <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-center shadow-inner border border-red-100">
//           {error}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-5">
//         {!showOTP ? (
//           <>
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Full Name
//               </label>
//               <input
//                 type="text"
//                 required
//                 className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-700 transition shadow-sm"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 required
//                 className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-700 transition shadow-sm"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 required
//                 className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-700 transition shadow-sm"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>
//           </>
//         ) : (
//           <div>
//             <p className="text-sm text-green-700 bg-green-50 p-3 mb-4 rounded border border-green-200">
//               An OTP has been sent to your email. Please verify your account.
//             </p>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Verification Code (OTP)
//             </label>
//             <input
//               type="text"
//               required
//               placeholder="6-digit code"
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-700 transition shadow-sm font-bold tracking-widest text-center text-lg"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               maxLength="6"
//             />
//           </div>
//         )}

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-black focus:ring-4 focus:ring-gray-200 transition shadow-md mt-4"
//         >
//           {loading
//             ? "Processing..."
//             : showOTP
//               ? "Verify & Complete"
//               : "Sign Up"}
//         </button>
//       </form>

//       {!showOTP && (
//         <p className="text-center mt-6 text-gray-600">
//           Already have an account?{" "}
//           <Link to="/login" className="text-gray-900 font-bold hover:underline">
//             Sign in
//           </Link>
//         </p>
//       )}
//     </div>
//   );
// };

// export default Register;


import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, verifyOtp } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");

    try {
      if (!showOTP) {
        setInfo("Sending OTP to your email. This may take a few seconds...");
        await register(name, email, password);
        setShowOTP(true);
        setInfo("OTP sent successfully. Please check your email.");
      } else {
        setInfo("Verifying OTP...");
        await verifyOtp(email, otp);
        navigate("/dashboard");
      }
    } catch (err) {
      setInfo("");
      setError(
        typeof err === "string"
          ? err
          : err?.response?.data?.message ||
              err?.response?.data?.error ||
              err?.response?.data?.details ||
              err?.message ||
              "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
          Create an Account
        </h2>
        <p className="text-gray-500">Join Eventora today</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-center shadow-inner border border-red-100 text-sm">
          {error}
        </div>
      )}

      {info && (
        <div className="bg-blue-50 text-blue-700 p-3 rounded-lg mb-6 text-center shadow-inner border border-blue-100 text-sm">
          {info}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {!showOTP ? (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-700 transition shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-700 transition shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-700 transition shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </>
        ) : (
          <div>
            <p className="text-sm text-green-700 bg-green-50 p-3 mb-4 rounded border border-green-200">
              An OTP has been sent to your email. Please verify your account.
            </p>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Verification Code (OTP)
            </label>
            <input
              type="text"
              required
              disabled={loading}
              placeholder="6-digit code"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-700 transition shadow-sm font-bold tracking-widest text-center text-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength="6"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-black focus:ring-4 focus:ring-gray-200 transition shadow-md mt-4 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {loading
            ? showOTP
              ? "Verifying OTP..."
              : "Sending OTP..."
            : showOTP
              ? "Verify & Complete"
              : "Sign Up"}
        </button>
      </form>

      {!showOTP && (
        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-gray-900 font-bold hover:underline">
            Sign in
          </Link>
        </p>
      )}
    </div>
  );
};

export default Register;