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
        console.log('User ID:', req.user.id); // Log the user ID
        const task = await Task.create({ title, description, UserId: req.user.id });
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

    try {
        const task = await Task.findOne({ where: { id: taskId } });
        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        if (title) task.title = title;
        if (description) task.description = description;

        await task.save();
        res.status(200).json({ message: 'Task updated successfully.', task });
    } catch (err) {
        console.error('Error updating task:', err);
        res.status(500).json({ message: 'Failed to update task.' });
    }
});


//delete
router.delete('/:taskId', verifyToken, async (req, res) => {
    const { taskId } = req.params;

    try {
        const task = await Task.findOne({ where: { id: taskId, userId: req.user.id } });
        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        await task.destroy();
        res.status(200).json({ message: 'Task deleted successfully.' });
    } catch (err) {
        console.error('Error deleting task:', err);
        res.status(500).json({ message: 'Failed to delete task.' });
    }
});

module.exports = router;