import { Routes, Route, Navigate } from 'react-router-dom'
import HeroSection from '../pages/main/Herosection'
import NotFound from '../pages/Notfound'

// Simple auth guard — replace with your real auth logic later
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('pos_token')
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/"   element={<HeroSection />} />

      {/* Protected Routes */}
      {/* <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } /> */}

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes