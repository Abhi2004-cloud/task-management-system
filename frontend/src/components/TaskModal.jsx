import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export default function TaskModal({ show, onClose, onSave, employees, task }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'pending',
    assignee: '',
    priority: 'medium',
    dueDate: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'pending',
        assignee: task.assignee?._id || task.assignee || '',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
      });
    } else {
      setForm({
        title: '',
        description: '',
        status: 'pending',
        assignee: '',
        priority: 'medium',
        dueDate: ''
      });
    }
    setErrors({});
  }, [task, show]);

  const update = (k, v) => {
    setForm(prev => ({ ...prev, [k]: v }));
    if (errors[k]) {
      setErrors(prev => ({ ...prev, [k]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!form.assignee) {
      newErrors.assignee = 'Assignee is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    const taskData = {
      ...form,
      assignee: form.assignee
    };
    onSave(taskData);
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{task ? 'Edit Task' : 'New Task'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={submit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Title *</Form.Label>
            <Form.Control
              type="text"
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              isInvalid={!!errors.title}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.title}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
            />
          </Form.Group>

          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Assignee *</Form.Label>
                <Form.Select
                  value={form.assignee}
                  onChange={(e) => update('assignee', e.target.value)}
                  isInvalid={!!errors.assignee}
                  required
                >
                  <option value="">Select assignee</option>
                  {employees.map(emp => (
                    <option key={emp._id || emp.id} value={emp._id || emp.id}>
                      {emp.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.assignee}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={form.status}
                  onChange={(e) => update('status', e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="in progress">In Progress</option>
                  <option value="completed">Completed</option>
                </Form.Select>
              </Form.Group>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Priority</Form.Label>
                <Form.Select
                  value={form.priority}
                  onChange={(e) => update('priority', e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Form.Select>
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Due Date</Form.Label>
                <Form.Control
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => update('dueDate', e.target.value)}
                />
              </Form.Group>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {task ? 'Update' : 'Create'} Task
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
