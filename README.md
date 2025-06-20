# AltroHR - Comprehensive Human Resources Management System

<div align="center">

![AltroHR Logo](https://img.shields.io/badge/AltroHR-v1.0.0-blue?style=for-the-badge)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green?style=flat-square)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v19-blue?style=flat-square)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v6+-green?style=flat-square)](https://mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

_A modern, role-based Human Resources Management System with advanced attendance tracking, leave management, and comprehensive reporting capabilities._

</div>

---

## 🌟 **Overview**

**AltroHR** is a full-stack, enterprise-grade Human Resources Management System designed to streamline HR operations for small to medium-sized businesses. Built with modern web technologies, it provides a comprehensive solution for employee management, attendance tracking, leave requests, performance evaluation, and administrative reporting.

### ✨ **Key Highlights**

- **Role-Based Access Control** - Admin, HR, and Employee dashboards
- **Real-Time Attendance Tracking** - Clock-in/out with automatic calculations
- **Advanced Leave Management** - Multi-type leave requests with approval workflows
- **Comprehensive Reporting** - Generate and export detailed reports in CSV format
- **Modern UI/UX** - Responsive design with dark/light mode support
- **Arabic-First Design** - RTL support with bilingual capabilities
- **Enterprise Security** - JWT authentication with session management

---

## 🚀 **Features**

### 👥 **Employee Management**

- **Complete Employee Profiles** - Personal info, contact details, profile pictures
- **Department Organization** - Hierarchical department structure
- **Role-Based Permissions** - Granular access control system
- **Employee Onboarding** - Streamlined registration process

### ⏰ **Attendance & Time Tracking**

- **Digital Clock-In/Out** - Timestamp-based attendance logging
- **Automatic Calculations** - Work hours, overtime, and break tracking
- **Attendance Reports** - Detailed attendance analytics
- **Real-Time Monitoring** - Live attendance status tracking

### 🏖️ **Leave Management**

- **Multiple Leave Types** - Annual, sick, emergency, maternity, and custom leaves
- **Approval Workflows** - Multi-level approval system
- **Leave Balance Tracking** - Automatic calculation of available leave days
- **Conflict Detection** - Prevents overlapping leave requests

### 📊 **Reporting & Analytics**

- **Comprehensive Reports** - Employee, attendance, leave, and system reports
- **CSV Export** - Export data with advanced filtering options
- **Visual Dashboards** - Charts and graphs for data visualization
- **Monthly Reports** - Automated monthly performance summaries

### 💰 **Payroll Management**

- **Flexible Salary Types** - Fixed monthly or hourly rates
- **Overtime Calculations** - Automatic overtime rate applications
- **Salary Reports** - Detailed payroll analytics
- **Payment Tracking** - Complete salary payment history

### 📈 **Performance Management**

- **Performance Notes** - Detailed employee performance tracking
- **Monthly Evaluations** - Structured performance reviews
- **Performance Analytics** - Trend analysis and reporting

### 🔧 **System Administration**

- **System Settings** - Configurable system parameters
- **User Management** - Complete CRUD operations for users
- **Department Management** - Organizational structure management
- **System Statistics** - Real-time system health monitoring

---

## 🛠 **Technology Stack**

### **Backend**

| Technology     | Purpose             | Version |
| -------------- | ------------------- | ------- |
| **Node.js**    | Runtime Environment | v18+    |
| **Express.js** | Web Framework       | v5.1.0  |
| **MongoDB**    | Database            | v6+     |
| **Mongoose**   | ODM                 | v8.14.1 |
| **JWT**        | Authentication      | v9.0.2  |
| **bcryptjs**   | Password Hashing    | v3.0.2  |
| **Multer**     | File Upload         | v2.0.1  |
| **json2csv**   | CSV Export          | v6.0.0  |

### **Frontend**

| Technology        | Purpose            | Version  |
| ----------------- | ------------------ | -------- |
| **React**         | UI Framework       | v19.0.0  |
| **Vite**          | Build Tool         | v6.3.1   |
| **Tailwind CSS**  | Styling            | v4.1.5   |
| **Framer Motion** | Animations         | v12.16.0 |
| **Chart.js**      | Data Visualization | v4.4.9   |
| **React Router**  | Navigation         | v7.5.3   |

---

## 📋 **Prerequisites**

Before installing AltroHR, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher)
- **MongoDB** (v6.0 or higher)
- **Git** (for version control)

---

## 🚀 **Installation & Setup**

