import React from 'react';

const TaskList = ({ tasks, handleEdit, handleDelete, deletingTaskId }) => {
    if (!tasks || tasks.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">&#128203;</div>
                <p>No tasks yet. Add one above to get started.</p>
            </div>
        );
    }

    return (
        <ul className="task-list">
            {tasks.map((task) => (
                <li key={task.id} className="task-card">
                    <div className="task-card-header">
                        <h3>{task.title}</h3>
                        <div className="task-card-actions">
                            <button
                                className="btn btn-ghost btn-icon"
                                onClick={() => handleEdit(task.id)}
                            >
                                Edit
                            </button>
                            <button
                                className="btn btn-danger-ghost btn-icon"
                                onClick={() => handleDelete(task.id)}
                                disabled={deletingTaskId === task.id}
                            >
                                {deletingTaskId === task.id ? '...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                    <p>{task.description}</p>
                </li>
            ))}
        </ul>
    );
};

export default TaskList;
