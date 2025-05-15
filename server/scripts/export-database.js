require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { pool } = require('../config/database');

/**
 * Export all tables and their data to a SQL file
 */
async function exportDatabase() {
  console.log('Starting database export...');
  
  // Create a timestamp for the filename
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outputFile = path.join(__dirname, '..', '..', `habitvault_export_${timestamp}.sql`);
  
  // Create a write stream for the output file
  const outputStream = fs.createWriteStream(outputFile);
  
  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();
    console.log('Connected to the database');
    
    // Write header to the SQL file
    outputStream.write(`-- HabitVault Database Export\n`);
    outputStream.write(`-- Generated on ${new Date().toISOString()}\n\n`);
    outputStream.write(`-- Disable foreign key checks to avoid issues with constraints during import\n`);
    outputStream.write(`SET FOREIGN_KEY_CHECKS = 0;\n\n`);
    
    // Get all tables in the database
    const [tables] = await connection.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = ?
      ORDER BY table_name
    `, [process.env.DB_NAME || 'habitvault']);
    
    console.log(`Found ${tables.length} tables to export`);
    
    // Export each table
    for (const table of tables) {
      const tableName = table.table_name || table.TABLE_NAME;
      console.log(`Exporting table: ${tableName}`);
      
      // Get table structure
      const [createTable] = await connection.query(`SHOW CREATE TABLE ${tableName}`);
      const createTableStatement = createTable[0]['Create Table'] || createTable[0]['CREATE TABLE'];
      
      // Write table structure to the SQL file
      outputStream.write(`-- Table structure for table \`${tableName}\`\n`);
      outputStream.write(`DROP TABLE IF EXISTS \`${tableName}\`;\n`);
      outputStream.write(`${createTableStatement};\n\n`);
      
      // Get table data
      const [rows] = await connection.query(`SELECT * FROM ${tableName}`);
      
      if (rows.length > 0) {
        // Write table data to the SQL file
        outputStream.write(`-- Data for table \`${tableName}\`\n`);
        
        // Generate INSERT statements in batches to avoid memory issues
        const batchSize = 100;
        for (let i = 0; i < rows.length; i += batchSize) {
          const batch = rows.slice(i, i + batchSize);
          
          // Start the INSERT statement
          outputStream.write(`INSERT INTO \`${tableName}\` VALUES\n`);
          
          // Add each row
          const rowValues = batch.map(row => {
            // Convert row object to array of values
            const values = Object.values(row).map(value => {
              if (value === null) {
                return 'NULL';
              } else if (typeof value === 'string') {
                // Escape single quotes and backslashes
                return `'${value.replace(/'/g, "''").replace(/\\/g, "\\\\")}'`;
              } else if (value instanceof Date) {
                return `'${value.toISOString().slice(0, 19).replace('T', ' ')}'`;
              } else if (typeof value === 'boolean') {
                return value ? '1' : '0';
              } else {
                return value;
              }
            });
            
            return `(${values.join(', ')})`;
          });
          
          // Write the values and end the INSERT statement
          outputStream.write(rowValues.join(',\n') + ';\n\n');
        }
      } else {
        outputStream.write(`-- Table \`${tableName}\` has no data\n\n`);
      }
    }
    
    // Write footer to the SQL file
    outputStream.write(`-- Re-enable foreign key checks\n`);
    outputStream.write(`SET FOREIGN_KEY_CHECKS = 1;\n\n`);
    outputStream.write(`-- End of export\n`);
    
    // Release the connection
    connection.release();
    
    // Close the output stream
    outputStream.end();
    
    console.log(`Database export completed successfully`);
    console.log(`SQL file saved to: ${outputFile}`);
    
  } catch (error) {
    console.error('Error exporting database:', error);
    outputStream.end();
  } finally {
    // Exit the process
    process.exit();
  }
}

// Run the export function
exportDatabase();
