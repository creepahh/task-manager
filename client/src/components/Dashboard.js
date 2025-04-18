import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../App.css';

const Dashboard = ({ token }) => {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState({ title: '', description: '' });
    const [editingTaskId, setEditingTaskId] = useState(null); // Track the task being edited
    const [error, setError] = useState('');
    const [loadingTasks, setLoadingTasks] = useState(false);
    const [loadingAddTask, setLoadingAddTask] = useState(false);
    const [deletingTaskId, setDeletingTaskId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login'); // Redirect to login if no token
            return;
        }

        const fetchTasks = async () => {
            setLoadingTasks(true);
            setError(''); //  previous error messages
            try {
                const response = await api.getTasks(token);
                setTasks(response.tasks || []);
            } catch (err) {
                console.error('Error fetching tasks:', err);
                if (err.response && err.response.status === 401) {
                    setError('Your session has expired. Please log in again.');
                    localStorage.removeItem('token'); // remove token from localStorage
                    navigate('/login'); // 
                } else {
                    setError('Failed to fetch tasks. Please try again later.');
                }
            } finally {
                setLoadingTasks(false);
            }
        };

        fetchTasks();
    }, [token, navigate]);

    const handleAddOrUpdateTask = async () => {
        if (!task.title || !task.description) {
            setError('Please fill in both the title and description.');
            return;
        }
        setError(''); // Clear error before making the request

        try {
            setLoadingAddTask(true);

            if (editingTaskId) {
                await api.updateTask(editingTaskId, task, token);
                setTasks(
                    tasks.map((t) =>
                        t.id === editingTaskId ? { ...t, title: task.title, description: task.description } : t
                    )
                );
                setEditingTaskId(null); // Clear editing state
            } else {

                const newTask = await api.addTask(task, token);
                setTasks([...tasks, newTask.task]);
            }

            setTask({ title: '', description: '' }); // Clear the form
        } catch (err) {
            setError('Failed to save task. Please try again later.');
        } finally {
            setLoadingAddTask(false);
        }
    };

    const handleEditTask = (taskId) => {
        console.log('Editing Task ID:', taskId); // just log
        const taskToEdit = tasks.find((task) => task.id === taskId);
        if (!taskToEdit) {
            setError('Task not found in the current list.');
            return;
        }
        setTask({ title: taskToEdit.title, description: taskToEdit.description });
        setEditingTaskId(taskId); // task ID being edited
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm('Are you sure you want to delete this task?')) {
            return;
        }
        console.log('Deleting Task ID:', taskId);
        setDeletingTaskId(taskId); // task ID being deleted
        try {
            console.log(`URL:${API_URL}/tasks/${taskId}`); // just log
            console.log('Token:', token); // just log
            const response = await api.deleteTask(taskId, token);
            console.log('Delete Response:', response);
            setTasks(tasks.filter((task) => task.id !== taskId));
        } catch (err) {
            console.error('Error deleting task:', err);
            setError('Failed to delete task. Please try again later.');
        } finally {
            setDeletingTaskId(null); // Clear the deleting task ID
        }
    };

    return (
        <div className="dashboard">
            <h2>Your Tasks</h2>
            {error && <p className="error">{error}</p>}
            {!token ? (
                <p>Please log in to manage your tasks.</p>
            ) : (
                <>
                    <div className="form-box">
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
                        <button
                            onClick={handleAddOrUpdateTask}
                            disabled={loadingAddTask || !task.title || !task.description}
                        >
                            {editingTaskId ? (loadingAddTask ? 'Saving...' : 'Save') : (loadingAddTask ? 'Adding...' : 'Add Task')}
                        </button>
                    </div>
                    {loadingTasks ? (
                        <p>Loading tasks...</p>
                    ) : tasks.length === 0 ? (
                        <div className="empty-state">No tasks available</div>
                    ) : (
                        <ul className="task-list">
                            {tasks.map((task) => (
                                <li key={task.id} className="task-item">
                                    <h3>{task.title}</h3>
                                    <p>{task.description}</p>
                                    <button onClick={() => handleEditTask(task.id)}>Edit</button>
                                    <button
                                        onClick={() => handleDeleteTask(task.id)}
                                        disabled={deletingTaskId === task.id}
                                    >
                                        {deletingTaskId === task.id ? 'Deleting...' : 'Delete'}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
};

export default Dashboard;