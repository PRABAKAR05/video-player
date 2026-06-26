const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db');

const initDb = async () => {
  try {
    const schemaPath = path.join(__dirname, '../models/schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Running schema setup...');
    await pool.query(sql);
    console.log('Database schema created successfully.');
    
  } catch (error) {
    console.error('Error setting up database schema:', error);
  } finally {
    pool.end();
  }
};

initDb();
