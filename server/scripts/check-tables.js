require('dotenv').config();
const { pool } = require('../config/database');

async function checkTables() {
  try {
    // Connect to the database
    const connection = await pool.getConnection();
    console.log('Connected to the database');

    // Check if the users table exists
    const [tables] = await connection.query('SHOW TABLES');
    console.log('Tables in the database:');
    tables.forEach(table => {
      console.log(Object.values(table)[0]);
    });

    // If users table exists, check its structure
    const [usersExists] = await connection.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = ? AND table_name = 'users'
    `, [process.env.DB_NAME]);

    if (usersExists[0].count > 0) {
      console.log('\nUsers table exists, checking structure:');
      const [columns] = await connection.query('DESCRIBE users');
      columns.forEach(column => {
        console.log(`${column.Field}: ${column.Type} ${column.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
      });
    } else {
      console.log('\nUsers table does not exist!');
    }

    connection.release();
  } catch (error) {
    console.error('Error checking tables:', error);
  } finally {
    process.exit();
  }
}

checkTables();
