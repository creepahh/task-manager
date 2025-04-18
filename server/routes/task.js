const express = require('express');
const Task = require('../models/Task');
const verifyToken = require('../middleware/jwt');

const router = express.Router();


router.get('/', verifyToken, async (req, res) => {
    try {
        const tasks = await Task.findAll({ where: { userId: req.user.id } });
        res.json({ tasks });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch tasks.' });
    }
});

//add new
router.post('/', verifyToken, async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({ message: 'Title and description are required.' });
    }

    try {
        const task = await Task.create({ title, description, userId: req.user.id });
        res.status(201).json({ task });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to add task.' });
    }
});

// edit 
router.put('/:taskId', verifyToken, async (req, res) => {
    const { taskId } = req.params;
    const { title, description } = req.body;

    if (!title && !description) {
        return res.status(400).json({ message: 'At least one field (title or description) is required to update.' });
    }

    try {
        const task = await Task.findOne({ where: { id: taskId, userId: req.user.id } });
        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }
        task.title = title || task.title;
        task.description = description || task.description;
        await task.save();

        res.json({ task });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update task.' });
    }
});

//delete
router.delete('/:taskId', verifyToken, async (req, res) => {
    const { taskId } = req.params;

    try {
        console.log('Attempting to delete task with ID:', taskId); // Debug log
        const task = await Task.findOne({ where: { id: taskId, userId: req.user.id } });
        if (!task) {
            console.log('Task not found for ID:', taskId, 'and User ID:', req.user.id); //  log
            return res.status(404).json({ message: 'Task not found.' });
        }

        await task.destroy();
        console.log('Task deleted successfully:', taskId); // justlog
        res.json({ message: 'Task deleted successfully.' });
    } catch (err) {
        console.error('Error deleting task:', err);
        res.status(500).json({ message: 'Failed to delete task.' });
    }
});

module.exports = router;