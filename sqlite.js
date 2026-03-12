const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../attendance.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('SQLite connection error:', err.message);
  } else {
    console.log('Connected to SQLite database at', dbPath);
  }
});

// Initialize tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // TeamMembers table
  db.run(`CREATE TABLE IF NOT EXISTS team_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    registerNumber TEXT UNIQUE NOT NULL,
    section TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    role TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Attendance records table
  db.run(`CREATE TABLE IF NOT EXISTS attendance_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    registerNumber TEXT NOT NULL,
    section TEXT NOT NULL,
    date TEXT NOT NULL,
    day INTEGER NOT NULL,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    p1 TEXT DEFAULT 'A',
    p2 TEXT DEFAULT 'A',
    p3 TEXT DEFAULT 'A',
    p4 TEXT DEFAULT 'A',
    p5 TEXT DEFAULT 'A',
    p6 TEXT DEFAULT 'A',
    p7 TEXT DEFAULT 'A',
    p8 TEXT DEFAULT 'A',
    totalPresentPeriods INTEGER DEFAULT 0,
    totalAbsentPeriods INTEGER DEFAULT 8,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(member_id, date),
    FOREIGN KEY (member_id) REFERENCES team_members(id)
  )`);

  // Trigger for calculating totals
  db.run(`CREATE TRIGGER IF NOT EXISTS calculate_totals
    BEFORE INSERT ON attendance_records
    FOR EACH ROW
    BEGIN
      UPDATE attendance_records SET
        totalPresentPeriods = (
          (CASE WHEN NEW.p1 = 'P' THEN 1 ELSE 0 END) +
          (CASE WHEN NEW.p2 = 'P' THEN 1 ELSE 0 END) +
          (CASE WHEN NEW.p3 = 'P' THEN 1 ELSE 0 END) +
          (CASE WHEN NEW.p4 = 'P' THEN 1 ELSE 0 END) +
          (CASE WHEN NEW.p5 = 'P' THEN 1 ELSE 0 END) +
          (CASE WHEN NEW.p6 = 'P' THEN 1 ELSE 0 END) +
          (CASE WHEN NEW.p7 = 'P' THEN 1 ELSE 0 END) +
          (CASE WHEN NEW.p8 = 'P' THEN 1 ELSE 0 END)
        ),
        totalAbsentPeriods = 8 - (
          (CASE WHEN NEW.p1 = 'P' THEN 1 ELSE 0 END) +
          (CASE WHEN NEW.p2 = 'P' THEN 1 ELSE 0 END) +
          (CASE WHEN NEW.p3 = 'P' THEN 1 ELSE 0 END) +
          (CASE WHEN NEW.p4 = 'P' THEN 1 ELSE 0 END) +
          (CASE WHEN NEW.p5 = 'P' THEN 1 ELSE 0 END) +
          (CASE WHEN NEW.p6 = 'P' THEN 1 ELSE 0 END) +
          (CASE WHEN NEW.p7 = 'P' THEN 1 ELSE 0 END) +
          (CASE WHEN NEW.p8 = 'P' THEN 1 ELSE 0 END)
        )
      WHERE id = NEW.id;
    END`);
});

module.exports = db;
