
// import React, { useState, useEffect, useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';
// import api from '../utils/axios';
// import { Link, useNavigate } from 'react-router-dom';
// import { FaTicketAlt, FaTimesCircle,FaDownload } from 'react-icons/fa';

// const UserDashboard = () => {
//     const { user } = useContext(AuthContext);
//     const navigate = useNavigate();
//     const [bookings, setBookings] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         if (!user) {
//             navigate('/login');
//             return;
//         }
//         fetchBookings();
//     }, [user, navigate]);

//     const fetchBookings = async () => {
//         try {
//             const { data } = await api.get('/bookings/my');
//            setBookings(data.bookings || data);
//         } catch (error) {
//             console.error('Error fetching bookings', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const cancelBooking = async (id) => {
//         if (window.confirm('Are you sure you want to cancel this booking request?')) {
//             try {
//                 await api.put(`/bookings/${id}`);
//                 fetchBookings();
//             } catch (error) {
//                 alert(error.response?.data?.message || 'Error cancelling booking');
//             }
//         }
//     };

//     if (loading) return <div className="text-center py-20 text-xl font-semibold">Loading dashboard...</div>;

//     return (
//         <div className="max-w-6xl mx-auto">
//             <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-8 border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6">
//                 <div className="w-20 h-20 bg-gray-200 text-gray-900 rounded-full flex items-center justify-center text-3xl font-bold uppercase tracking-widest shrink-0">
//                     {user?.name.charAt(0)}
//                 </div>
//                 <div className="flex flex-col items-center sm:items-start">
//                     <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">Welcome, {user?.name}!</h1>
//                     <p className="text-gray-500 flex items-center justify-center sm:justify-start gap-2">
//                         <span className="w-2 h-2 rounded-full bg-green-500"></span> User Dashboard
//                     </p>
//                 </div>
//             </div>

//             <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2 sm:gap-3">
//                     <FaTicketAlt className="text-gray-700" /> My Bookings requests
//                 </h2>
//             </div>

//             {bookings.length === 0 ? (
//                 <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
//                     <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
//                         <FaTicketAlt className="text-gray-300 text-3xl" />
//                     </div>
//                     <p className="text-xl text-gray-500 mb-6 mt-4 font-medium">You haven't booked any events yet.</p>
//                     <Link to="/" className="inline-block bg-gray-900 hover:bg-black text-white font-bold py-3 px-8 rounded-lg transition shadow-md">
//                         Browse Events
//                     </Link>
//                 </div>
//             ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                      {Array.isArray(bookings) && bookings.map((booking) =>  (   // ye change kiya
//                         <div key={booking._id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col">
//                             <div className="p-6 border-b border-gray-50 flex-grow">
//                                 {booking.eventId ? (
//                                     <>
//                                         <div className="flex justify-between items-start mb-4">
//                                             <h3 className="text-lg font-bold text-gray-900 leading-tight">{booking.eventId.title}</h3>
//                                             <div className="flex flex-col gap-1 items-end">
//                                                 <span className={`px-2 py-1 text-[10px] font-black rounded uppercase tracking-wider ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
//                                                     booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
//                                                         'bg-yellow-100 text-yellow-700'
//                                                     }`}>
//                                                     {booking.status}
//                                                 </span>
//                                                 {booking.status !== 'cancelled' && (
//                                                     <span className={`px-2 py-1 text-[10px] font-black rounded uppercase tracking-wider ${booking.paymentStatus === 'paid' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
//                                                         }`}>
//                                                         {booking.paymentStatus.replace('_', ' ')}
//                                                     </span>
//                                                 )}
//                                             </div>
//                                         </div>
//                                         <div className="text-sm text-gray-500 mb-4 space-y-1">
//                                             <p><strong className="text-gray-700">Date:</strong> {new Date(booking.eventId.date).toLocaleDateString()}</p>
//                                             <p><strong className="text-gray-700">Amount:</strong> {booking.amount === 0 ? 'Free' : `₹${booking.amount}`}</p>
//                                             <p><strong className="text-gray-700">Requested:</strong> {new Date(booking.createdAt).toLocaleDateString()}</p>
//                                         </div>
//                                     </>
//                                 ) : (
//                                     <p className="text-red-500 italic">Event details unavailable (might have been deleted)</p>
//                                 )}
//                             </div>
//                             <div className="p-4 bg-gray-50 flex justify-between items-center shrink-0">
//                                 {booking.eventId && booking.status !== 'cancelled' ? (
//                                     <>
//                                         <Link to={`/events/${booking.eventId._id}`} className="text-gray-900 font-semibold text-sm hover:underline">View Event</Link>
//                                         <button
//                                             onClick={() => cancelBooking(booking._id)}
//                                             className="text-red-500 font-semibold text-sm hover:text-red-700 transition flex items-center gap-1"
//                                         >
//                                             <FaTimesCircle /> Cancel
//                                         </button>
//                                     </>
//                                 ) : (
//                                     <div className="w-full text-center text-sm text-gray-500 italic">Booking Cancelled</div>
//                                 )}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default UserDashboard;



