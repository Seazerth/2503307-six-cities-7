import {Link} from 'react-router-dom';

function NotFoundPage() {
  return (
    <main>
      <h1>404 Not Found</h1>
      <Link to="/">Go to the main page</Link>
    </main>
  );
}

export default NotFoundPage;
