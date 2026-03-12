const bcrypt = require('bcryptjs');
const db = require('../config/sqlite');

async function seedAdmin() {
  const username = 'admin';
  const email = 'admin@example.com';
  const password = 'admin123';
  
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  
  db.run(
    'INSERT OR IGNORE INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
    [username, email, hashedPassword, 'admin'],
    function(err) {
      if (err) {
        console.error('Seed error:', err);
      } else {
        console.log(`Admin user ${username} (password: ${password}) seeded (or already exists)`);
      }
      db.close();
      process.exit(0);
    }
  );
}

seedAdmin();
