import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 text-center">
      <h1 className="display-1 fw-bold text-secondary">404</h1>
      <h4 className="mb-3">Page Not Found</h4>
      <p className="text-muted mb-4">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn btn-dark px-4">Back to Home</Link>
    </div>
  )
}

export default NotFound