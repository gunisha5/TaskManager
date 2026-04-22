import { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import { getAiSuggestions } from '../api/aiApi';

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
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

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
      setAiError('');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (validationError && name === 'title') setValidationError('');
    if (aiError && name === 'title') setAiError('');
  };

  const handleSmartSuggest = async () => {
    if (!form.title.trim()) {
      setAiError('Please enter a title first to get suggestions.');
      return;
    }
    setAiLoading(true);
    setAiError('');

    try {
      const res = await getAiSuggestions(form.title.trim());
      const { tags, subtasks } = res.data.data;

      setForm((prev) => {
        let newTags = prev.tags;
        if (tags && tags.length > 0) {
          const existingTags = prev.tags.split(',').map(t => t.trim()).filter(Boolean);
          const uniqueTags = [...new Set([...existingTags, ...tags])];
          newTags = uniqueTags.join(', ');
        }

        let newDesc = prev.description;
        if (subtasks && subtasks.length > 0) {
          const subtasksText = '\n\nSuggested Subtasks:\n' + subtasks.map(st => `- [ ] ${st}`).join('\n');
          newDesc = (prev.description + subtasksText).trim();
        }

        return { ...prev, tags: newTags, description: newDesc };
      });
    } catch (err) {
      setAiError('Failed to generate suggestions. Please try again.');
    } finally {
      setAiLoading(false);
    }
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
            {aiError && (
              <div className="form-error" style={{ marginBottom: '1rem' }}>{aiError}</div>
            )}

            {/* Title */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="form-label" htmlFor="task-title" style={{ marginBottom: 0 }}>Title *</label>
                <button 
                  type="button" 
                  onClick={handleSmartSuggest} 
                  className="btn btn--ghost" 
                  style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', height: 'auto', width: 'auto', color: 'var(--color-primary)' }}
                  disabled={aiLoading}
                >
                  {aiLoading ? 'Thinking...' : 'Smart Suggest ✨'}
                </button>
              </div>
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
