import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Create a connection pool for better performance
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'sadhaka_admin',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection
pool.getConnection()
  .then(conn => {
    console.log('✅ MySQL connection pool created successfully');
    conn.release();
  })
  .catch(err => {
    console.warn('⚠️ MySQL connection failed:', err.message);
  });

export async function query(sql, values) {
  try {
    const [results] = await pool.execute(sql, values);
    return results;
  } catch (error) {
    console.error('❌ Database query error:', error);
    throw error;
  }
}

export async function getConnection() {
  return await pool.getConnection();
}

export default pool;
