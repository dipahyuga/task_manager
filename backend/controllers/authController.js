const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const userExitst = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExitst.rows.length > 0) {
            return res.status(400).json({ message: 'email sudah terdaftar'});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
            [username, email, hashedPassword]
        );

        res.status(201).json({
            success: true,
            message: 'User berhasil daftar',
            user: newUser.rows[0]
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

const login = async (req, res) => {
    const { email, password  } = req.body;
    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'Email atau password salah' });
        }

        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Email atau password salah' });
        }

        const token = jwt.sign (
            {id: user.rows[0].id},
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            success: true,
            message: 'Login Berhasil',
            token,
            user: {
                id: user.rows[0].id,
                username: user.rows[0].username,
                email: user.rows[0].email
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    };
}

module.exports = { register, login };