import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Project/ProjectsList.css';

export default function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');

      try {
        const res = await fetch('https://task-tracker-backend-plum.vercel.app/api/projects/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Response: ", res);
        
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to load projects');
        }

        setProjects(data.projects || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className="projects-list">
      <h3>Your Projects</h3>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {projects.length === 0 && !loading && <p>Create your first project!</p>}

      <div className="projects-grid">
        {projects.map((project) => (
          <div
            className="project-card"
            key={project._id}
            onClick={() => handleProjectClick(project._id)}
          >
            <h4>{project.name}</h4>
            <p>{project.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}