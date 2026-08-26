import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard = ({ token }) => {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState({ title: '', description: '' });
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [error, setError] = useState('');
    const [loadingTasks, setLoadingTasks] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [deletingTaskId, setDeletingTaskId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchTasks = async () => {
            setLoadingTasks(true);
            setError('');
            try {
                const response = await api.getTasks(token);
                setTasks(response.tasks || []);
            } catch (err) {
                console.error('Error fetching tasks:', err);
                if (err.response && err.response.status === 401) {
                    setError('Your session has expired. Please log in again.');
                    localStorage.removeItem('token');
                    navigate('/login');
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
        setError('');

        try {
            setSubmitting(true);

            if (editingTaskId) {
                await api.updateTask(editingTaskId, task, token);
                setTasks(
                    tasks.map((t) =>
                        t.id === editingTaskId ? { ...t, title: task.title, description: task.description } : t
                    )
                );
                setEditingTaskId(null);
            } else {
                const newTask = await api.addTask(task, token);
                setTasks([...tasks, newTask.task]);
            }

            setTask({ title: '', description: '' });
        } catch (err) {
            setError('Failed to save task. Please try again later.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditTask = (taskId) => {
        const taskToEdit = tasks.find((t) => t.id === taskId);
        if (!taskToEdit) {
            setError('Task not found in the current list.');
            return;
        }
        setTask({ title: taskToEdit.title, description: taskToEdit.description });
        setEditingTaskId(taskId);
        setError('');
    };

    const handleCancelEdit = () => {
        setEditingTaskId(null);
        setTask({ title: '', description: '' });
    };

    const handleDeleteTask = async (taskId) => {
        try {
            setDeletingTaskId(taskId);
            await api.deleteTask(taskId, token);
            setTasks(tasks.filter((t) => t.id !== taskId));
        } catch (err) {
            console.error('Error deleting task:', err);
            setError('Failed to delete task. Please try again later.');
        } finally {
            setDeletingTaskId(null);
        }
    };

    return (
        <div>
            <div className="dashboard-header">
                <h2>My Tasks</h2>
            </div>

            {error && <div className="error">{error}</div>}

            <div className="task-form-card">
                <h3>{editingTaskId ? 'Edit task' : 'New task'}</h3>
                <div className="form-group">
                    <label htmlFor="task-title">Title</label>
                    <input
                        id="task-title"
                        type="text"
                        value={task.title}
                        onChange={(e) => setTask({ ...task, title: e.target.value })}
                        placeholder="What needs to be done?"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="task-desc">Description</label>
                    <textarea
                        id="task-desc"
                        value={task.description}
                        onChange={(e) => setTask({ ...task, description: e.target.value })}
                        placeholder="Add some details..."
                    />
                </div>
                <div className="task-form-actions">
                    <button
                        className="btn btn-primary"
                        onClick={handleAddOrUpdateTask}
                        disabled={submitting || !task.title || !task.description}
                    >
                        {submitting
                            ? 'Saving...'
                            : editingTaskId
                                ? 'Save changes'
                                : 'Add task'}
                    </button>
                    {editingTaskId && (
                        <button className="btn btn-outline" onClick={handleCancelEdit}>
                            Cancel
                        </button>
                    )}
                </div>
            </div>

            {loadingTasks ? (
                <div className="loading">Loading tasks...</div>
            ) : tasks.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">&#128203;</div>
                    <p>No tasks yet. Add one above to get started.</p>
                </div>
            ) : (
                <ul className="task-list">
                    {tasks.map((t) => (
                        <li key={t.id} className="task-card">
                            <div className="task-card-header">
                                <h3>{t.title}</h3>
                                <div className="task-card-actions">
                                    <button
                                        className="btn btn-ghost btn-icon"
                                        onClick={() => handleEditTask(t.id)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-danger-ghost btn-icon"
                                        onClick={() => handleDeleteTask(t.id)}
                                        disabled={deletingTaskId === t.id}
                                    >
                                        {deletingTaskId === t.id ? '...' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                            <p>{t.description}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dashboard;
