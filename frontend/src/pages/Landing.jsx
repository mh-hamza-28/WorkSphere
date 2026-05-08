import { Link } from 'react-router-dom'
import { 
  ArrowRight, 
  CheckCircle, 
  Users, 
  FolderKanban, 
  BarChart3, 
  Zap, 
  Shield,
  Rocket,
  Star,
  TrendingUp
} from 'lucide-react'
import './Landing.css'

const Landing = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Manage Projects with
            <span className="gradient-text"> WorkSphere</span>
          </h1>
          <p className="hero-subtitle">
            The ultimate project management solution for teams who want to collaborate efficiently, 
            track progress seamlessly, and deliver results faster.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Sign In
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1">
            <div className="card-icon projects">
              <FolderKanban size={24} />
            </div>
            <div className="card-info">
              <div className="card-title">Project Alpha</div>
              <div className="card-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '75%' }}></div>
                </div>
                <span>75%</span>
              </div>
            </div>
          </div>
          <div className="floating-card card-2">
            <div className="card-icon tasks">
              <CheckCircle size={24} />
            </div>
            <div className="card-info">
              <div className="card-title">Tasks Completed</div>
              <div className="card-count">24/32</div>
            </div>
          </div>
          <div className="floating-card card-3">
            <div className="card-icon team">
              <Users size={24} />
            </div>
            <div className="card-info">
              <div className="card-title">Team Members</div>
              <div className="card-avatars">
                <div className="avatar">A</div>
                <div className="avatar">B</div>
                <div className="avatar">C</div>
                <div className="avatar more">+5</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Everything You Need</h2>
          <p className="section-subtitle">Powerful features to help your team succeed</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon blue">
              <FolderKanban size={32} />
            </div>
            <h3 className="feature-title">Project Management</h3>
            <p className="feature-description">
              Create, organize, and manage projects with ease. Track progress and keep everyone aligned.
            </p>
            <ul className="feature-list">
              <li><CheckCircle size={16} /> Unlimited projects</li>
              <li><CheckCircle size={16} /> Custom workflows</li>
              <li><CheckCircle size={16} /> Progress tracking</li>
            </ul>
          </div>
          <div className="feature-card">
            <div className="feature-icon purple">
              <Users size={32} />
            </div>
            <h3 className="feature-title">Team Collaboration</h3>
            <p className="feature-description">
              Work together seamlessly with your team. Assign tasks and collaborate in real-time.
            </p>
            <ul className="feature-list">
              <li><CheckCircle size={16} /> Role-based access</li>
              <li><CheckCircle size={16} /> Member management</li>
              <li><CheckCircle size={16} /> Real-time updates</li>
            </ul>
          </div>
          <div className="feature-card">
            <div className="feature-icon green">
              <BarChart3 size={32} />
            </div>
            <h3 className="feature-title">Task Tracking</h3>
            <p className="feature-description">
              Break down projects into manageable tasks. Track status and never miss a deadline.
            </p>
            <ul className="feature-list">
              <li><CheckCircle size={16} /> Kanban boards</li>
              <li><CheckCircle size={16} /> Subtask management</li>
              <li><CheckCircle size={16} /> Status tracking</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Get started in 3 simple steps</p>
        </div>
        <div className="steps-container">
          <div className="step-item">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3 className="step-title">Create Your Account</h3>
              <p className="step-description">
                Sign up for free in seconds. No credit card required to get started.
              </p>
            </div>
          </div>
          <div className="step-item">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3 className="step-title">Create Your First Project</h3>
              <p className="step-description">
                Set up your project, invite team members, and define your goals.
              </p>
            </div>
          </div>
          <div className="step-item">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3 className="step-title">Start Collaborating</h3>
              <p className="step-description">
                Create tasks, assign them to team members, and track progress together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-header">
          <h2 className="section-title">Loved by Teams</h2>
          <p className="section-subtitle">See what our users say about WorkSphere</p>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-rating">
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
            </div>
            <p className="testimonial-text">
              "WorkSphere has transformed how our team manages projects. The interface is intuitive and the features are exactly what we needed."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">S</div>
              <div className="author-info">
                <div className="author-name">Sarah Johnson</div>
                <div className="author-role">Product Manager</div>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-rating">
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
            </div>
            <p className="testimonial-text">
              "The task management features are incredible. We've increased our productivity by 40% since switching to WorkSphere."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">M</div>
              <div className="author-info">
                <div className="author-name">Michael Chen</div>
                <div className="author-role">Tech Lead</div>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-rating">
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
            </div>
            <p className="testimonial-text">
              "Best project management tool we've used. Simple, powerful, and the team collaboration features are top-notch."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">E</div>
              <div className="author-info">
                <div className="author-name">Emily Davis</div>
                <div className="author-role">Startup Founder</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <Rocket size={48} className="cta-icon" />
          <h2 className="cta-title">Ready to Boost Your Productivity?</h2>
          <p className="cta-subtitle">
            Join thousands of teams already using WorkSphere to manage their projects better.
          </p>
          <Link to="/register" className="btn btn-primary btn-xl">
            Get Started Now <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-icon">W</span>
              <span className="logo-text">WorkSphere</span>
            </div>
            <p className="footer-tagline">Empowering teams to achieve more together.</p>
          </div>
          <div className="footer-links">
            <div className="footer-link-group">
              <h4>Product</h4>
              <Link to="/register">Features</Link>
              <Link to="/register">Pricing</Link>
              <Link to="/register">Security</Link>
            </div>
            <div className="footer-link-group">
              <h4>Company</h4>
              <Link to="/register">About</Link>
              <Link to="/register">Blog</Link>
              <Link to="/register">Careers</Link>
            </div>
            <div className="footer-link-group">
              <h4>Support</h4>
              <Link to="/register">Help Center</Link>
              <Link to="/register">Contact</Link>
              <Link to="/register">Status</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 WorkSphere. All rights reserved.</p>
        </div>
      </footer>

      {/* Floating CTA Button */}
      <Link to="/register" className="floating-cta">
        <span className="floating-text">Let's Go</span>
        <ArrowRight size={18} />
      </Link>
    </div>
  )
}

export default Landing