// import React, { useState, useEffect, useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
// import api from "../utils/axios";
// import { Link, useNavigate } from "react-router-dom";
// import { FaTicketAlt, FaTimesCircle, FaDownload } from "react-icons/fa";

// const UserDashboard = () => {
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//     const [filter, setFilter] = useState("all");

//   useEffect(() => {
//     if (!user) {
//       navigate("/login");
//       return;
//     }
//     fetchBookings();
//   }, [user, navigate]);

//   const fetchBookings = async () => {
//     try {
//       const { data } = await api.get("/bookings/my");
//       setBookings(data.bookings || data);
//     } catch (error) {
//       console.error("Error fetching bookings", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const cancelBooking = async (id) => {
//     if (window.confirm("Are you sure you want to cancel this booking request?")) {
//       try {
//         await api.put(`/bookings/${id}`);
//         fetchBookings();
//       } catch (error) {
//         alert(error.response?.data?.message || "Error cancelling booking");
//       }
//     }
//   };

//   const downloadTicket = (booking) => {
//     const event = booking.eventId;

//     if (!event) {
//       alert("Event details unavailable");
//       return;
//     }
    

//     const ticketHtml = `
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <title>Eventora Ticket</title>
//           <style>
//             body {
//               font-family: Arial, sans-serif;
//               background: #f4f4f4;
//               padding: 30px;
//             }
//             .ticket {
//               max-width: 650px;
//               margin: auto;
//               background: white;
//               border: 2px solid #111;
//               border-radius: 12px;
//               padding: 30px;
//             }
//             .header {
//               text-align: center;
//               border-bottom: 2px dashed #999;
//               padding-bottom: 18px;
//               margin-bottom: 22px;
//             }
//             .brand {
//               font-size: 30px;
//               font-weight: 900;
//               color: #111;
//             }
//             .subtitle {
//               color: #666;
//               margin-top: 6px;
//             }
//             .row {
//               display: flex;
//               justify-content: space-between;
//               gap: 20px;
//               padding: 10px 0;
//               border-bottom: 1px solid #eee;
//             }
//             .label {
//               font-weight: bold;
//               color: #555;
//             }
//             .value {
//               text-align: right;
//               color: #111;
//               word-break: break-word;
//             }
//             .status {
//               margin-top: 24px;
//               text-align: center;
//               font-size: 18px;
//               font-weight: bold;
//               color: green;
//             }
//             .footer {
//               margin-top: 25px;
//               text-align: center;
//               color: #777;
//               font-size: 13px;
//             }
//             @media (max-width: 600px) {
//               body { padding: 12px; }
//               .ticket { padding: 20px; }
//               .row {
//                 flex-direction: column;
//                 gap: 4px;
//               }
//               .value {
//                 text-align: left;
//               }
//             }
//             @media print {
//               body { background: white; }
//             }
//           </style>
//         </head>
//         <body>
//           <div class="ticket">
//             <div class="header">
//               <div class="brand">Eventora</div>
//               <div class="subtitle">Official Event Ticket</div>
//             </div>

//             <div class="row"><div class="label">Booking ID</div><div class="value">${booking._id}</div></div>
//             <div class="row"><div class="label">Name</div><div class="value">${user?.name || "User"}</div></div>
//             <div class="row"><div class="label">Email</div><div class="value">${user?.email || ""}</div></div>
//             <div class="row"><div class="label">Event</div><div class="value">${event.title}</div></div>
//             <div class="row"><div class="label">Date</div><div class="value">${new Date(event.date).toLocaleDateString()}</div></div>
//             <div class="row"><div class="label">Location</div><div class="value">${event.location}</div></div>
//             <div class="row"><div class="label">Amount</div><div class="value">${booking.amount === 0 ? "Free" : `Rs. ${booking.amount}`}</div></div>
//             <div class="row"><div class="label">Payment Status</div><div class="value">${booking.paymentStatus.replace("_", " ")}</div></div>

//             <div class="status">Ticket Confirmed</div>
//             <div class="footer">Please carry this ticket at the event venue.</div>
//           </div>

