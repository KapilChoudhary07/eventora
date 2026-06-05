
// import React from "react";
// import api from "../utils/axios"; 

// export const AuthContext = React.createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = React.useState(null);
//   const [loading, setLoading] = React.useState(true);

//   React.useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//     setLoading(false);
//   }, []);

//   // ✅ LOGIN
//   const login = async (email, password) => {
//   try {
//     const { data } = await api.post("/auth/loginUser", { email, password });
//     setUser(data);
//     localStorage.setItem("user", JSON.stringify(data));
//     localStorage.setItem("token", data.token);
//     return data;
//   } catch (err) {
//     throw (
//       err.response?.data?.message ||
//       err.response?.data?.error ||
//       err.message ||
//       "Login failed"
//     );
//   }
// };
//   // ✅ REGISTER
//   const register = async (name, email, password) => {
//   try {
//     const { data } = await api.post("/auth/register", {
//       name,
//       email,
//       password,
//     });
//     setUser(data);
//     return data;
//   } catch (err) {
//     console.log("Register failed", err);

//     throw (
//       err.response?.data?.message ||
//       err.response?.data?.error ||
//       err.message ||
//       "Registration failed"
//     );
//   }
// };

//   // ✅ VERIFY OTP
//  const verifyOtp = async (email, otp) => {
//   try {
//     const { data } = await api.post("/auth/verifyOtp", {
//       email,
//       otp,
//     });
//     setUser(data);
//     localStorage.setItem("user", JSON.stringify(data));
//     localStorage.setItem("token", data.token);
//     return data;
//   } catch (err) {
//     throw (
//       err.response?.data?.message ||
//       err.response?.data?.error ||
//       err.message ||
//       "OTP failed"
//     );
//   }
// };

//   // ✅ LOGOUT
//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//   };

//   return (
//     <AuthContext.Provider
//       value={{ user, loading, login, logout, verifyOtp, register }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };


import React from "react";
import api from "../utils/axios";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const getErrorMessage = (err, fallback) => {
    console.log("API error:", err.response?.data || err.message);

    return (
      err.response?.data?.details ||
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message ||
      fallback
    );
  };

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/loginUser", { email, password });
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token);
      return data;
    } catch (err) {
      throw getErrorMessage(err, "Login failed");
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      return data;
    } catch (err) {
      throw getErrorMessage(err, "Registration failed");
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const { data } = await api.post("/auth/verifyOtp", {
        email,
        otp,
      });
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token);
      return data;
    } catch (err) {
      throw getErrorMessage(err, "OTP failed");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, verifyOtp, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};


