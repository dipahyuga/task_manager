const { Connection } = require('pg');

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool ({
    connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
    console.log('Database PostgreSQL terhubung!');
});

pool.on('error', (err) => {
    console.error('Error database:', err);
});

module.exports = pool;