//           <script>
//             window.print();
//           </script>
//         </body>
//       </html>
//     `;

//     const ticketWindow = window.open("", "_blank");
//     ticketWindow.document.write(ticketHtml);
//     ticketWindow.document.close();
//   };

//   if (loading) {
//     return (
//       <div className="text-center py-20 text-xl font-semibold">
//         Loading dashboard...
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto">
//       <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-8 border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6">
//         <div className="w-20 h-20 bg-gray-200 text-gray-900 rounded-full flex items-center justify-center text-3xl font-bold uppercase tracking-widest shrink-0">
//           {user?.name?.charAt(0)}
//         </div>
//         <div className="flex flex-col items-center sm:items-start">
//           <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
//             Welcome, {user?.name}!
//           </h1>
//           <p className="text-gray-500 flex items-center justify-center sm:justify-start gap-2">
//             <span className="w-2 h-2 rounded-full bg-green-500"></span>
//             User Dashboard
//           </p>
//         </div>
//       </div>

//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2 sm:gap-3">
//           <FaTicketAlt className="text-gray-700" /> My Bookings requests
//         </h2>
//       </div>

//       {bookings.length === 0 ? (
//         <div className="bg-white rounded-xl shadow-sm p-8 sm:p-12 text-center border border-gray-100">
//           <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
//             <FaTicketAlt className="text-gray-300 text-3xl" />
//           </div>
//           <p className="text-xl text-gray-500 mb-6 mt-4 font-medium">
//             You haven't booked any events yet.
//           </p>
//           <Link
//             to="/"
//             className="inline-block bg-gray-900 hover:bg-black text-white font-bold py-3 px-8 rounded-lg transition shadow-md"
//           >
//             Browse Events
//           </Link>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {Array.isArray(bookings) &&
//             bookings.map((booking) => (
//               <div
//                 key={booking._id}
//                 className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col"
//               >
//                 <div className="p-6 border-b border-gray-50 flex-grow">
//                   {booking.eventId ? (
//                     <>
//                       <div className="flex justify-between items-start gap-3 mb-4">
//                         <h3 className="text-lg font-bold text-gray-900 leading-tight">
//                           {booking.eventId.title}
//                         </h3>
//                         <div className="flex flex-col gap-1 items-end shrink-0">
//                           <span
//                             className={`px-2 py-1 text-[10px] font-black rounded uppercase tracking-wider ${
//                               booking.status === "confirmed"
//                                 ? "bg-green-100 text-green-700"
//                                 : booking.status === "cancelled"
//                                   ? "bg-red-100 text-red-700"
//                                   : "bg-yellow-100 text-yellow-700"
//                             }`}
//                           >
//                             {booking.status}
//                           </span>
//                           {booking.status !== "cancelled" && (
//                             <span
//                               className={`px-2 py-1 text-[10px] font-black rounded uppercase tracking-wider ${
//                                 booking.paymentStatus === "paid"
//                                   ? "bg-blue-100 text-blue-700"
//                                   : "bg-gray-100 text-gray-700"
//                               }`}
//                             >
//                               {booking.paymentStatus.replace("_", " ")}
//                             </span>
//                           )}
//                         </div>
//                       </div>

//                       <div className="text-sm text-gray-500 mb-4 space-y-1">
//                         <p>
//                           <strong className="text-gray-700">Date:</strong>{" "}
//                           {new Date(booking.eventId.date).toLocaleDateString()}
//                         </p>
//                         <p>
//                           <strong className="text-gray-700">Amount:</strong>{" "}
//                           {booking.amount === 0 ? "Free" : `Rs. ${booking.amount}`}
//                         </p>
//                         <p>
//                           <strong className="text-gray-700">Requested:</strong>{" "}
//                           {new Date(booking.createdAt).toLocaleDateString()}
//                         </p>
//                       </div>
//                     </>
//                   ) : (
//                     <p className="text-red-500 italic">
//                       Event details unavailable
//                     </p>
//                   )}
//                 </div>

//                 <div className="p-4 bg-gray-50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 shrink-0">
//                   {booking.eventId && booking.status !== "cancelled" ? (
//                     <>
//                       <Link
//                         to={`/events/${booking.eventId._id}`}
//                         className="w-full sm:w-auto text-center sm:text-left text-gray-900 font-semibold text-sm hover:underline"
//                       >
//                         View Event
//                       </Link>

