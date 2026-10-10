import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main className="not-found-page">
      <span className="not-found-code">404</span>
      <h1>This page isn’t here yet.</h1>
      <p>That address doesn’t match a page in the workspace.</p>
      <Link className="primary-button" to="/workspace">Return to workspace</Link>
    </main>
  );
}