### 1. **Clone the Repository**

```bash
git clone https://github.com/your-username/AltroHR.git
cd AltroHR
```

### 2. **Backend Setup**

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure environment variables
nano .env
```

### 3. **Frontend Setup**

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure environment variables
nano .env
```

### 4. **Environment Configuration**

#### **Backend (.env)**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/altrohrs

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

#### **Frontend (.env)**

```env
# API Configuration
VITE_API_URL=http://localhost:5000

# App Configuration
VITE_APP_NAME=AltroHR
VITE_APP_VERSION=1.0.0
```

### 5. **Database Initialization**

```bash
# In the backend directory
npm run seed    # Initialize with sample data (optional)

# Or manually create admin user
node scripts/createAdmin.js
```

### 6. **Start the Application**

#### **Development Mode**

```bash
# Start backend (terminal 1)
cd backend
npm run dev

# Start frontend (terminal 2)
cd frontend
npm run dev
```

#### **Production Mode**

```bash
# Build frontend
cd frontend
npm run build

# Start backend
cd backend
npm start
```

### 7. **Access the Application**

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api-docs (if enabled)

---

## 📁 **Project Structure**

```
AltroHR/
├── backend/                    # Node.js/Express Backend
│   ├── controllers/           # Business logic controllers
│   │   ├── AttendanceController.js
│   │   ├── UserController.js
│   │   ├── LeaveRequestController.js
│   │   ├── ReportsController.js
│   │   └── ...
│   ├── models/               # Mongoose schemas
│   │   ├── User.js
│   │   ├── Attendance.js
│   │   ├── LeaveRequest.js
│   │   └── ...
│   ├── routes/               # API endpoints
│   │   ├── userRoutes.js
│   │   ├── attendanceRoutes.js
│   │   └── ...
│   ├── middleware/           # Custom middleware
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── ...
│   ├── scripts/              # Utility scripts
│   │   ├── createAdmin.js
│   │   ├── seedData.js
│   │   └── ...
│   ├── config/               # Configuration files
│   │   └── db.js
│   ├── uploads/              # File uploads
│   └── tests/                # Test files
│
├── frontend/                  # React Frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── DashboardTabs/
│   │   │   ├── HRDashboard/
│   │   │   ├── EmployeeDashboard/
│   │   │   └── ...
│   │   ├── pages/            # Main pages
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── HRDashboard.jsx
│   │   │   ├── EmployeeDashboard.jsx
│   │   │   └── auth/
│   │   ├── contexts/         # React contexts
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── services/         # API services
│   │   │   ├── apiService.js
│   │   │   ├── userService.js
│   │   │   └── ...
│   │   ├── modals/           # Modal components
│   │   ├── styles/           # Custom styles
│   │   └── ...
│   ├── public/               # Static assets
│   └── ...
│
└── README.md                 # Project documentation
```

---

## 👤 **User Roles & Permissions**

### 🔴 **Admin (System Administrator)**

- **Full System Access** - Complete control over all system functions
- **User Management** - Create, update, delete user accounts
- **System Settings** - Configure system parameters and preferences
- **Advanced Reports** - Access to all reporting capabilities
- **Department Management** - Create and manage organizational departments
- **Data Export** - Export system data in various formats

### 🔵 **HR (Human Resources)**

- **Employee Management** - Manage employee profiles and information
- **Leave Management** - Approve/reject leave requests
- **Attendance Monitoring** - View and manage attendance records
- **Performance Tracking** - Add performance notes and evaluations
- **HR Reports** - Generate HR-specific reports
- **Department Access** - Manage assigned departments

### 🟢 **Employee**

- **Personal Profile** - View and update personal information
- **Attendance Tracking** - Clock in/out and view attendance history
- **Leave Requests** - Submit and track leave applications
- **Performance Reviews** - View performance evaluations
- **Personal Reports** - Access personal attendance and leave reports

---

## 🔧 **API Documentation**

### **Authentication**

```http
POST /api/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}
```

### **Attendance Management**

```http
# Clock In
POST /api/attendance/clock-in
Authorization: Bearer <token>

# Clock Out
POST /api/attendance/clock-out
Authorization: Bearer <token>

# Get Attendance Records
GET /api/attendance/user/:userId
Authorization: Bearer <token>
```

### **Leave Management**

```http
# Submit Leave Request
POST /api/leaves
Authorization: Bearer <token>
Content-Type: application/json

{
  "leaveType": "annual",
  "startDate": "2024-03-01",
  "endDate": "2024-03-05",
  "reason": "Personal vacation"
}
```

