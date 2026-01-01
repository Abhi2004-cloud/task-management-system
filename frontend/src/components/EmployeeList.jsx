import React from 'react';

// Helper function to get initials from name
const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
};

export default function EmployeeList({ employees = [] }) {
  if (employees.length === 0) {
    return (
      <div className="text-center py-4 text-muted">
        <small>No users found</small>
      </div>
    );
  }

  return (
    <div className="list-group list-group-flush">
      {employees.map((employee) => (
        <div 
          key={employee._id || employee.id} 
          className="list-group-item list-group-item-action d-flex align-items-center py-3"
        >
          <div className="avatar me-3">
            {getInitials(employee.name)}
          </div>
          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="mb-0">{employee.name}</h6>
              <span className={`badge ${employee.role === 'admin' ? 'bg-danger' : 'bg-secondary'} small`}>
                {employee.role || 'Employee'}
              </span>
            </div>
            <small className="text-muted">{employee.email}</small>
          </div>
        </div>
      ))}
    </div>
  );
}
