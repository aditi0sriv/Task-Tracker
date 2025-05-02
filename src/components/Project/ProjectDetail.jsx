import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import TaskManager from '../Tasks/TaskManager.jsx';
import '../Project/ProjectDetail.css';


export default function ProjectDetail() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchProjectData = async () => {
      try {
        // Fetch project details
        const projectRes = await fetch(`https://task-tracker-backend-plum.vercel.app/api/projects/${projectId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!projectRes.ok) {
          throw new Error('Failed to fetch project');
        }

        const projectData = await projectRes.json();
        setProject(projectData.project);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Something went wrong');
      }
    };

    fetchProjectData();
  }, [projectId]);

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {project ? (
        <>

          <div className='Project-detail'>
            <h2>{project.name}</h2>
            <p>{project.description}</p>
          </div>

          <TaskManager
            projectId={projectId}
          />
        </>
      ) : (
        <p>Loading project...</p>
      )}
    </div>
  );
}