import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Railway 환경 및 로컬 MySQL 정보를 바탕으로 풀 생성
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;