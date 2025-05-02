import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import TaskManager from '../Tasks/TaskManager.jsx';


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
        const projectRes = await fetch(`https://task-tracker-5bhi.vercel.app/api/projects/${projectId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!projectRes.ok) {
          throw new Error('Failed to fetch project');
        }

        const projectData = await projectRes.json();
        setProject(projectData.project);

        // // Fetch tasks
        // const tasksRes = await fetch(`http://localhost:5000/api/projects/${projectId}/tasks`, {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // });

        // if (!tasksRes.ok) {
        //   throw new Error('Failed to fetch tasks');
        // }

        // const tasksData = await tasksRes.json();
        // setTasks(tasksData.tasks);
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
          <h2>{project.name}</h2>
          <p>{project.description}</p>

          <TaskManager 
            projectId={projectId}
          />

          {/* <h3>Tasks</h3>
          {Array.isArray(tasks) && tasks.length > 0 ? (
            tasks.map((task) => (
              <div key={task._id} style={{ marginBottom: '1rem' }}>
                <h4>{task.title}</h4>
                <p>{task.description}</p>
                <p>Status: {task.status}</p>
              </div>
            ))
          ) : (
            <p>No tasks yet.</p>
          )} */}
        </>
      ) : (
        <p>Loading project...</p>
      )}
    </div>
  );
}