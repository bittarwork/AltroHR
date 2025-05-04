const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Example route (to test server)
app.get('/', (req, res) => {
    res.send('API is running...');
});


module.exports = app;
