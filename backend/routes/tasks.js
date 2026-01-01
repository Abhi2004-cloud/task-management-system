import express from 'express';
import { body, validationResult, query } from 'express-validator';
import Task from '../models/Task.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/tasks
// @desc    Get all tasks (with pagination)
// @access  Private
router.get('/', authenticate, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['pending', 'in progress', 'completed']).withMessage('Invalid status'),
  query('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};

    // If user is not admin, show tasks where they are assignee OR they created the task
    if (req.user.role !== 'admin') {
      filter.$or = [
        { assignee: req.user._id },
        { createdBy: req.user._id }
      ];
    } else if (req.query.assignee) {
      filter.assignee = req.query.assignee;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.priority) {
      filter.priority = req.query.priority;
    }

    // Get tasks with pagination
    const tasks = await Task.find(filter)
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count
    const total = await Task.countDocuments(filter);

    res.json({
      tasks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get task by ID
// @access  Private
router.get('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access (admin or assignee or creator)
    const isAssignee = task.assignee && task.assignee._id.toString() === req.user._id.toString();
    const isCreator = task.createdBy && task.createdBy._id.toString() === req.user._id.toString();
    if (req.user.role !== 'admin' && !isAssignee && !isCreator) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(500).json({ message: 'Server error fetching task' });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', authenticate, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('assignee').notEmpty().withMessage('Assignee is required'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('status').optional().isIn(['pending', 'in progress', 'completed']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, status, priority, dueDate, assignee } = req.body;

    const task = new Task({
      title,
      description: description || '',
      status: status || 'pending',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      assignee,
      createdBy: req.user._id
    });

    await task.save();
    await task.populate('assignee', 'name email');
    await task.populate('createdBy', 'name email');

    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error creating task' });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', authenticate, [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('status').optional().isIn(['pending', 'in progress', 'completed']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access (admin or assignee)
    if (req.user.role !== 'admin' && task.assignee.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, description, status, priority, dueDate, assignee } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (assignee !== undefined && req.user.role === 'admin') task.assignee = assignee;

    await task.save();
    await task.populate('assignee', 'name email');
    await task.populate('createdBy', 'name email');

    res.json(task);
  } catch (error) {
    console.error('Update task error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(500).json({ message: 'Server error updating task' });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Only admin or task creator can delete
    if (req.user.role !== 'admin' && task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied. Only admin or task creator can delete tasks.' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(500).json({ message: 'Server error deleting task' });
  }
});

export default router;

