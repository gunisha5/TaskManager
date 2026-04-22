import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="page-placeholder">
      <h1>404 — Page Not Found</h1>
      <p>The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link to="/dashboard">Go to Dashboard</Link>
    </div>
  );
};

export default NotFoundPage;
