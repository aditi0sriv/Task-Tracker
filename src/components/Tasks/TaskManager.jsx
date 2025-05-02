import { useEffect, useState } from 'react';
import '../Tasks/TaskManager.css';
import TaskList from './TaskList.jsx';

export default function TaskManager({ projectId }) {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('todo');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editStatus, setEditStatus] = useState('todo');

    const token = localStorage.getItem('token');

    const statusOptions = [
        { label: 'To Do', value: 'todo' },
        { label: 'In Progress', value: 'in progress' },
        { label: 'Completed', value: 'completed' }
    ];

    const fetchTasks = async () => {
        try {
            const res = await fetch(`https://task-tracker-pearl-beta.vercel.app/api/projects/${projectId}/tasks/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Failed to fetch tasks');
            const data = await res.json();
            setTasks(data.tasks);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [projectId]);

    const startEditing = (task) => {
        setEditingTaskId(task._id);
        setEditTitle(task.title);
        setEditDescription(task.description);
        setEditStatus(task.status);
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const res = await fetch(`https://task-tracker-pearl-beta.vercel.app/api/projects/${projectId}/tasks/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title, description, status }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message);
            }

            const data = await res.json();
            setTasks((prev) => [...prev, data.task]);
            setSuccess('Task created!');
            setTitle('');
            setDescription('');
            setStatus('todo');
        } catch (err) {
            setError(err.message || 'Something went wrong');
        }
    };

    const handleUpdateTask = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const res = await fetch(`https://task-tracker-pearl-beta.vercel.app/api/projects/${projectId}/tasks/${editingTaskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: editTitle,
                    description: editDescription,
                    status: editStatus,
                }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message);
            }

            const updatedTask = await res.json();
            setTasks((prev) =>
                prev.map((task) => (task._id === editingTaskId ? updatedTask.task : task))
            );
            setSuccess('Task updated!');
            setEditingTaskId(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteTask = async (taskId) => {
        setError('');
        setSuccess('');
        try {
            const res = await fetch(`https://task-tracker-pearl-beta.vercel.app/api/projects/${projectId}/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message);
            }

            setTasks((prev) => prev.filter((task) => task._id !== taskId));
            setSuccess('Task deleted!');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className='create-task'>
            <h3>Create a New Task</h3>
            <form onSubmit={handleCreateTask}>
                <div className="form-top-row">
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                <div className='select-status'>
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        {statusOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>

                    <button type="submit">Create Task</button>
                </div>

            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}

            {/* <h3>Tasks</h3>
            {tasks.length === 0 ? (
                <p>No tasks yet. Create a new task to get started!</p>
            ) : (
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {tasks.map((task) =>
                        editingTaskId === task._id ? (
                            <div
                                key={task._id}
                                style={{
                                    border: '1px solid #ccc',
                                    marginBottom: '0.5rem',
                                    padding: '0.25rem 0.5rem',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.2'
                                }}
                            >
                                <form onSubmit={handleUpdateTask}>
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        required
                                        style={{ marginBottom: '0.25rem', width: '100%' }}
                                    />
                                    <textarea
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                        required
                                        style={{ marginBottom: '0.25rem', width: '100%' }}
                                    />
                                    <select
                                        value={editStatus}
                                        onChange={(e) => setEditStatus(e.target.value)}
                                        style={{ marginBottom: '0.25rem', width: '100%' }}
                                    >
                                        {statusOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                                        <button type="submit">Save</button>
                                        <button type="button" onClick={() => setEditingTaskId(null)}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div
                                key={task._id}
                                style={{
                                    border: '1px solid #ccc',
                                    marginBottom: '0.5rem',
                                    padding: '0.25rem 0.5rem',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.2'
                                }}
                            >
                                <h4 style={{ margin: '0.25rem 0' }}>{task.title}</h4>
                                <p style={{ margin: '0.25rem 0' }}>{task.description}</p>
                                <p style={{ margin: '0.25rem 0' }}>Status: {task.status}</p>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    <button onClick={() => startEditing(task)}>Edit</button>
                                    <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
                                </div>
                            </div>
                        )
                    )}
                </div>
            )} */}


            <h3>Tasks</h3>
            <div className="task-list-wrapper">
                <TaskList
                    tasks={tasks}
                    editingTaskId={editingTaskId}
                    editTitle={editTitle}
                    editDescription={editDescription}
                    editStatus={editStatus}
                    statusOptions={statusOptions}
                    handleUpdateTask={handleUpdateTask}
                    startEditing={startEditing}
                    setEditingTaskId={setEditingTaskId}
                    setEditTitle={setEditTitle}
                    setEditDescription={setEditDescription}
                    setEditStatus={setEditStatus}
                    handleDeleteTask={handleDeleteTask}
                />
            </div>


        </div>
    );
}