//                       <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
//                         {booking.status === "confirmed" && (
//                           <button
//                             onClick={() => downloadTicket(booking)}
//                             className="w-full sm:w-auto inline-flex items-center justify-center gap-1 text-green-600 font-semibold text-sm hover:text-green-800 transition"
//                           >
//                             <FaDownload /> Ticket
//                           </button>
//                         )}

//                         <button
//                           onClick={() => cancelBooking(booking._id)}
//                           className="w-full sm:w-auto inline-flex items-center justify-center gap-1 text-red-500 font-semibold text-sm hover:text-red-700 transition"
//                         >
//                           <FaTimesCircle /> Cancel
//                         </button>
//                       </div>
//                     </>
//                   ) : (
//                     <div className="w-full text-center text-sm text-gray-500 italic">
//                       Booking Cancelled
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserDashboard;


import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import { FaTicketAlt, FaTimesCircle, FaDownload } from "react-icons/fa";

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get("/bookings/my");
      setBookings(data.bookings || data);
    } catch (error) {
      console.error("Error fetching bookings", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    if (window.confirm("Are you sure you want to cancel this booking request?")) {
      try {
        await api.put(`/bookings/${id}`);
        fetchBookings();
      } catch (error) {
        alert(error.response?.data?.message || "Error cancelling booking");
      }
    }
  };

  const downloadTicket = (booking) => {
    const event = booking.eventId;

    if (!event) {
      alert("Event details unavailable");
      return;
    }

    const ticketHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Eventora Ticket</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background: #f4f4f4;
              padding: 30px;
            }
            .ticket {
              max-width: 650px;
              margin: auto;
              background: white;
              border: 2px solid #111;
              border-radius: 12px;
              padding: 30px;
            }
            .header {
              text-align: center;
              border-bottom: 2px dashed #999;
              padding-bottom: 18px;
              margin-bottom: 22px;
            }
            .brand {
              font-size: 30px;
              font-weight: 900;
              color: #111;
            }
            .subtitle {
              color: #666;
              margin-top: 6px;
            }
            .row {
              display: flex;
              justify-content: space-between;
              gap: 20px;
              padding: 10px 0;
              border-bottom: 1px solid #eee;
            }
            .label {
              font-weight: bold;
              color: #555;
            }
            .value {
              text-align: right;
              color: #111;
              word-break: break-word;
            }
            .status {
              margin-top: 24px;
              text-align: center;
              font-size: 18px;
              font-weight: bold;
              color: green;
            }
            .footer {
              margin-top: 25px;
              text-align: center;
              color: #777;
              font-size: 13px;
            }
            @media (max-width: 600px) {
              body { padding: 12px; }
              .ticket { padding: 20px; }
              .row {
                flex-direction: column;
                gap: 4px;
              }
              .value {
                text-align: left;
              }
            }
            @media print {
              body { background: white; }
            }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="header">
              <div class="brand">Eventora</div>
              <div class="subtitle">Official Event Ticket</div>
            </div>

            <div class="row"><div class="label">Booking ID</div><div class="value">${booking._id}</div></div>
            <div class="row"><div class="label">Name</div><div class="value">${user?.name || "User"}</div></div>
            <div class="row"><div class="label">Email</div><div class="value">${user?.email || ""}</div></div>
            <div class="row"><div class="label">Event</div><div class="value">${event.title}</div></div>
            <div class="row"><div class="label">Date</div><div class="value">${new Date(event.date).toLocaleDateString()}</div></div>
            <div class="row"><div class="label">Location</div><div class="value">${event.location}</div></div>
            <div class="row"><div class="label">Amount</div><div class="value">${booking.amount === 0 ? "Free" : `Rs. ${booking.amount}`}</div></div>
            <div class="row"><div class="label">Payment Status</div><div class="value">${booking.paymentStatus.replace("_", " ")}</div></div>

            <div class="status">Ticket Confirmed</div>
            <div class="footer">Please carry this ticket at the event venue.</div>
          </div>

          <script>
            window.print();
          </script>
        </body>
      </html>
    `;

    const ticketWindow = window.open("", "_blank");
    ticketWindow.document.write(ticketHtml);
    ticketWindow.document.close();
  };

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((booking) => booking.status === "confirmed").length,
    pending: bookings.filter((booking) => booking.status === "pending").length,
    cancelled: bookings.filter((booking) => booking.status === "cancelled").length,
  };

  const filteredBookings =
    filter === "all"
      ? bookings
      : bookings.filter((booking) => booking.status === filter);

  const filterOptions = [
    { label: "All", value: "all", count: stats.total },
    { label: "Confirmed", value: "confirmed", count: stats.confirmed },
    { label: "Pending", value: "pending", count: stats.pending },
    { label: "Cancelled", value: "cancelled", count: stats.cancelled },
  ];

  if (loading) {
    return (
      <div className="text-center py-20 text-xl font-semibold">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-8 border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6">
        <div className="w-20 h-20 bg-gray-200 text-gray-900 rounded-full flex items-center justify-center text-3xl font-bold uppercase tracking-widest shrink-0">
          {user?.name?.charAt(0)}
        </div>
        <div className="flex flex-col items-center sm:items-start">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
            Welcome, {user?.name}!
          </h1>
          <p className="text-gray-500 flex items-center justify-center sm:justify-start gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            User Dashboard
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <p className="text-sm font-semibold text-gray-500">Total Bookings</p>
          <p className="text-3xl font-extrabold text-gray-900 mt-2">
            {stats.total}
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <p className="text-sm font-semibold text-gray-500">Confirmed</p>
          <p className="text-3xl font-extrabold text-green-600 mt-2">
            {stats.confirmed}
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <p className="text-sm font-semibold text-gray-500">Pending</p>
          <p className="text-3xl font-extrabold text-yellow-600 mt-2">
            {stats.pending}
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <p className="text-sm font-semibold text-gray-500">Cancelled</p>
          <p className="text-3xl font-extrabold text-red-600 mt-2">
            {stats.cancelled}
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2 sm:gap-3">
          <FaTicketAlt className="text-gray-700" /> My Booking Requests
        </h2>

        <div className="grid grid-cols-2 sm:flex gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition border ${
                filter === option.value
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {option.label} ({option.count})
            </button>
          ))}
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 sm:p-12 text-center border border-gray-100">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTicketAlt className="text-gray-300 text-3xl" />
          </div>
          <p className="text-xl text-gray-500 mb-6 mt-4 font-medium">
            {bookings.length === 0
              ? "You haven't booked any events yet."
              : `No ${filter} bookings found.`}
          </p>
          <Link
            to="/"
            className="inline-block bg-gray-900 hover:bg-black text-white font-bold py-3 px-8 rounded-lg transition shadow-md"
          >
            Browse Events
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(filteredBookings) &&
            filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col"
              >
                <div className="p-6 border-b border-gray-50 flex-grow">
                  {booking.eventId ? (
                    <>
                      <div className="flex justify-between items-start gap-3 mb-4">
                        <h3 className="text-lg font-bold text-gray-900 leading-tight">
                          {booking.eventId.title}
                        </h3>
                        <div className="flex flex-col gap-1 items-end shrink-0">
                          <span
                            className={`px-2 py-1 text-[10px] font-black rounded uppercase tracking-wider ${
                              booking.status === "confirmed"
                                ? "bg-green-100 text-green-700"
                                : booking.status === "cancelled"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {booking.status}
                          </span>
                          {booking.status !== "cancelled" && (
                            <span
                              className={`px-2 py-1 text-[10px] font-black rounded uppercase tracking-wider ${
                                booking.paymentStatus === "paid"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {booking.paymentStatus.replace("_", " ")}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-sm text-gray-500 mb-4 space-y-1">
                        <p>
                          <strong className="text-gray-700">Date:</strong>{" "}
                          {new Date(booking.eventId.date).toLocaleDateString()}
                        </p>
                        <p>
                          <strong className="text-gray-700">Amount:</strong>{" "}
                          {booking.amount === 0 ? "Free" : `Rs. ${booking.amount}`}
                        </p>
                        <p>
                          <strong className="text-gray-700">Requested:</strong>{" "}
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="text-red-500 italic">
                      Event details unavailable
                    </p>
                  )}
                </div>

                <div className="p-4 bg-gray-50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 shrink-0">
                  {booking.eventId && booking.status !== "cancelled" ? (
                    <>
                      <Link
                        to={`/events/${booking.eventId._id}`}
                        className="w-full sm:w-auto text-center sm:text-left text-gray-900 font-semibold text-sm hover:underline"
                      >
                        View Event
                      </Link>

                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                        {booking.status === "confirmed" && (
                          <button
                            onClick={() => downloadTicket(booking)}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-1 text-green-600 font-semibold text-sm hover:text-green-800 transition"
                          >
                            <FaDownload /> Ticket
                          </button>
                        )}

                        <button
                          onClick={() => cancelBooking(booking._id)}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-1 text-red-500 font-semibold text-sm hover:text-red-700 transition"
                        >
                          <FaTimesCircle /> Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="w-full text-center text-sm text-gray-500 italic">
                      Booking Cancelled
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;