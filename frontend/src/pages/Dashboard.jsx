import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = ({ token, handleLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data.tasks);
    } catch (err) {
      console.error("Gagal mengambil tugas", err);
    }
  };


  useEffect(() => {
    fetchTasks();
  }, []);


  const addTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/tasks', 
        { title }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle(''); 
      fetchTasks(); 
    } catch (err) {
      alert("Gagal menambah tugas");
    }
  };

  const deleteTask = async (id) => {
  if (window.confirm("Yakin ingin menghapus tugas ini?")) {
    try {
      await axios.delete(`http://localhost:8080/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks(); 
    } catch (err) {
      alert("Gagal menghapus tugas");
    }
  }
};

const toggleStatus = async (task) => {
  const newStatus = task.status === 'todo' ? 'done' : 'todo';
  try {
    await axios.put(`http://localhost:8080/api/tasks/${task.id}`, 
      { ...task, status: newStatus }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchTasks(); 
  } catch (err) {
    alert("Gagal mengubah status");
  }
};

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">Logout</button>
      </div>


      <form onSubmit={addTask} className="flex gap-2 mb-8">
        <input 
          type="text" 
          className="flex-1 border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          placeholder="Apa yang ingin kamu kerjakan hari ini?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Tambah</button>
      </form>


      <div className="space-y-4">
        {tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition">
                <div className="flex items-center gap-3">
             
                <input 
                    type="checkbox" 
                    checked={task.status === 'done'} 
                    onChange={() => toggleStatus(task)}
                    className="w-5 h-5 cursor-pointer"
                />
                <div>
                    <h3 className={`font-semibold ${task.status === 'done' ? 'line-through text-gray-400' : ''}`}>
                    {task.title}
                    </h3>
                    <p className="text-xs text-gray-500">Dibuat: {new Date(task.created_at).toLocaleDateString()}</p>
                </div>
                </div>
                <button 
                onClick={() => deleteTask(task.id)}
                className="text-red-500 hover:text-red-700 font-medium text-sm"
                >
                Hapus
                </button>
            </div>
            ))}
      </div>
    </div>
  );
};


export default Dashboard;
