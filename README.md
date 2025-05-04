# AltroHR

A modern role-based employee management system with attendance tracking, leave requests, and performance reporting.

## 📌 Project Overview

**AltroHR** is a full-stack web application designed to streamline employee management processes such as clock-in/out tracking, leave request handling, performance evaluation, and administrative reporting. It is built with a role-based architecture supporting Admin, HR, and Employee users.

## 🚀 Features

- Role-based dashboards (Admin, HR, Employee)
- Clock-in / Clock-out system with logs
- Submit and track leave requests
- Add and review performance notes
- Generate and export monthly reports (PDF/Excel)
- Manage employee records (CRUD)
- Light/Dark mode UI support
- Real-time notifications (optional)
- Error pages for 404 and unauthorized access

## 🛠 Tech Stack

### Frontend

- React.js with Vite
- Tailwind CSS
- React Router DOM

### Backend

- Node.js with Express.js
- MongoDB + Mongoose
- JWT Authentication
- RESTful APIs

## 📂 Project Structure

### Backend

- `models/`: Mongoose schemas (User, Attendance, LeaveRequest, etc.)
- `controllers/`: Business logic (Auth, Attendance, Leave, Report, etc.)
- `routes/`: API endpoints with role-based access
- `middleware/`: Auth and role validation
- `utils/`: Helpers (PDF generator, time utils, etc.)

### Frontend

- `pages/`: Role-based dashboard views
- `components/`: Reusable UI components and modals
- `services/`: API integration services
- `contexts/`: Global state (auth, UI mode, etc.)

## 🧪 Usage Scenarios

- Clock in/out with time logging
- Submit and manage leave requests
- Generate monthly employee performance reports
- Admin-level employee CRUD operations
- View historical attendance and leave logs

## 🔐 Roles & Access

- **Employee:** Submit requests, view own data
- **HR:** Manage leaves, view reports, add performance notes
- **Admin:** Full access to all system features

## 📎 License

This project is licensed under the MIT License.
