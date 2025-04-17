import React from 'react';

const TaskList = ({ tasks }) => {
    if (!tasks || tasks.length === 0) {
        return <div>No tasks available</div>;
    }

    return (
        <div>
            <h2>Your Tasks</h2>
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>{task.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default TaskList;
