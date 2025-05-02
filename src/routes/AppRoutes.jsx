import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../components/Auth/Login.jsx';
import Signup from '../components/Auth/Signup.jsx';
import Landing from '../pages/Landing.jsx';
import ProjectDetail from '../components/Project/ProjectDetail.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} /> {/* Redirect root to /login */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/landing" element={<Landing />} />
      <Route path="/projects/:projectId" element={<ProjectDetail />} />
    </Routes>
  );
}
