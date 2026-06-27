import React, { useState } from 'react';

export default function LandingPage({ onLaunchConsole }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [demoActive, setDemoActive] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', transition: 'all 0.3s' }}>
      {/* Premium Header */}
      <header className="navbar" style={{ padding: '0 5%', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px', filter: 'drop-shadow(0 0 8px rgba(37, 99, 235, 0.4))' }}>🛡️</span>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.5px' }}>SafeSyn AI</h1>
            <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>HEALTHCARE INTELLIGENCE</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn-secondary" onClick={() => {
            const contactSection = document.getElementById('contact');
            contactSection?.scrollIntoView({ behavior: 'smooth' });
          }}>
            Contact Sales
          </button>
          <button className="btn-primary" onClick={onLaunchConsole}>
            Get Started <span style={{ marginLeft: '4px' }}>🚀</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero" style={{ padding: '140px 24px 100px 24px' }}>
        <div className="landing-glow-blob" />
        <div style={{ position: 'relative', zIndex: 5, maxWidth: '1000px', margin: '0 auto' }}>
          <div className="badge badge-cyan" style={{ marginBottom: '24px', padding: '6px 14px' }}>
            ✨ SafeSyn Enterprise V2.0
          </div>
          <h2 style={{ fontSize: '54px', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: '24px' }}>
            Transform Sensitive Healthcare Data Into <br />
            <span className="gradient-text">Privacy-Preserving Intelligence.</span>
          </h2>
          <p style={{ fontSize: '18px', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto 40px auto', lineHeight: 1.6, fontWeight: 500 }}>
            Generate high-fidelity, fully de-identified synthetic EHR datasets, FHIR endpoints, and clinical records using advanced generative models backed by mathematical Differential Privacy.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <button className="btn-primary" style={{ padding: '14px 36px', fontSize: '15px' }} onClick={onLaunchConsole}>
              Launch Dashboard Console
            </button>
            <button className="btn-secondary" style={{ padding: '14px 36px', fontSize: '15px' }} onClick={() => setDemoActive(true)}>
              Watch Demo Video ⚡
            </button>
          </div>

          {/* Quick Metrics Badge Row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '32px', marginTop: '80px' }}>
            <div>
              <h4 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-primary)' }}>100%</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>HIPAA Compliance</p>
            </div>
            <div style={{ width: '1px', backgroundColor: 'var(--border-color)', height: '40px' }} />
            <div>
              <h4 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-secondary)' }}>&lt; 0.01%</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Empirical Leakage Risk</p>
            </div>
            <div style={{ width: '1px', backgroundColor: 'var(--border-color)', height: '40px' }} />
            <div>
              <h4 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-accent)' }}>94.2%</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>EHR Fidelity score</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features Bento Grid */}
      <section style={{ padding: '80px 5%', maxWidth: '1400px', margin: '0 auto' }}>
        <h3 style={{ fontSize: '32px', fontWeight: 800, textAlign: 'center', marginBottom: '16px' }}>
          Engineered for Modern Clinical Analytics
        </h3>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '56px', maxWidth: '600px', margin: '0 auto 56px auto' }}>
          Complete safety compliance meets robust model accuracy, giving you the datasets you need without legal liabilities.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {/* Feature 1 */}
          <div className="glass-panel glass-panel-hover" style={{ padding: '32px' }}>
            <span style={{ fontSize: '32px' }}>🧠</span>
            <h4 style={{ fontSize: '20px', fontWeight: 700, margin: '16px 0 8px 0' }}>CTGAN & GenAI Models</h4>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Utilize specialized deep generative neural networks fine-tuned on medical semantics to mimic complex patient correlations.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-panel glass-panel-hover" style={{ padding: '32px' }}>
            <span style={{ fontSize: '32px' }}>🔒</span>
            <h4 style={{ fontSize: '20px', fontWeight: 700, margin: '16px 0 8px 0' }}>Differential Privacy (ε, δ)</h4>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Inject mathematically calibrated noise during model training to provide provable protection against linkage attacks.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-panel glass-panel-hover" style={{ padding: '32px' }}>
            <span style={{ fontSize: '32px' }}>📂</span>
            <h4 style={{ fontSize: '20px', fontWeight: 700, margin: '16px 0 8px 0' }}>Multi-format Ingestion</h4>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Seamlessly import standard FHIR JSON feeds, relational database outputs, clinical CSV records, and healthcare telemetry.
            </p>
          </div>
        </div>
      </section>

      {/* AI Synthesis Workflow */}
      <section style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '80px 5%' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '32px', fontWeight: 800, textAlign: 'center', marginBottom: '56px' }}>
            How SafeSyn Works
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(37, 99, 235, 0.1)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontSize: '20px', color: 'var(--color-primary)', fontWeight: 800, marginBottom: '20px' }}>1</div>
              <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>Connect Data</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>Drag and drop FHIR JSON files or CSV lists into our secure sandboxed local uploader.</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(124, 58, 237, 0.1)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontSize: '20px', color: 'var(--color-secondary)', fontWeight: 800, marginBottom: '20px' }}>2</div>
              <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>Calibrate AI Settings</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>Select accuracy targets, sample scale parameters, and differential privacy noise levels.</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(6, 182, 212, 0.1)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontSize: '20px', color: 'var(--color-accent)', fontWeight: 800, marginBottom: '20px' }}>3</div>
              <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>Audit and Validate</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>Compare synthetic distributions with raw records side-by-side using dynamic utility charts.</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontSize: '20px', color: 'var(--color-success)', fontWeight: 800, marginBottom: '20px' }}>4</div>
              <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>Download Securely</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>Export fully structured anonymized files, model coefficients, and compliance PDF records.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team / Trust Section */}
      <section style={{ padding: '80px 5%', maxWidth: '1400px', margin: '0 auto' }}>
        <h3 style={{ fontSize: '32px', fontWeight: 800, textAlign: 'center', marginBottom: '16px' }}>
          Backed by Leading Privacy Researchers
        </h3>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '56px', maxWidth: '600px', margin: '0 auto 56px auto' }}>
          SafeSyn combines cryptographic privacy methods with cutting-edge medical informatics.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: 'var(--border-color)', margin: '0 auto 16px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>🔬</div>
            <h4 style={{ fontSize: '18px', fontWeight: 700 }}>Dr. Evelyn Vance</h4>
            <p style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 600, marginBottom: '8px' }}>Chief Science Officer</p>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Former MIT Privacy Fellow specializing in Differential Privacy.</p>
          </div>
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: 'var(--border-color)', margin: '0 auto 16px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>💻</div>
            <h4 style={{ fontSize: '18px', fontWeight: 700 }}>Marcus Thorne</h4>
            <p style={{ fontSize: '12px', color: 'var(--color-secondary)', fontWeight: 600, marginBottom: '8px' }}>VP of Engineering</p>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Infrastructure architect, ex-Google Health Core Systems engineer.</p>
          </div>
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: 'var(--border-color)', margin: '0 auto 16px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>⚖️</div>
            <h4 style={{ fontSize: '18px', fontWeight: 700 }}>Sarah Jenkins</h4>
            <p style={{ fontSize: '12px', color: 'var(--color-accent)', fontWeight: 600, marginBottom: '8px' }}>Compliance Officer</p>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Legal expert specialized in international healthcare regulations.</p>
          </div>
        </div>
      </section>

      {/* Interactive Contact Form */}
      <section id="contact" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', padding: '80px 5%' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="glass-panel" style={{ padding: '40px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px', textAlign: 'center' }}>
              Connect With Our Team
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '24px' }}>
              Request a demo, ask questions about our compliance frameworks, or request specialized evaluations.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Work Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="john@hospital.org"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Message</label>
                <textarea
                  className="form-input"
                  rows="4"
                  placeholder="Tell us about your synthetic data requirements..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>

              {submitted && (
                <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', fontSize: '13px', fontWeight: 600, textAlign: 'center' }}>
                  ✓ Request sent successfully! We'll reply within 24 hours.
                </div>
              )}

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px' }}>
                Submit Request ⚡
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Demo Video Modal */}
      {demoActive && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', padding: '24px', position: 'relative' }}>
            <button
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '20px', cursor: 'pointer' }}
              onClick={() => setDemoActive(false)}
            >
              ✕
            </button>
            <h4 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>SafeSyn Product Showcase</h4>
            <div style={{ aspectRatio: '16/9', backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', color: '#FFF' }}>
              <span style={{ fontSize: '48px' }}>🎥</span>
              <p style={{ fontSize: '14px', fontWeight: 600 }}>Interactive demo video simulation playing...</p>
              <button className="btn-primary" onClick={() => { setDemoActive(false); onLaunchConsole(); }}>
                Launch Console Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '32px 5%', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
        <p>© 2026 SafeSyn AI. All rights reserved. Mathematical privacy systems.</p>
        <div style={{ display: 'flex', gap: '24px' }}>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>HIPAA Statement</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>GDPR Compliance</a>
        </div>
      </footer>
    </div>
  );
}
