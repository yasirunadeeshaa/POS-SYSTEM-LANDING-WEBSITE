import React, { useState } from 'react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  Twitter, 
  Send, 
  MapPin, 
  Phone, 
  Heart,
  ArrowUp,
  Code2,
  Sparkles,
  ExternalLink
} from 'lucide-react';

const PortfolioFooter = () => {
  const [email, setEmail] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(true);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    navigation: [
      { label: 'About', href: '#about' },
      { label: 'Projects', href: '#projects' },
      { label: 'Skills', href: '#skills' },
      { label: 'Experience', href: '#experience' },
      { label: 'Contact', href: '#contact' }
    ],
    services: [
      { label: 'Web Development', href: '#web-dev' },
      { label: 'Mobile Apps', href: '#mobile' },
      { label: 'UI/UX Design', href: '#design' },
      { label: 'Consulting', href: '#consulting' },
      { label: 'Code Review', href: '#review' }
    ],
    resources: [
      { label: 'Blog', href: '#blog' },
      { label: 'Case Studies', href: '#cases' },
      { label: 'Open Source', href: '#opensource' },
      { label: 'Documentation', href: '#docs' },
      { label: 'Tutorials', href: '#tutorials' }
    ]
  };

  const socialLinks = [
    { icon: Github, href: 'https://github.com/yasirunadeeshaa', label: 'GitHub', color: '#333' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/yasiru-nadeesha-aththanayaka/', label: 'LinkedIn', color: '#0077b5' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter', color: '#1da1f2' },
    { icon: Mail, href: 'mailto:your.email@example.com', label: 'Email', color: '#ea4335' }
  ];

  return (
    <footer className="pf-footer">
      {/* Decorative Top Border */}
      <div className="pf-top-border">
        <div className="pf-border-gradient"></div>
      </div>

      {/* Main Footer Content */}
      <div className="pf-footer-container">
        {/* CTA Section */}
        <div className="pf-cta-section">
          <div className="pf-cta-content">
            <h2 className="pf-cta-title">
              Have a project in mind?
              <br />
              <span className="pf-cta-gradient">Let's create something amazing!</span>
            </h2>
            <p className="pf-cta-description">
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
            </p>
          </div>
        </div>

        {/* Footer Links Grid */}
        <div className="pf-links-section">
          {/* Brand Column */}
          <div className="pf-footer-column pf-brand-column">
            <div className="pf-brand">
              <div className="pf-brand-logo">
                <Code2 size={32} />
              </div>
              <h3 className="pf-brand-name">Yasiru Nadeesha</h3>
            </div>
            <p className="pf-brand-tagline">
              Crafting digital experiences with passion and precision. Turning ideas into reality, one line of code at a time.
            </p>
            <div className="pf-contact-info">
              <div className="pf-contact-item">
                <MapPin size={16} />
                <span>Baththaramulla, Sri Lanka</span>
              </div>
              <div className="pf-contact-item">
                <Phone size={16} />
                <span>+94 74 176 7063</span>
              </div>
              <div className="pf-contact-item">
                <Mail size={16} />
                <span>yasiru@example.com</span>
              </div>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="pf-footer-column">
            <h4 className="pf-column-title">Navigation</h4>
            <ul className="pf-link-list">
              {footerLinks.navigation.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="pf-footer-link">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Column */}
          <div className="pf-footer-column">
            <h4 className="pf-column-title">Services</h4>
            <ul className="pf-link-list">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="pf-footer-link">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div className="pf-footer-column">
            <h4 className="pf-column-title">Resources</h4>
            <ul className="pf-link-list">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="pf-footer-link">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="pf-footer-column pf-newsletter-column">
            <h4 className="pf-column-title">Stay Updated</h4>
            <p className="pf-newsletter-text">
              Subscribe to get the latest updates on projects, articles, and tech insights.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="pf-newsletter-form">
              <div className="pf-input-group">
                <Mail size={18} className="pf-input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="pf-newsletter-input"
                  required
                />
              </div>
              <button type="submit" className="pf-newsletter-btn">
                <Send size={18} />
              </button>
            </form>
            <div className="pf-social-links">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="pf-social-link"
                  aria-label={social.label}
                  title={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pf-bottom-bar">
          <div className="pf-bottom-content">
            <p className="pf-copyright">
              © {currentYear} Yasiru Nadeesha. Made with <Heart size={14} className="pf-heart" /> in Sri Lanka
            </p>
            <div className="pf-bottom-links">
              <a href="#privacy" className="pf-bottom-link">Privacy Policy</a>
              <span className="pf-divider">•</span>
              <a href="#terms" className="pf-bottom-link">Terms of Service</a>
              <span className="pf-divider">•</span>
              <a href="#cookies" className="pf-bottom-link">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button 
          className="pf-scroll-top"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>
      )}

      {/* Background Elements */}
      <div className="pf-bg-gradient pf-gradient-1"></div>
      <div className="pf-bg-gradient pf-gradient-2"></div>

      <style>{`
        .pf-footer {
          position: relative;
          background: linear-gradient(135deg, #0a0a18 0%, #12121f 50%, #0f1419 100%);
          color: white;
          overflow: hidden;
        }

        /* Top Border */
        .pf-top-border {
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
        }

        .pf-border-gradient {
          height: 100%;
          width: 40%;
          background: linear-gradient(90deg, transparent, #667eea, #764ba2, transparent);
          animation: pf-borderSlide 3s ease-in-out infinite;
        }

        @keyframes pf-borderSlide {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(250%); }
        }

        .pf-footer-container {
          position: relative;
          z-index: 2;
          margin: 0 auto;
          padding: 0 30px;
        }

        /* CTA Section */
        .pf-cta-section {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px 0 10px;
        }

        .pf-cta-title {
          font-size: 48px;
          font-weight: 900;
          line-height: 1.2;
          margin-bottom: 20px;
          text-align: center;
        }

        .pf-cta-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .pf-cta-description {
          font-size: 18px;
          color: #cbd5e1;
          line-height: 1.8;
          margin-bottom: 32px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          text-align: center;
        }

        /* Links Section */
        .pf-links-section {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr 1.3fr;
          gap: 60px;
          padding: 80px 0 60px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .pf-footer-column {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* Brand Column */
        .pf-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .pf-brand-logo {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .pf-brand-name {
          font-size: 24px;
          font-weight: 900;
          color: white;
        }

        .pf-brand-tagline {
          font-size: 14px;
          color: #94a3b8;
          line-height: 1.7;
          margin-bottom: 8px;
        }

        .pf-contact-info {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .pf-contact-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: #cbd5e1;
        }

        .pf-contact-item svg {
          color: #667eea;
          flex-shrink: 0;
        }

        /* Column Titles */
        .pf-column-title {
          font-size: 16px;
          font-weight: 800;
          color: white;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* Link Lists */
        .pf-link-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .pf-footer-link {
          font-size: 15px;
          color: #94a3b8;
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-block;
          position: relative;
        }

        .pf-footer-link:hover {
          color: #a5b4fc;
          transform: translateX(5px);
        }

        .pf-footer-link::before {
          content: '';
          position: absolute;
          left: -20px;
          top: 50%;
          transform: translateY(-50%);
          width: 12px;
          height: 2px;
          background: #667eea;
          opacity: 0;
          transition: all 0.3s ease;
        }

        .pf-footer-link:hover::before {
          opacity: 1;
          left: -15px;
        }

        /* Newsletter */
        .pf-newsletter-text {
          font-size: 14px;
          color: #94a3b8;
          line-height: 1.7;
        }

        .pf-newsletter-form {
          display: flex;
          gap: 8px;
        }

        .pf-input-group {
          position: relative;
          flex: 1;
        }

        .pf-input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          pointer-events: none;
        }

        .pf-newsletter-input {
          width: 100%;
          padding: 14px 16px 14px 48px;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 50px;
          color: white;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .pf-newsletter-input::placeholder {
          color: #64748b;
        }

        .pf-newsletter-input:focus {
          outline: none;
          border-color: rgba(102, 126, 234, 0.5);
          background: rgba(255, 255, 255, 0.08);
        }

        .pf-newsletter-btn {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border: none;
          border-radius: 50%;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .pf-newsletter-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        }

        .pf-social-links {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }

        .pf-social-link {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          color: white;
          transition: all 0.3s ease;
        }

        .pf-social-link:hover {
          background: rgba(102, 126, 234, 0.3);
          border-color: rgba(102, 126, 234, 0.5);
          transform: translateY(-3px);
        }

        /* Bottom Bar */
        .pf-bottom-bar {
          padding: 30px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .pf-bottom-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .pf-copyright {
          font-size: 14px;
          color: #94a3b8;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .pf-heart {
          color: #ef4444;
          animation: pf-heartbeat 1.5s ease-in-out infinite;
        }

        @keyframes pf-heartbeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.2); }
          50% { transform: scale(1); }
        }

        .pf-bottom-links {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .pf-bottom-link {
          font-size: 14px;
          color: #94a3b8;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .pf-bottom-link:hover {
          color: #a5b4fc;
        }

        .pf-divider {
          color: #475569;
        }

        /* Scroll to Top */
        .pf-scroll-top {
          position: fixed;
          bottom: 40px;
          right: 40px;
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border: none;
          border-radius: 50%;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
          transition: all 0.3s ease;
          z-index: 1000;
        }

        .pf-scroll-top:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(102, 126, 234, 0.5);
        }

        /* Background Gradients */
        .pf-bg-gradient {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.2;
          pointer-events: none;
        }

        .pf-gradient-1 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(102, 126, 234, 0.3), transparent);
          top: 0;
          right: 0;
        }

        .pf-gradient-2 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(118, 75, 162, 0.2), transparent);
          bottom: 0;
          left: 0;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .pf-cta-section {
            grid-template-columns: 1fr;
            gap: 60px;
          }

          .pf-cta-visual {
            height: 300px;
          }

          .pf-links-section {
            grid-template-columns: repeat(3, 1fr);
            gap: 40px;
          }

          .pf-brand-column {
            grid-column: span 3;
          }
        }

        @media (max-width: 768px) {
          .pf-footer-container {
            padding: 0 30px;
          }

          .pf-cta-section {
            padding: 60px 0 40px;
          }

          .pf-cta-title {
            font-size: 36px;
          }

          .pf-btn-primary, .pf-btn-secondary {
            width: 100%;
            justify-content: center;
          }

          .pf-links-section {
            grid-template-columns: 1fr;
            gap: 40px;
            padding: 60px 0 40px;
          }

          .pf-brand-column {
            grid-column: span 1;
          }

          .pf-bottom-content {
            flex-direction: column;
            text-align: center;
          }

          .pf-bottom-links {
            justify-content: center;
          }

          .pf-scroll-top {
            bottom: 20px;
            right: 20px;
            width: 48px;
            height: 48px;
          }

          .pf-cta-visual {
            display: none;
          }
        }
      `}</style>
    </footer>
  );
};

export default PortfolioFooter;