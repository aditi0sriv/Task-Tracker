import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateProject from '../components/Project/CreateProject.jsx';
import ProjectsList from '../components/Project/ProjectsList.jsx';
import '../pages/Landing.css';

export default function Landing() {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0); // For re-triggering fetch

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleProjectCreated = (project) => {
    console.log('Project created:', project);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div>
      <h1>Task Tracker App</h1>

      <CreateProject onProjectCreated={handleProjectCreated} />

      {/* Removed onSelectProject, handled inside ProjectsList now */}
      <ProjectsList key={refreshKey} />

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
