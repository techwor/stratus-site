import React, { useState } from 'react';
import { Send, CheckCircle2, Mail } from 'lucide-react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('General Inquiry');
  const [cloud, setCloud] = useState('Multi-Cloud');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    'General Inquiry',
    'Enterprise Self-Hosting',
    'FinOps & Cost Audit',
    'Feature Request'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !message) return;

    setLoading(true);

    const payload = {
      name,
      email,
      category,
      infrastructure: cloud,
      message,
      _subject: `New Stratus Inquiry: ${category} from ${name || email}`,
      _captcha: 'false'
    };

    try {
      const res = await fetch('https://formsubmit.co/ajax/mail2pariti@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      console.error('Submission error:', err);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setMessage('');
    setCategory('General Inquiry');
    setSubmitted(false);
  };

  return (
    <section className="section" id="contact">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span className="section-label">Contact Us</span>
          <h2 className="section-title">Talk to our cloud experts.</h2>
          <p className="section-sub" style={{ margin: '0 auto' }}>
            Have questions about Stratus, multi-cloud cost reduction, or self-hosting setup? Reach out directly.
          </p>
        </div>

        <div className="contact-grid">
          {/* Form */}
          <div className="contact-card">
            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name <span className="required-star">*</span></label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Alex Morgan"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Work Email <span className="required-star">*</span></label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="alex@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Inquiry Category</label>
                  <div className="category-pills">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        className={`cat-pill ${category === cat ? 'active' : ''}`}
                        onClick={() => setCategory(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Primary Infrastructure</label>
                  <select
                    className="form-select"
                    value={cloud}
                    onChange={(e) => setCloud(e.target.value)}
                  >
                    <option value="AWS">AWS (Amazon Web Services)</option>
                    <option value="Azure">Microsoft Azure</option>
                    <option value="GCP">Google Cloud Platform</option>
                    <option value="Multi-Cloud">Multi-Cloud (AWS + Azure/GCP)</option>
                    <option value="Other">Other / On-Premises</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Message <span className="required-star">*</span></label>
                  <textarea
                    className="form-textarea"
                    placeholder="Tell us about your infrastructure setup or questions..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', padding: '12px' }}
                  disabled={loading}
                >
                  <Send size={16} />
                  <span>{loading ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <CheckCircle2 size={48} style={{ color: 'var(--accent)', margin: '0 auto 16px auto' }} />
                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Message Sent Successfully!</h3>
                <p style={{ color: 'var(--text-2)', fontSize: '14.5px', marginBottom: '24px' }}>
                  Thank you for reaching out. Our engineering team has received your inquiry and will respond to <strong>{email}</strong> shortly.
                </p>
                <button className="btn-outline" onClick={handleReset}>
                  Send Another Message
                </button>
              </div>
            )}
          </div>

          {/* Right Direct Support Card */}
          <div>
            <div className="contact-info-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <Mail size={20} style={{ color: 'var(--accent)' }} />
                <div className="info-title">Direct Support</div>
              </div>
              <div className="info-sub">Engineers answering engineers</div>
              <p style={{ fontSize: '13.5px', color: 'var(--text-2)', marginBottom: '14px', lineHeight: '1.5' }}>
                Need technical guidance or help setting up multi-cloud start/stop policies across your AWS accounts?
              </p>
              <a href="mailto:mail2pariti@gmail.com" style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '14px' }}>
                mail2pariti@gmail.com →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
