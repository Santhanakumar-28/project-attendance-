const db = require('../config/sqlite');

const TeamMemberQueries = {
  async findAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM team_members ORDER BY registerNumber', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  async findByRegisterNumber(registerNumber) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM team_members WHERE registerNumber = ?', [registerNumber], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  async create(memberData) {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO team_members (name, registerNumber, section, email, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
        [memberData.name, memberData.registerNumber, memberData.section, memberData.email, memberData.phone, memberData.role],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...memberData });
        }
      );
    });
  },

  async findById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM team_members WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  async update(id, updateData) {
    return new Promise((resolve, reject) => {
      const fields = Object.keys(updateData);
      const values = fields.map(field => updateData[field]);
      values.push(id);
      
      const setClause = fields.map(field => `${field} = ?`).join(', ');
      db.run(`UPDATE team_members SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, values, function(err) {
        if (err) reject(err);
        else resolve(this.changes > 0);
      });
    });
  },

  async delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM team_members WHERE id = ?', [id], function(err) {
        if (err) reject(err);
        else resolve(this.changes > 0);
      });
    });
  },

  async count() {
    return new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM team_members', (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });
  }
};

module.exports = TeamMemberQueries;
