# 🎟️ Eventora - MERN Event Booking App
**Eventora** is a premium, full-stack Event Booking Web Application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). The platform enables users to explore upcoming events, register and log in securely, verify their emails, and seamlessly book events (both paid and free) with real-time status tracking.

---
🖥️ **Live Demo:** [https://eventora-86gt.vercel.app/](https://eventora-86gt.vercel.app/)

---
## ✨ Features
- 🔐 **Secure User Authentication**: Sign Up, Login, and Logout functionality powered by JWT and bcryptjs encryption.
- 📧 **Verification System**: Email verification flow using Nodemailer and EmailJS (OTP/Link based verification).
- 📅 **Dynamic Event Catalog**: Explore list of events with details, pricing, schedule, and capacity.
- 🎟️ **Ticket Booking System**: Simple booking flow for paid and unpaid events with ticket quantity validation.
- 📊 **Real-time Status Tracking**: Real-time booking status (Pending / Confirmed) and user-specific dashboard.
- 📱 **Fully Responsive UI**: Modern, fluid design built with React, React Icons, and Tailwind CSS.
- 🛠️ **MVC Architecture**: Well-structured backend layout for high scalability and cleaner code maintenance.

---

## 🛠️ Tech Stack
### 💻 Frontend
- **React.js (v19)** - A frontend library for building highly interactive, component-based user interfaces.
- **Tailwind CSS** - A utility-first CSS framework used to build modern, sleek, and responsive layouts.
- **React Router DOM (v7)** - Declarative, client-side routing for seamless page navigation.
- **React Icons** - A rich library of icons used across the dashboard and landing pages.
- **Axios** - Promise-based HTTP client for integrating frontend state with backend REST APIs.
### ⚙️ Backend
- **Node.js** - A cross-platform JavaScript runtime environment for executing backend code.
- **Express.js (v5)** - A fast, minimalist web framework for building highly scalable backend APIs.
- **Mongoose** - An Object Data Modeling (ODM) library for MongoDB and Node.js schema validation.
### 🗄️ Database
- **MongoDB** - A document-based NoSQL database used to store flexible data structures for users, events, and bookings.
### 🔑 Security & Utilities
- **JWT (JSON Web Tokens)** - Used for stateless user authentication and securing private API routes.
- **BcryptJS** - Password hashing library to store user passwords securely in the database.
- **EmailJS** - Dual integration for sending OTP/verification links with automatic SMTP fallback support.


---

## ☁️ Deployment
- **Frontend Deployment:** Deployed on [Vercel](https://vercel.com/)
- **Backend Deployment:** Deployed on [Render](https://render.com/)

---
## 👨‍💻 Author
- **Developer:** Kapil Choudhary
- **Email:** [kapilchoudhary9171@gmail.com](mailto:kapilchoudhary9171@gmail.com)
- **GitHub:** [@KapilChoudhary07](https://github.com/KapilChoudhary07)

---
## 📂 Project Structure
```text
Eventora/
├── backend/
│   ├── controllers/      # Route controllers (Auth, Events, Bookings)
│   ├── middleware/       # JWT verification & route protection
│   ├── models/           # Mongoose schemas (User, Event, Booking)
│   ├── routes/           # Express router endpoints
│   ├── utils/            # Helper utilities (Email dispatchers, etc.)
│   ├── server.js         # Backend entry point
│   └── package.json
└── frontend/
    ├── public/           # Static assets
    ├── src/
    │   ├── components/   # Reusable UI components
    │   ├── pages/        # Main application pages
    │   ├── App.js        # React routes & main entry
    │   └── index.js      # ReactDOM render
    └── package.json


    
