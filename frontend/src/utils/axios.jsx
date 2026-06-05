// import axios from "axios";

// const api = axios.create({
//   baseURL: "https://eventify-mini-project.onrender.com/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`; // ✅ FIX
//   }
//   return config;
// });

// export default api;



import axios from "axios";

const api = axios.create({
  baseURL: " https://eventify-mini-project.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // âœ… FIX
  }
  return config;
});

export default api;


