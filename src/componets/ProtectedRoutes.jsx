import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ userRole = [] }) => {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  // If no user or invalid role → redirect to homepage
  if (!user || !user.role || !userRole.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Role is valid → grant access
  return <Outlet />;
};

export default ProtectedRoute;
