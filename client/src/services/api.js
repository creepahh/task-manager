import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const register = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
};

const login = async (userData) => {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;
};

const getTasks = async (token) => {
    const response = await axios.get(`${API_URL}/tasks`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

const addTask = async (taskData, token) => {
    const response = await axios.post(`${API_URL}/tasks`, taskData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

const deleteTask = async (taskId, token) => {
    const response = await axios.delete(`${API_URL}/tasks/${taskId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Assigning the object to a variable before exporting
const api = {
    register,
    login,
    getTasks,
    addTask,
    deleteTask,
};

export default api;
