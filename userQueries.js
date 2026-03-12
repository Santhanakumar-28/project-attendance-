const bcrypt = require('bcryptjs');
const db = require('../config/sqlite');
const jwt = require('jsonwebtoken');

const UserQueries = {
  async findByUsername(username) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  async create(userData) {
    return new Promise((resolve, reject) => {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(userData.password, salt);
      
      db.run(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        [userData.username, userData.email, hashedPassword, userData.role || 'admin'],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...userData });
        }
      );
    });
  },

  async findById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT id, username, email, role FROM users WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  async matchPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
};

module.exports = UserQueries;
