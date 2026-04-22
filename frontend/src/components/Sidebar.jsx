import { useAuth } from '../context/AuthContext';
import useTags from '../hooks/useTags';

// Inline SVG icons
const IconLayers = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 5l7-4 7 4-7 4-7-4z"/><path d="M1 11l7 4 7-4"/><path d="M1 8l7 4 7-4"/>
  </svg>
);

const IconInbox = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 10h3l2 3h4l2-3h3V3a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v7z"/>
  </svg>
);

const IconTag = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 1h6.5l7 7a1.5 1.5 0 0 1 0 2.1l-4.4 4.4a1.5 1.5 0 0 1-2.1 0L1 7.5V1z"/>
    <circle cx="4" cy="4" r="1" fill="currentColor" stroke="none"/>
  </svg>
);

const IconSettings = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="2"/><path d="M8 1v2m0 10v2M1 8h2m10 0h2M3 3l1.5 1.5M11.5 11.5 13 13M3 13l1.5-1.5M11.5 4.5 13 3"/>
  </svg>
);

const IconLogOut = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3m3-10 4 4-4 4m4-4H6"/>
  </svg>
);

// Preset tag colors
const TAG_COLORS = ['#5b5bd6', '#30a46c', '#f76b15', '#e5484d', '#8e4ec6'];

const Sidebar = ({ activeView, onViewChange }) => {
  const { user, logout } = useAuth();
  const { tags } = useTags();

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar__logo">
        <div className="sidebar__logo-icon">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M2 4h12M2 8h8M2 12h5"/>
          </svg>
        </div>
        <span className="sidebar__logo-name">TaskManagerr</span>
      </div>

      {/* Primary nav */}
      <nav>
        <button
          id="nav-my-tasks"
          className={`sidebar__nav-item${activeView === 'my-tasks' ? ' active' : ''}`}
          onClick={() => onViewChange('my-tasks')}
        >
          <IconLayers />
          My Tasks
        </button>

        <button
          id="nav-inbox"
          className={`sidebar__nav-item${activeView === 'inbox' ? ' active' : ''}`}
          onClick={() => onViewChange('inbox')}
        >
          <IconInbox />
          Inbox
          <span className="sidebar__nav-item-count">3</span>
        </button>
      </nav>

      <div className="sidebar__divider" />

      {/* Tags section */}
      <span className="sidebar__section-label">Tags</span>

      {tags.map((tag, index) => {
        const color = TAG_COLORS[index % TAG_COLORS.length];
        return (
          <button
            key={tag._id}
            id={`nav-tag-${tag._id}`}
            className={`sidebar__nav-item${activeView === `tag:${tag.name}` ? ' active' : ''}`}
            onClick={() => onViewChange(`tag:${tag.name}`)}
          >
            <span className="sidebar__tag-dot" style={{ background: color }} />
            {tag.name}
          </button>
        );
      })}

      <button
        id="nav-manage-tags"
        className="sidebar__nav-item"
        onClick={() => onViewChange('tags')}
      >
        <IconTag />
        Manage Tags
      </button>

      <div className="sidebar__divider" />

      {/* Bottom: settings */}
      <button
        id="nav-settings"
        className={`sidebar__nav-item${activeView === 'settings' ? ' active' : ''}`}
        onClick={() => onViewChange('settings')}
      >
        <IconSettings />
        Settings
      </button>

      {/* User row */}
      <div className="sidebar__user" id="sidebar-user-menu" onClick={logout} title="Click to sign out">
        <div className="sidebar__avatar">{initials}</div>
        <div className="sidebar__user-info">
          <div className="sidebar__user-name">{user?.name || 'User'}</div>
          <div className="sidebar__user-email">{user?.email || ''}</div>
        </div>
        <IconLogOut />
      </div>
    </aside>
  );
};

export default Sidebar;
