const db = require('../config/sqlite');

const AttendanceQueries = {
  async find(query = {}) {
    let sql = 'SELECT * FROM attendance_records';
    const params = [];
    
    const conditions = [];
    if (query.year) {
      conditions.push('year = ?');
      params.push(query.year);
    }
    if (query.month) {
      conditions.push('month = ?');
      params.push(query.month);
    }
    if (query.date) {
      conditions.push('date = ?');
      params.push(query.date);
    }
    
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    sql += ' ORDER BY registerNumber';
    
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  async upsert(memberId, date, periods, memberInfo) {
    return new Promise((resolve, reject) => {
      const [year, month, day] = date.split('-').map(Number);
      
      db.run(
        `INSERT OR REPLACE INTO attendance_records 
         (member_id, name, registerNumber, section, date, day, month, year, p1, p2, p3, p4, p5, p6, p7, p8)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          memberId, memberInfo.name, memberInfo.registerNumber, memberInfo.section,
          date, day, month, year,
          periods.p1 || 'A', periods.p2 || 'A', periods.p3 || 'A', periods.p4 || 'A',
          periods.p5 || 'A', periods.p6 || 'A', periods.p7 || 'A', periods.p8 || 'A'
        ],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, memberId, date });
        }
      );
    });
  },

  async deleteByDate(date) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM attendance_records WHERE date = ?', [date], function(err) {
        if (err) reject(err);
        else resolve({ deleted: this.changes });
      });
    });
  },

  async findByDate(date) {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM attendance_records WHERE date = ? ORDER BY registerNumber', [date], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

async findPresentByDate(date) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT *, 
         (CASE WHEN p1='P' THEN 1 ELSE 0 END +
          CASE WHEN p2='P' THEN 1 ELSE 0 END +
          CASE WHEN p3='P' THEN 1 ELSE 0 END +
          CASE WHEN p4='P' THEN 1 ELSE 0 END +
          CASE WHEN p5='P' THEN 1 ELSE 0 END +
          CASE WHEN p6='P' THEN 1 ELSE 0 END +
          CASE WHEN p7='P' THEN 1 ELSE 0 END +
          CASE WHEN p8='P' THEN 1 ELSE 0 END) as totalPresentPeriods
         FROM attendance_records WHERE date = ? AND 
         (p1='P' OR p2='P' OR p3='P' OR p4='P' OR p5='P' OR p6='P' OR p7='P' OR p8='P') ORDER BY registerNumber`, 
        [date], 
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  },

  async findPresentByDateRange(fromDate, toDate) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT name, registerNumber, section,
         COUNT(DISTINCT date) as daysPresent,
         SUM(
           (CASE WHEN p1='P' THEN 1 ELSE 0 END +
            CASE WHEN p2='P' THEN 1 ELSE 0 END +
            CASE WHEN p3='P' THEN 1 ELSE 0 END +
            CASE WHEN p4='P' THEN 1 ELSE 0 END +
            CASE WHEN p5='P' THEN 1 ELSE 0 END +
            CASE WHEN p6='P' THEN 1 ELSE 0 END +
            CASE WHEN p7='P' THEN 1 ELSE 0 END +
            CASE WHEN p8='P' THEN 1 ELSE 0 END)
         ) as totalPeriods
         FROM attendance_records 
         WHERE date BETWEEN ? AND ? AND 
         (p1='P' OR p2='P' OR p3='P' OR p4='P' OR p5='P' OR p6='P' OR p7='P' OR p8='P')
         GROUP BY registerNumber 
         ORDER BY registerNumber`, 
        [fromDate, toDate], 
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }
};

module.exports = AttendanceQueries;

