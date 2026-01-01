import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { tasksAPI, usersAPI } from '../services/api';
import EmployeeList from './EmployeeList';
import TaskList from './TaskList';
import TaskModal from './TaskModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import UserManagementModal from './UserManagementModal';

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [deleteTask, setDeleteTask] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const limit = 100; // Fetch more tasks to display in priority columns

  useEffect(() => {
    loadData();
  }, [currentPage, statusFilter, user, isAdmin]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Wait for auth to initialize
      if (!user) {
        setLoading(false);
        return;
      }

      // Load users (for admin) or set current user as the only assignee option for employees
      if (isAdmin) {
        const usersData = await usersAPI.getAll();
        setEmployees(usersData);
      } else {
        setEmployees([user]);
      }

      // Load tasks - fetch all for priority view, or use filters/pagination for list view
      const filters = {};
      if (statusFilter) filters.status = statusFilter;
      // Don't filter by priority since we're organizing by priority columns
      
      // Fetch with higher limit to show all tasks in priority columns
      const response = await tasksAPI.getAll(currentPage, 100, filters);
      setTasks(response.tasks);
      setTotalPages(response.pagination.pages);
      setTotalTasks(response.pagination.total);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditTask(null);
    setShowModal(true);
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setShowModal(true);
  };

  const handleSave = async (taskData) => {
    try {
      if (editTask) {
        await tasksAPI.update(editTask._id, taskData);
      } else {
        await tasksAPI.create(taskData);
      }
      setShowModal(false);
      setEditTask(null);
      loadData();
    } catch (error) {
      console.error('Error saving task:', error);
      alert(error.response?.data?.message || 'Error saving task');
    }
  };

  const handleDeleteClick = (task) => {
    setDeleteTask(task);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTask) return;
    
    try {
      await tasksAPI.delete(deleteTask._id);
      setDeleteTask(null);
      loadData();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert(error.response?.data?.message || 'Error deleting task');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await tasksAPI.update(taskId, { status: newStatus });
      loadData();
    } catch (error) {
      console.error('Error updating status:', error);
      alert(error.response?.data?.message || 'Error updating status');
    }
  };

  const handlePriorityChange = async (taskId, newPriority) => {
    try {
      await tasksAPI.update(taskId, { priority: newPriority });
      loadData();
    } catch (error) {
      console.error('Error updating priority:', error);
      alert(error.response?.data?.message || 'Error updating priority');
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const clearFilters = () => {
    setStatusFilter('');
    setCurrentPage(1);
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="h4 mb-1">Task Management</h2>
              <p className="text-muted mb-0">
                {isAdmin ? 'Manage all tasks' : 'Your assigned tasks'}
              </p>
            </div>
            <div className="d-flex gap-2">
              {isAdmin && (
                <button
                  className="btn btn-outline-primary"
                  onClick={() => setShowUserModal(true)}
                >
                  Manage Users
                </button>
              )}
              <button className="btn btn-primary" onClick={handleCreate}>
                + New Task
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Status Filter</label>
                  <small className="text-muted d-block mb-1">Tasks are organized by priority columns below</small>
                </div>
                <div className="col-md-4 d-flex align-items-end">
                  {statusFilter && (
                    <button className="btn btn-outline-secondary w-100" onClick={clearFilters}>
                      Clear Filter
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Lists (Kanban-style) */}
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card priority-column priority-low">
            <div className="card-header bg-success bg-opacity-10 border-success">
              <h5 className="mb-0 text-success">Low Priority</h5>
            </div>
            <div className="card-body" style={{ minHeight: '400px' }}>
              <TaskList
                tasks={tasks.filter(t => t.priority === 'low')}
                employees={employees}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onStatusChange={handleStatusChange}
                onPriorityChange={handlePriorityChange}
                showPriorityControls={true}
              />
              {tasks.filter(t => t.priority === 'low').length === 0 && (
                <div className="text-center text-muted py-5">
                  No low priority tasks
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card priority-column priority-medium">
            <div className="card-header bg-warning bg-opacity-10 border-warning">
              <h5 className="mb-0 text-warning">Medium Priority</h5>
            </div>
            <div className="card-body" style={{ minHeight: '400px' }}>
              <TaskList
                tasks={tasks.filter(t => t.priority === 'medium')}
                employees={employees}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onStatusChange={handleStatusChange}
                onPriorityChange={handlePriorityChange}
                showPriorityControls={true}
              />
              {tasks.filter(t => t.priority === 'medium').length === 0 && (
                <div className="text-center text-muted py-5">
                  No medium priority tasks
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card priority-column priority-high">
            <div className="card-header bg-danger bg-opacity-10 border-danger">
              <h5 className="mb-0 text-danger">High Priority</h5>
            </div>
            <div className="card-body" style={{ minHeight: '400px' }}>
              <TaskList
                tasks={tasks.filter(t => t.priority === 'high')}
                employees={employees}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onStatusChange={handleStatusChange}
                onPriorityChange={handlePriorityChange}
                showPriorityControls={true}
              />
              {tasks.filter(t => t.priority === 'high').length === 0 && (
                <div className="text-center text-muted py-5">
                  No high priority tasks
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Task Count */}
      <div className="row">
        <div className="col-12">
          <div className="text-center text-muted mt-3">
            Total tasks: {totalTasks} | 
            Low: {tasks.filter(t => t.priority === 'low').length} | 
            Medium: {tasks.filter(t => t.priority === 'medium').length} | 
            High: {tasks.filter(t => t.priority === 'high').length}
          </div>
        </div>
      </div>

      {showModal && (
        <TaskModal
          show={showModal}
          onClose={() => {
            setShowModal(false);
            setEditTask(null);
          }}
          onSave={handleSave}
          employees={employees}
          task={editTask}
        />
      )}

      {deleteTask && (
        <DeleteConfirmModal
          show={!!deleteTask}
          onHide={() => setDeleteTask(null)}
          onConfirm={handleDeleteConfirm}
          itemName={deleteTask.title}
        />
      )}

      {showUserModal && isAdmin && (
        <UserManagementModal
          show={showUserModal}
          onClose={() => setShowUserModal(false)}
          onUserChange={loadData}
        />
      )}
    </div>
  );
}
