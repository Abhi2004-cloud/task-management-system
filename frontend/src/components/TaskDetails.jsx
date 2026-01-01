import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { tasksAPI } from '../services/api';

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const data = await tasksAPI.getById(id);
        setTask(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load task');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'in progress':
        return 'status-in-progress';
      case 'completed':
        return 'status-completed';
      case 'pending':
      default:
        return 'status-pending';
    }
  };

  const getPriorityClass = (priority) => {
    return `priority-${priority?.toLowerCase() || 'medium'}`;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="card">
        <div className="card-body text-center py-5">
          <h5 className="text-danger">{error || 'Task not found'}</h5>
          <Link to="/" className="btn btn-primary mt-3">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link to="/" className="btn btn-outline-secondary">
          ← Back to Dashboard
        </Link>
        <Link to={`/tasks/${id}/edit`} className="btn btn-primary">
          Edit Task
        </Link>
      </div>

      <div className="card">
        <div className="card-header bg-white">
          <div className="d-flex justify-content-between align-items-start">
            <h3 className="mb-0">{task.title}</h3>
            <span className={`status-badge ${getStatusClass(task.status)}`}>
              {task.status || 'Pending'}
            </span>
          </div>
        </div>
        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-6">
              <h6 className="text-muted mb-2">Description</h6>
              <p className="mb-0">{task.description || 'No description provided'}</p>
            </div>
            <div className="col-md-6">
              <h6 className="text-muted mb-2">Priority</h6>
              <p className={`fw-bold mb-0 ${getPriorityClass(task.priority)}`}>
                {task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : 'Medium'}
              </p>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-6">
              <h6 className="text-muted mb-2">Due Date</h6>
              <p className="mb-0">
                {task.dueDate
                  ? format(new Date(task.dueDate), 'MMMM d, yyyy')
                  : 'No due date'}
              </p>
            </div>
            <div className="col-md-6">
              <h6 className="text-muted mb-2">Assignee</h6>
              <div className="d-flex align-items-center">
                {task.assignee && (
                  <>
                    <div className="avatar me-2">
                      {task.assignee.name
                        .split(' ')
                        .map(n => n[0])
                        .join('')
                        .toUpperCase()}
                    </div>
                    <div>
                      <p className="mb-0">{task.assignee.name}</p>
                      <small className="text-muted">{task.assignee.email}</small>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <h6 className="text-muted mb-2">Created By</h6>
              <p className="mb-0">
                {task.createdBy?.name || 'Unknown'}
              </p>
            </div>
            <div className="col-md-6">
              <h6 className="text-muted mb-2">Created At</h6>
              <p className="mb-0">
                {task.createdAt
                  ? format(new Date(task.createdAt), 'MMMM d, yyyy h:mm a')
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

