import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import TaskModal from '../components/TaskModal';
import useTasks from '../hooks/useTasks';
import useTags from '../hooks/useTags';
import useDebounce from '../hooks/useDebounce';
import { taskService } from '../services/taskService';
import { tagService } from '../services/tagService';

// ── Inline SVG icons ─────────────────────────────────────────────────────────
const IconPlus = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M8 3v10M3 8h10" />
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 8l3.5 3.5L13 5" />
  </svg>
);
const IconEdit = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11.5 1.5a1.5 1.5 0 0 1 2.1 2.1L5 12.2 2 13l.8-3L11.5 1.5z" />
  </svg>
);
const IconTrash = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 4h12m-4 0V2H6v2M5 4v9a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V4" />
  </svg>
);
const IconClipboard = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
  </svg>
);
const IconAlertCircle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4m0 4h.01" />
  </svg>
);
const IconRefresh = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 4v6h6M23 20v-6h-6" />
    <path d="M20.5 9A9 9 0 0 0 5.6 5.6L1 10m22 4-4.6 4.4A9 9 0 0 1 3.5 15" />
  </svg>
);

// ── Status groups config ─────────────────────────────────────────────────────
const STATUS_GROUPS = [
  { key: 'in-progress', label: 'In Progress', color: '#f76b15' },
  { key: 'todo',        label: 'To Do',       color: '#8b8b96' },
  { key: 'done',        label: 'Done',        color: '#30a46c' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
const formatDue = (dateStr) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const isOverdue = (dateStr, status) => {
  if (!dateStr || status === 'done') return false;
  return new Date(dateStr) < new Date();
};

// ── Loading skeleton ─────────────────────────────────────────────────────────
const TaskRowSkeleton = () => (
  <div className="task-row" style={{ pointerEvents: 'none' }}>
    <span className="skeleton" style={{ width: 10, height: 10, borderRadius: '50%' }} />
    <span className="skeleton" style={{ width: 16, height: 16, borderRadius: '50%' }} />
    <span className="skeleton" style={{ flex: 1, height: 13, borderRadius: 4 }} />
    <span className="skeleton" style={{ width: 60, height: 20, borderRadius: 999 }} />
    <span className="skeleton" style={{ width: 44, height: 13, borderRadius: 4 }} />
  </div>
);

const LoadingState = () => (
  <div className="task-section">
    <div className="task-section__header">
      <div>
        <span className="task-section__heading">My Tasks</span>
      </div>
    </div>
    {/* Skeleton groups */}
    {[1, 2].map((g) => (
      <div className="task-group" key={g}>
        <div className="task-group__header" style={{ pointerEvents: 'none' }}>
          <span className="skeleton" style={{ width: 15, height: 15, borderRadius: '50%' }} />
          <span className="skeleton" style={{ width: 80, height: 11, borderRadius: 4 }} />
        </div>
        <div className="task-list">
          {[1, 2, 3].map((r) => <TaskRowSkeleton key={r} />)}
        </div>
      </div>
    ))}
  </div>
);

// ── Error state ──────────────────────────────────────────────────────────────
const ErrorState = ({ message, onRetry }) => (
  <div className="task-section">
    <div className="empty-state" style={{ borderColor: 'rgba(229,72,77,0.3)' }}>
      <div className="empty-state__icon" style={{ color: 'var(--color-danger)', opacity: 1 }}>
        <IconAlertCircle />
      </div>
      <p className="empty-state__title" style={{ color: 'var(--color-danger)' }}>
        Failed to load tasks
      </p>
      <p className="empty-state__desc">{message}</p>
      <button
        id="btn-retry-tasks"
        className="btn btn--ghost"
        onClick={onRetry}
        style={{ marginTop: '0.5rem', width: 'auto', gap: '0.4rem' }}
      >
        <IconRefresh />
        Retry
      </button>
    </div>
  </div>
);

// ── Empty state ──────────────────────────────────────────────────────────────
const EmptyState = ({ onAdd }) => (
  <div className="empty-state">
    <div className="empty-state__icon">
      <IconClipboard />
    </div>
    <p className="empty-state__title">No tasks yet</p>
    <p className="empty-state__desc">
      Create your first task to get started. Hit the button below to add one.
    </p>
    <button
      id="btn-empty-add-task"
      className="btn btn--primary"
      onClick={onAdd}
      style={{ marginTop: '0.5rem', width: 'auto' }}
    >
      <IconPlus />
      Add Task
    </button>
  </div>
);

// ── Single task row ──────────────────────────────────────────────────────────
const TaskRow = ({ task, onEdit, onDelete, onToggleDone }) => {
  const due = formatDue(task.dueDate);
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div className="task-row" id={`task-row-${task._id}`}>
      {/* Priority dot */}
      <span
        className={`task-row__priority task-row__priority--${task.priority}`}
        title={`Priority: ${task.priority}`}
      />

      {/* Status indicator */}
      <div className={`task-row__status${task.status === 'done' ? ' task-row__status--done' : ''}`}>
        {task.status === 'done' && <IconCheck />}
      </div>

      {/* Title */}
      <span className={`task-row__title${task.status === 'done' ? ' task-row__title--done' : ''}`}>
        {task.title}
      </span>

      {/* Tags */}
      {task.tags?.length > 0 && (
        <div className="task-row__tags">
          {task.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="tag-badge">{tag}</span>
          ))}
          {task.tags.length > 2 && (
            <span className="tag-badge">+{task.tags.length - 2}</span>
          )}
        </div>
      )}

      {/* Due date */}
      {due && (
        <span className={`task-row__due${overdue ? ' task-row__due--overdue' : ''}`}>
          {overdue ? '⚠ ' : ''}{due}
        </span>
      )}

      {/* Hover actions — wired in next step */}
      <div className="task-row__actions">
        <button
          className="task-row__action-btn"
          title={task.status === 'done' ? 'Mark as to do' : 'Mark done'}
          onClick={(e) => { e.stopPropagation(); onToggleDone(task); }}
        >
          <IconCheck />
        </button>
        <button
          className="task-row__action-btn"
          title="Edit task"
          onClick={(e) => { e.stopPropagation(); onEdit(task); }}
        >
          <IconEdit />
        </button>
        <button
          className="task-row__action-btn"
          title="Delete task"
          onClick={(e) => { e.stopPropagation(); onDelete(task); }}
        >
          <IconTrash />
        </button>
      </div>
    </div>
  );
};

