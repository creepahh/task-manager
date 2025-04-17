// src/components/Dashboard.js
import { useState, useEffect } from 'react';
import api from '../services/api';

const Dashboard = ({ token }) => {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState({ title: '', description: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await api.getTasks(token);
                setTasks(response.tasks);
            } catch (err) {
                setError('Failed to fetch tasks');
            }
        };
        if (token) fetchTasks();
    }, [token]);

    const handleAddTask = async () => {
        try {
            const response = await api.addTask(task, token);
            setTasks([...tasks, response.task]);
            setTask({ title: '', description: '' });
        } catch (err) {
            setError('Failed to add task');
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await api.deleteTask(taskId, token);
            setTasks(tasks.filter((task) => task.id !== taskId));
        } catch (err) {
            setError('Failed to delete task');
        }
    };

    return (
        <div>
            <h2>Your Tasks</h2>
            <div>
                <input
                    type="text"
                    value={task.title}
                    onChange={(e) => setTask({ ...task, title: e.target.value })}
                    placeholder="Task Title"
                />
                <textarea
                    value={task.description}
                    onChange={(e) => setTask({ ...task, description: e.target.value })}
                    placeholder="Task Description"
                />
                <button onClick={handleAddTask}>Add Task</button>
            </div>
            {error && <p>{error}</p>}
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        <p>{task.title}</p>
                        <p>{task.description}</p>
                        <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
