import { Routes, Route } from 'react-router-dom';
import Login from '../components/Auth/Login.jsx';
import Signup from '../components/Auth/Signup.jsx';
import Landing from '../pages/Landing.jsx';
import ProjectDetail from '../components/Project/ProjectDetail.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/projects/:projectId" element={<ProjectDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  )
}