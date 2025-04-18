const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const task = require('./routes/task');


const sequelize = require('./config/db');
const User = require('./models/User');
const Task = require('./models/Task');
const authRoutes = require('./routes/auth');


const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/api', authRoutes);
app.use('/api/tasks', task);




const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
    console.log('Database connected & synced');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
