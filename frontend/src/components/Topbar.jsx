import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const IconSearch = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5 14 14"/>
  </svg>
);

const IconBell = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 1a5 5 0 0 1 5 5v3l1 2H2l1-2V6a5 5 0 0 1 5-5zm-1.5 12a1.5 1.5 0 0 0 3 0"/>
  </svg>
);

const IconMenu = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M2 4h12M2 8h12M2 12h12" />
  </svg>
);

const IconSun = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="3"/><path d="M8 1v2m0 10v2M1 8h2m10 0h2M3 3l1.5 1.5M11.5 11.5 13 13M3 13l1.5-1.5M11.5 4.5 13 3"/>
  </svg>
);

const IconMoon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 9.5a6 6 0 1 1-5.5-5.5 4 4 0 0 0 5.5 5.5z"/>
  </svg>
);

// Title map for views
const VIEW_TITLES = {
  'my-tasks': 'My Tasks',
  'inbox':    'Inbox',
  'tags':     'Manage Tags',
  'settings': 'Settings',
};

const Topbar = ({ activeView, searchValue, onSearchChange, onMenuClick }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const title = VIEW_TITLES[activeView] || 'My Tasks';

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <header className="topbar">
      {/* Hamburger Menu (Mobile) */}
      <button className="topbar__menu-btn" onClick={onMenuClick} aria-label="Toggle menu">
        <IconMenu />
      </button>

      {/* Page title */}
      <span className="topbar__title">{title}</span>

      {/* Search bar */}
      <div className="topbar__search">
        <span className="topbar__search-icon">
          <IconSearch />
        </span>
        <input
          id="topbar-search"
          className="topbar__search-input"
          type="search"
          placeholder="Search tasks…"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          autoComplete="off"
        />
      </div>

      {/* Right actions */}
      <div className="topbar__actions">
        <button 
          id="topbar-theme-toggle" 
          className="topbar__icon-btn" 
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <IconSun /> : <IconMoon />}
        </button>
        <button id="topbar-notifications" className="topbar__icon-btn" title="Notifications">
          <IconBell />
        </button>
        <div id="topbar-avatar" className="topbar__avatar" title={user?.name || 'User'}>
          {initials}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
