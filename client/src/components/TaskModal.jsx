import { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';

const IconClose = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M4 4l8 8M12 4l-8 8" />
  </svg>
);

const TaskModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const isEditing = !!initialData;

  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    status: 'todo',
    tags: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');

  // Hydrate form when editing
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setForm({
          title: initialData.title || '',
          description: initialData.description || '',
          dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
          priority: initialData.priority || 'medium',
          status: initialData.status || 'todo',
          tags: initialData.tags ? initialData.tags.join(', ') : '',
        });
      } else {
        // Reset
        setForm({
          title: '',
          description: '',
          dueDate: '',
          priority: 'medium',
          status: 'todo',
          tags: '',
        });
      }
      setError('');
      setValidationError('');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (validationError && name === 'title') setValidationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setValidationError('Title is required.');
      return;
    }

    setLoading(true);
    setError('');

    // Prepare payload
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      status: form.status,
      // Parse tags (comma separated)
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0),
    };

    if (form.dueDate) {
      payload.dueDate = form.dueDate;
    }

    try {
      if (isEditing) {
        await taskService.update(initialData._id, payload);
      } else {
        await taskService.create(payload);
      }
      onSuccess(); // Refresh task list
      onClose();   // Close modal
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save task. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">{isEditing ? 'Edit Task' : 'Create Task'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <IconClose />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {error && (
            <div className="alert alert--error" style={{ marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <form id="task-form" className="form" onSubmit={handleSubmit}>
            {/* Title */}
            <div className="form-group">
              <label className="form-label" htmlFor="task-title">Title *</label>
              <input
                id="task-title"
                name="title"
                className={`form-input${validationError ? ' form-input--error' : ''}`}
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Design the landing page"
                autoFocus
              />
              {validationError && <span className="form-error">{validationError}</span>}
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label" htmlFor="task-desc">Description</label>
              <textarea
                id="task-desc"
                name="description"
                className="form-input"
                value={form.description}
                onChange={handleChange}
                placeholder="Add more details..."
              />
            </div>

            {/* Row: Status & Priority */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="task-status">Status</label>
                <select
                  id="task-status"
                  name="status"
                  className="form-input"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="task-priority">Priority</label>
                <select
                  id="task-priority"
                  name="priority"
                  className="form-input"
                  value={form.priority}
                  onChange={handleChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Row: Due Date & Tags */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="task-due">Due Date</label>
                <input
                  id="task-due"
                  name="dueDate"
                  type="date"
                  className="form-input"
                  value={form.dueDate}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="task-tags">Tags</label>
                <input
                  id="task-tags"
                  name="tags"
                  className="form-input"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="e.g. Design, Frontend"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn--ghost" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="submit" form="task-form" className="btn btn--primary" disabled={loading} style={{ width: 'auto' }}>
            {loading && <span className="spinner-sm" />}
            {loading ? 'Saving...' : 'Save Task'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
