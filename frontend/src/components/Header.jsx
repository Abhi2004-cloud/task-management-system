import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="mb-4">
      <nav className="navbar">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="me-2"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            TaskFlow
          </Link>
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center">
              <div className="avatar me-2">{user ? getInitials(user.name) : 'U'}</div>
              <div className="d-flex flex-column">
                <span className="fw-medium">{user?.name || 'User'}</span>
                {user?.role && (
                  <small className="text-muted text-capitalize">{user.role}</small>
                )}
              </div>
            </div>
            <button className="btn btn-outline-secondary btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