// ── Status group (collapsible) ────────────────────────────────────────────────
const TaskGroup = ({ group, tasks, onEdit, onDelete, onToggleDone }) => {
  const [collapsed, setCollapsed] = useState(false);
  if (tasks.length === 0) return null;

  return (
    <div className="task-group">
      <div
        className="task-group__header"
        onClick={() => setCollapsed((c) => !c)}
        title={collapsed ? 'Expand' : 'Collapse'}
      >
        <span
          className="task-group__icon"
          style={{
            display: 'inline-block',
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: group.color,
            flexShrink: 0,
          }}
        />
        <span className="task-group__name" style={{ color: group.color }}>
          {group.label}
        </span>
        <span className="task-group__count">{tasks.length}</span>
        <span style={{
          marginLeft: 'auto',
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-text-muted)',
          transition: 'transform 150ms ease',
          transform: collapsed ? 'rotate(-90deg)' : 'none',
          display: 'inline-block',
        }}>
          ▾
        </span>
      </div>

      {!collapsed && (
        <div className="task-list">
          {tasks.map((task) => (
            <TaskRow 
              key={task._id} 
              task={task} 
              onEdit={onEdit} 
              onDelete={onDelete} 
              onToggleDone={onToggleDone} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ── Main task content (live data) ─────────────────────────────────────────────
const TaskContent = ({ filters }) => {
  const { tasks, loading, error, refetch, setTasks } = useTasks(filters);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const hasFilters = Object.values(filters).some((val) => !!val);

  const handleAddTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };
  
  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleToggleDone = async (task) => {
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    
    // Optimistic UI update
    setTasks((prev) => prev.map((t) => t._id === task._id ? { ...t, status: newStatus } : t));
    
    try {
      if (newStatus === 'done') {
        await taskService.markDone(task._id);
      } else {
        await taskService.update(task._id, { status: newStatus });
      }
    } catch (err) {
      // Revert if API fails
      setTasks((prev) => prev.map((t) => t._id === task._id ? { ...t, status: task.status } : t));
      alert('Failed to update task status.');
    }
  };

  const handleDeleteTask = async (task) => {
    if (!window.confirm(`Are you sure you want to delete "${task.title}"?`)) return;
    
    // Optimistic UI update
    setTasks((prev) => prev.filter((t) => t._id !== task._id));
    
    try {
      await taskService.delete(task._id);
    } catch (err) {
      // Revert if API fails
      refetch();
      alert('Failed to delete task.');
    }
  };

  if (loading) return <LoadingState />;
  if (error)   return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="task-section">
      {/* Header */}
      <div className="task-section__header">
        <div>
          <span className="task-section__heading">{filters.tags ? `Tag: ${filters.tags}` : 'My Tasks'}</span>
          <span className="task-section__count">{tasks.length}</span>
        </div>
        <button id="btn-add-task" className="btn--add-task" onClick={handleAddTask}>
          <IconPlus />
          Add Task
        </button>
      </div>

      {/* Empty state */}
      {tasks.length === 0 && !loading && (
        hasFilters
          ? (
            <div className="empty-state">
              <div className="empty-state__icon"><IconClipboard /></div>
              <p className="empty-state__title">No results found</p>
              <p className="empty-state__desc">Try adjusting your search or filters.</p>
            </div>
          )
          : <EmptyState onAdd={handleAddTask} />
      )}

      {/* Task groups */}
      {tasks.length > 0 && STATUS_GROUPS.map((group) => {
        const groupTasks = tasks.filter((t) => t.status === group.key);
        // If a status filter is applied, only render the matching group
        if (filters.status && filters.status !== group.key) return null;
        
        return (
          <TaskGroup
            key={group.key}
            group={group}
            tasks={groupTasks}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onToggleDone={handleToggleDone}
          />
        );
      })}
      
      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refetch}
        initialData={editingTask}
      />
    </div>
  );
};

// ── Manage Tags Content ───────────────────────────────────────────────────────
const ManageTagsContent = () => {
  const { tags, loading, error, refetch, setTags } = useTags();
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateTag = async (e) => {
    e.preventDefault();
    if (!newTag.trim()) return;

    setIsSubmitting(true);
    // Optimistic update
    const tempTag = { _id: Date.now().toString(), name: newTag.trim() };
    setTags((prev) => [...prev, tempTag]);
    setNewTag('');

    try {
      await tagService.create({ name: tempTag.name });
      refetch(); // Get real ID
    } catch (err) {
      setTags((prev) => prev.filter((t) => t._id !== tempTag._id));
      alert('Failed to create tag.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTag = async (tag) => {
    if (!window.confirm(`Delete tag "${tag.name}"?`)) return;

    setTags((prev) => prev.filter((t) => t._id !== tag._id));
    
    try {
      await tagService.delete(tag._id);
    } catch (err) {
      refetch();
      alert('Failed to delete tag.');
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="task-section">
      <div className="task-section__header">
        <span className="task-section__heading">Manage Tags</span>
      </div>

      <div style={{ maxWidth: 500, marginTop: '1rem' }}>
        <form onSubmit={handleCreateTag} style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Add new tag..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            disabled={isSubmitting}
          />
          <button type="submit" className="btn btn--primary" disabled={isSubmitting || !newTag.trim()} style={{ width: 'auto' }}>
            Add
          </button>
        </form>

        <div className="task-list">
          {tags.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state__title">No tags yet</p>
            </div>
          ) : (
            tags.map((tag) => (
              <div key={tag._id} className="task-row">
                <span className="task-row__title" style={{ marginLeft: 0 }}>{tag.name}</span>
                <div className="task-row__actions">
                  <button
                    className="task-row__action-btn"
                    title="Delete tag"
                    onClick={() => handleDeleteTag(tag)}
                  >
                    <IconTrash />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// ── Dashboard Page ────────────────────────────────────────────────────────────
const DashboardPage = () => {
  const [activeView, setActiveView] = useState('my-tasks');
  const [search, setSearch]         = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const debouncedSearch = useDebounce(search, 300);
  
  const isTagView = activeView.startsWith('tag:');
  
  const filters = {
    search: debouncedSearch,
    priority: priorityFilter || undefined,
    status: statusFilter || undefined,
    tags: isTagView ? activeView.slice(4) : undefined,
  };

  return (
    <div className="app-shell">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      <div className="main-panel">
        <Topbar
          activeView={activeView}
          searchValue={search}
          onSearchChange={setSearch}
        />

        <main className="content-area">
          {(activeView === 'my-tasks' || isTagView) && (
            <>
              {/* Inline Filter Bar */}
              <div className="filter-bar" style={{ display: 'flex', gap: '0.75rem', padding: '0 2rem 1rem', borderBottom: '1px solid var(--color-border)', marginBottom: '1rem' }}>
                <select className="form-input" style={{ width: 'auto', padding: '0.3rem 2rem 0.3rem 0.8rem', fontSize: 'var(--font-size-sm)' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="">All Statuses</option>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                <select className="form-input" style={{ width: 'auto', padding: '0.3rem 2rem 0.3rem 0.8rem', fontSize: 'var(--font-size-sm)' }} value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                  <option value="">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <TaskContent filters={filters} />
            </>
          )}

          {activeView === 'tags' && <ManageTagsContent />}

          {activeView !== 'my-tasks' && activeView !== 'tags' && !isTagView && (
            <div className="task-section">
              <div className="empty-state" style={{ marginTop: '2rem' }}>
                <div className="empty-state__icon"><IconClipboard /></div>
                <p className="empty-state__title" style={{ textTransform: 'capitalize' }}>
                  {activeView.startsWith('tag:') ? `Tag: ${activeView.slice(4)}` : activeView}
                </p>
                <p className="empty-state__desc">This section is coming soon.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
