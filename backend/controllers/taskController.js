const pool = require('../config/db');

const createTask = async (req, res) => {
    const { title, description, due_date } = req.body;
    const userId = req.user.id;

    try {
        const newTask = await pool.query (
            'INSERT INTO tasks (user_id, title, description, due_date) VALUES ($1, $2, $3, $4) RETURNING *',
             [userId, title, description, due_date]
        );
        res.status(201).json({
            success: true,
            message: 'Tugas berhasil dibuat!',
            task: newTask.rows[0]
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, error: err.message });
    }
};

const getTasks = async (req, res) => {
    const userId = req.user.id;
    try {
        const tasks = await pool.query(
            'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        res.json({ success: true, tasks: tasks.rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, status, due_date } = req.body;
    const user_id = req.user.id;

    try {
        const updateTask = await pool.query(
            'UPDATE tasks SET title = $1, description = $2, status = $3, due_date = $4 WHERE id = $5 AND user_id = $6 RETURNING *',
            [title, description, status, due_date, id, user_id]
        );

        if (updateTask.rows.length === 0) {
            return res.status(404).json({ message: 'tugas tidak ditemukan' })
        }

        res.json({ success: true, message: 'tugas diperbarui', task: updateTask.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteTask = async (req, res) => {
    const {id} = req.params;
    const userId = req.user.id;

    try {
        const result = await pool.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2', [id, userId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'tugas tidak ditemukan' });
        }

        res.json({ success: true, message: 'tugas berhasil dihapus' })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}

module.exports = {createTask, getTasks, updateTask, deleteTask};
