import { useState, useEffect } from 'react';
import '../Project/styles.css';

export default function CreateProject({ onProjectCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const token = localStorage.getItem('token');
    // console.log('Token:', token);

    if (!token) {
      setError('Unauthorized. Please login again.');
      return;
    }

    try {
      const res = await fetch('https://task-tracker-5bhi.vercel.app/api/projects/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to create project.');
      }

      setSuccess('Project created successfully!');
      setName('');
      setDescription('');
      if (onProjectCreated) onProjectCreated(data.project); // callback
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('');
      }, 2000); // 2 seconds
  
      return () => clearTimeout(timer); // Cleanup on unmount or re-trigger
    }
  }, [success]);

  return (
    <div className="create-project">
      <h3>Create New Project</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <textarea
          placeholder="Project Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Project'}
        </button>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </form>
    </div>
  );
}