require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { pool } = require('../config/database');

async function runMigrations() {
  console.log('Running migrations...');
  
  const connection = await pool.getConnection();
  
  try {
    // Create migrations table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Get list of executed migrations
    const [executedMigrations] = await connection.execute('SELECT name FROM migrations');
    const executedMigrationNames = executedMigrations.map(row => row.name);
    
    // Get all migration files
    const migrationsDir = path.join(__dirname, '../db/migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.js'))
      .sort(); // Ensure migrations run in the correct order
    
    // Run migrations that haven't been executed yet
    for (const migrationFile of migrationFiles) {
      if (!executedMigrationNames.includes(migrationFile)) {
        console.log(`Executing migration: ${migrationFile}`);
        
        const migration = require(path.join(migrationsDir, migrationFile));
        await migration.up(connection);
        
        // Record the migration
        await connection.execute(
          'INSERT INTO migrations (name) VALUES (?)',
          [migrationFile]
        );
        
        console.log(`Migration ${migrationFile} completed successfully`);
      } else {
        console.log(`Migration ${migrationFile} already executed, skipping`);
      }
    }
    
    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  } finally {
    connection.release();
  }
}

// Run migrations when the script is executed directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('Migration process completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('Migration process failed:', error);
      process.exit(1);
    });
}

module.exports = runMigrations; 