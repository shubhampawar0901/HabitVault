require('dotenv').config();
const { pool } = require('../config/database');

async function updateSchema() {
  try {
    // Connect to the database
    const connection = await pool.getConnection();
    console.log('Connected to the database');

    // Check if the users table has a username column
    const [usernameColumnExists] = await connection.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.columns 
      WHERE table_schema = ? AND table_name = 'users' AND column_name = 'username'
    `, [process.env.DB_NAME]);

    if (usernameColumnExists[0].count === 0) {
      console.log('Adding username column to users table...');
      await connection.query(`
        ALTER TABLE users 
        ADD COLUMN username VARCHAR(50) NOT NULL AFTER id,
        ADD UNIQUE INDEX username_idx (username)
      `);
      console.log('Username column added successfully');
    } else {
      console.log('Username column already exists');
    }

    // Check if the users table has a password_hash column
    const [passwordHashColumnExists] = await connection.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.columns 
      WHERE table_schema = ? AND table_name = 'users' AND column_name = 'password_hash'
    `, [process.env.DB_NAME]);

    if (passwordHashColumnExists[0].count === 0) {
      console.log('Renaming password column to password_hash...');
      await connection.query(`
        ALTER TABLE users 
        CHANGE COLUMN password password_hash VARCHAR(100) NOT NULL
      `);
      console.log('Password column renamed successfully');
    } else {
      console.log('Password_hash column already exists');
    }

    // Check if the users table has a role column
    const [roleColumnExists] = await connection.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.columns 
      WHERE table_schema = ? AND table_name = 'users' AND column_name = 'role'
    `, [process.env.DB_NAME]);

    if (roleColumnExists[0].count === 0) {
      console.log('Adding role column to users table...');
      await connection.query(`
        ALTER TABLE users 
        ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user' AFTER email
      `);
      console.log('Role column added successfully');
    } else {
      console.log('Role column already exists');
    }

    console.log('\nUpdated users table structure:');
    const [columns] = await connection.query('DESCRIBE users');
    columns.forEach(column => {
      console.log(`${column.Field}: ${column.Type} ${column.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    connection.release();
    console.log('\nSchema update completed successfully');
  } catch (error) {
    console.error('Error updating schema:', error);
  } finally {
    process.exit();
  }
}

updateSchema();
