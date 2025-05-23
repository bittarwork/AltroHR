const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

const userRoutes = require('./routes/userRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const salaryRoutes = require('./routes/salaryRoutes');
const performanceNoteRoutes = require('./routes/performanceNoteRoutes');
const monthlyReportRoutes = require('./routes/monthlyReportRoutes');

const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

// General Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/departments', departmentRoutes);
app.use('/api/user/', userRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/salaries', salaryRoutes);
app.use('/api/performance-notes', performanceNoteRoutes);
app.use('/api/reports', monthlyReportRoutes);

// Test Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Not Found Middleware
app.use(notFound);

// Error Handling Middleware
app.use(errorHandler);


module.exports = app;
