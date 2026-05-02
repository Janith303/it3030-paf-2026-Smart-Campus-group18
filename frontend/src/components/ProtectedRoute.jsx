import { Navigate } from 'react-router-dom';

function getTokenPayload() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

export default function ProtectedRoute({ children, roles }) {
  const payload = getTokenPayload();

  // No token → go to login
  if (!payload) {
    return <Navigate to="/login" replace />;
  }

  // Role check — if roles specified, user must have one of them
  if (roles && !roles.includes(payload.role)) {
    if (payload.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (payload.role === 'TECHNICIAN') return <Navigate to="/technician/tickets" replace />;
    return <Navigate to="/user" replace />;
  }

  return children;
}