### **Reports**

```http
# Generate Report
GET /api/reports/generate
Authorization: Bearer <token>
Query Parameters:
  - type: "attendance" | "leaves" | "employees"
  - format: "json" | "csv"
  - startDate: "2024-01-01"
  - endDate: "2024-12-31"
```

---

## 🧪 **Testing**

### **Run Tests**

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Run specific test suite
npm test -- --grep "attendance"
```

### **Test Coverage**

- **Unit Tests** - Individual component testing
- **Integration Tests** - API endpoint testing
- **E2E Tests** - Complete user workflow testing

---

## 🚀 **Deployment**

### **Docker Deployment**

```dockerfile
# Create Dockerfile in root directory
FROM node:18-alpine

# Install dependencies and build
WORKDIR /app
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build frontend
RUN cd frontend && npm install && npm run build

# Expose port
EXPOSE 5000

# Start application
CMD ["npm", "start"]
```

### **Traditional Deployment**

```bash
# Build frontend for production
cd frontend
npm run build

# Start backend in production mode
cd backend
NODE_ENV=production npm start
```

### **Environment-Specific Configurations**

- **Development** - Hot reload, debug mode
- **Staging** - Production-like environment for testing
- **Production** - Optimized for performance and security

---

## 🔐 **Security Features**

- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control** - Granular permission system
- **Password Hashing** - bcrypt with salt rounds
- **Session Management** - Configurable session timeouts
- **Input Validation** - Comprehensive data validation
- **File Upload Security** - Type and size restrictions
- **CORS Protection** - Cross-origin request security

---

## 🌍 **Internationalization**

- **Primary Language** - Arabic (RTL support)
- **Secondary Language** - English
- **Localization** - Date formats, currency, time zones
- **Cultural Adaptation** - Regional holidays and work patterns

---

## 📈 **Performance Optimization**

- **Lazy Loading** - Component-based code splitting
- **Caching** - Browser and server-side caching
- **Database Indexing** - Optimized database queries
- **Image Optimization** - Compressed profile images
- **Bundle Optimization** - Minimized JavaScript bundles

---

## 🛠 **Development Scripts**

```bash
# Backend Scripts
npm run dev          # Start development server
npm run start        # Start production server
npm run seed         # Seed database with sample data
npm run test         # Run test suite
npm run lint         # Run ESLint

# Frontend Scripts
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

---

## 🤝 **Contributing**

We welcome contributions to AltroHR! Please follow these guidelines:

### **Getting Started**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Code Standards**

- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

### **Pull Request Process**

1. Update README.md if needed
2. Update version numbers following SemVer
3. Add tests for new functionality
4. Ensure all tests pass

---

## 📞 **Support & Documentation**

- **GitHub Issues** - Bug reports and feature requests
- **Documentation** - Comprehensive guides and API docs
- **Community** - Join our developer community
- **Email Support** - contact@altrohrs.com

---

## 🗺 **Roadmap**

### **Version 1.1 (Upcoming)**

- [ ] Email notification system
- [ ] Advanced reporting dashboard
- [ ] Mobile app (React Native)
- [ ] Two-factor authentication

### **Version 1.2 (Planned)**

- [ ] Automated backup system
- [ ] Integration APIs
- [ ] Advanced analytics
- [ ] Multi-language support

### **Version 2.0 (Future)**

- [ ] AI-powered insights
- [ ] Advanced workflow automation
- [ ] Enterprise integrations
- [ ] Advanced security features

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 AltroHR Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 **Acknowledgments**

- **MongoDB** - For the robust database solution
- **React Team** - For the amazing frontend framework
- **Express.js** - For the minimal web framework
- **Tailwind CSS** - For the utility-first CSS framework
- **All Contributors** - Who helped make this project possible

---

## 📊 **Project Statistics**

![GitHub repo size](https://img.shields.io/github/repo-size/your-username/AltroHR)
![GitHub language count](https://img.shields.io/github/languages/count/your-username/AltroHR)
![GitHub top language](https://img.shields.io/github/languages/top/your-username/AltroHR)
![GitHub last commit](https://img.shields.io/github/last-commit/your-username/AltroHR)

---

<div align="center">

**Made with ❤️ by the AltroHR Team**

[Website](https://altrohrs.com) • [Documentation](https://docs.altrohrs.com) • [Support](mailto:support@altrohrs.com)

</div>
