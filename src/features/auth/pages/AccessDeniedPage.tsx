import { Link } from 'react-router-dom';

export function AccessDeniedPage() {
  return (
    <main className="access-denied-page">
      <span className="access-lock" aria-hidden="true">⌑</span>
      <p className="eyebrow">WORKSPACE ACCESS</p>
      <h1>You do not have access to this page.</h1>
      <p className="access-copy">Your role doesn’t include permission to view this area. If you think you need access, contact your administrator.</p>
      <Link className="primary-button" to="/workspace"><span aria-hidden="true">←</span> Return to Dashboard</Link>
    </main>
  );
}
