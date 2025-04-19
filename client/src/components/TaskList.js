import React from 'react';

const TaskList = ({ tasks, handleEdit, handleDelete }) => {
    if (!tasks || tasks.length === 0) {
        return <div className="empty-state">No tasks available</div>;
    }

    return (
        <div>
            <h2>Your Tasks</h2>
            <ul className="task-list">
                {tasks.map((task) => (
                    <li key={task.id} className="task-item">
                        <h3>{task.name}</h3>
                        <p>{task.description}</p>
                        <button onClick={() => handleEdit(task.id)}>Edit</button>
                        <button onClick={() => handleDelete(task.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskList;