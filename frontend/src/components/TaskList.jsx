import React from 'react';
import TaskCard from './TaskCard';

export default function TaskList({ tasks, employees, onEdit, onDelete, onStatusChange, onPriorityChange, showPriorityControls = false }) {
  if (!tasks || tasks.length === 0) return null;

  return (
    <div>
      {tasks.map((task) => (
        <TaskCard
          key={task._id || task.id}
          task={task}
          employees={employees}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          onPriorityChange={onPriorityChange}
          showPriorityControls={showPriorityControls}
        />
      ))}
    </div>
  );
}
