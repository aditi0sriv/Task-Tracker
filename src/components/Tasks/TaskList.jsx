import React from 'react';
import '../Tasks/TaskList.css';

const TaskList = ({
    tasks,
    editingTaskId,
    editTitle,
    editDescription,
    editStatus,
    statusOptions,
    handleUpdateTask,
    startEditing,
    setEditingTaskId,
    setEditTitle,
    setEditDescription,
    setEditStatus,
    handleDeleteTask
}) => {
    if (tasks.length === 0) {
        return <p>No tasks yet. Create a new task to get started!</p>;
    }

    return (
        <div className="task-list-scroll">
            {tasks.map((task) =>
                editingTaskId === task._id ? (
                    <div key={task._id} className="task-card">
                        <form onSubmit={handleUpdateTask}>
                            <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                required
                            />
                            <textarea
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                required
                            />
                            <select
                                value={editStatus}
                                onChange={(e) => setEditStatus(e.target.value)}
                            >
                                {statusOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <div className="task-actions">
                                <button type="submit">Save</button>
                                <button type="button" onClick={() => setEditingTaskId(null)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div key={task._id} className="task-card">
                        <h4>{task.title}</h4>
                        <p>{task.description}</p>
                        <p>Status: {task.status}</p>
                        <div className="task-actions">
                            <button onClick={() => startEditing(task)}>Edit</button>
                            <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
                        </div>
                    </div>
                )
            )}
        </div>
    );
};

export default TaskList;