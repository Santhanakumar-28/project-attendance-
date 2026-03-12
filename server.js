const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const sqliteDB = require('./config/sqlite'); // SQLite already initialized

dotenv.config();
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'my-super-secret-jwt-key-2024-complete-fallback-no-env-needed';
}

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
});
if (process.env.NODE_ENV !== 'development') {
  app.use('/api/', limiter);
}

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/members', require('./routes/memberRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));

const PORT = process.env.PORT || 5000;

console.log('SQLite migration complete - Backend ready with SQLite!');

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});