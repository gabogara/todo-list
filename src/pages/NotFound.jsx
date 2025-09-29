import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <section>
      <h2>Page not found</h2>
      <p>
        The page you requested does not exist. <Link to="/">Go back home</Link>.
      </p>
    </section>
  );
}

export default NotFound;
