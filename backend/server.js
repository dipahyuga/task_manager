const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 8080;

// middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      success: true,
      message: 'Koneksi ke Database PostgreSQL Berhasil!',
      time: result.rows[0].now
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});
 
// route testing
app.get('/', (req, res) => {
    res.send('API sudah jalan')
});

// menjalankan server
app.listen(PORT, () => {
    console.log(`server : http://localhost:${PORT}`);
});