import { Routes, Route, Navigate } from 'react-router-dom'

import HeroSection from '../pages/main/Herosection'
import FeatureSection from '../pages/main/Feature'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import NotFound from '../pages/Notfound'

// Simple auth guard — replace with your real auth logic later
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('pos_token')
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

const AppRoutes = () => {
  return (
    // <Routes>
    //   {/* Public Routes */}
    //   <Route path="/"   element={<HeroSection />} />
    //   <Route path="/features"   element={<FeatureSection />} />

    //   {/* Protected Routes */}
    //   {/* <Route path="/dashboard" element={
    //     <PrivateRoute>
    //       <Dashboard />
    //     </PrivateRoute>
    //   } /> */}

    //   {/* 404 */}
    //   <Route path="*" element={<NotFound />} />
    // </Routes>
    <div className="app">
        <Navigation />
        <Routes>
          {/* Main Portfolio Page */}
          <Route path="/" element={
            <>
              <section id="">
                <HeroSection />
              </section>
              <section id="features">
                <FeatureSection />
              </section>
              {/*<section id="projects">
                <MyProject />
              </section>
              <section id="skills">
                <Skill />
              </section>
              <section id="testimonials">
                <PortfolioTestimonials />
              </section>
              <section id="contact">
                <Contact />
              </section> */}
              
            </>
          } />
          <Route path="*" element={<NotFound />} />
          {/* <Route path="/projects/healthcare" element={<HealthcareProjectDetail />} /> */}
        </Routes>
        <Footer />
      </div>
  )
}

export default AppRoutes