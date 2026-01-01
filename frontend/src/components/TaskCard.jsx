import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function TaskCard({ task, employees, onEdit, onDelete, onStatusChange, onPriorityChange, showPriorityControls = false }) {
  const assignee = employees.find((e) => e._id === task.assignee?._id || e.id === task.assignee?._id || e._id === task.assignee || e.id === task.assignee);
  const formattedDate = task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'No due date';
  
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

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const getAssigneeName = () => {
    if (typeof task.assignee === 'object' && task.assignee?.name) {
      return task.assignee.name;
    }
    if (assignee?.name) {
      return assignee.name;
    }
    return 'Unassigned';
  };

  return (
    <div className="card mb-3 task-card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Link to={`/tasks/${task._id}`} className="text-decoration-none">
            <h5 className="card-title mb-1">{task.title}</h5>
          </Link>
          <span className={`status-badge ${getStatusClass(task.status)}`}>
            {task.status || 'Pending'}
          </span>
        </div>

        {task.description && (
          <p className="card-text text-muted small mb-3">
            {task.description.length > 100
              ? `${task.description.substring(0, 100)}...`
              : task.description}
          </p>
        )}

        <div className="mb-3">
          <small className="text-muted d-block mb-1">Due: {formattedDate}</small>
          <div className="d-flex align-items-center">
            {assignee || (task.assignee && typeof task.assignee === 'object') ? (
              <div className="d-flex align-items-center">
                <div className="avatar me-2">
                  {getInitials(getAssigneeName())}
                </div>
                <small className="text-muted">{getAssigneeName()}</small>
              </div>
            ) : (
              <small className="text-muted">Unassigned</small>
            )}
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          {showPriorityControls && (
            <select
              className="form-select form-select-sm"
              style={{ width: 'auto', minWidth: '100px' }}
              value={task.priority || 'medium'}
              onChange={(e) => onPriorityChange && onPriorityChange(task._id, e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          )}

          <select
            className="form-select form-select-sm"
            style={{ width: 'auto', minWidth: '120px' }}
            value={task.status || 'pending'}
            onChange={(e) => onStatusChange && onStatusChange(task._id, e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <div className="d-flex gap-1">
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => onEdit && onEdit(task)}
            >
              Edit
            </button>
            {onDelete && (
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => onDelete(task)}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
