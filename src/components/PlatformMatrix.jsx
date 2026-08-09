import React, { useState } from 'react';
import { Check, X, Shield, Server, HelpCircle } from 'lucide-react';

export default function PlatformMatrix() {
  const [activeTab, setActiveTab] = useState('services');

  const services = [
    { service: 'EC2 Instances', cloud: 'AWS', view: true, stop: true, start: true, sched: true, capture: false },
    { service: 'EKS Clusters', cloud: 'AWS', view: true, stop: true, start: true, sched: true, capture: true },
    { service: 'ECS Services', cloud: 'AWS', view: true, stop: true, start: true, sched: true, capture: true },
    { service: 'RDS Databases', cloud: 'AWS', view: true, stop: true, start: true, sched: true, capture: true },
    { service: 'Azure Virtual Machines', cloud: 'Azure', view: true, stop: true, start: true, sched: true, capture: false },
    { service: 'GCP Compute Instances', cloud: 'GCP', view: true, stop: true, start: true, sched: true, capture: false },
  ];

  const comparison = [
    { feature: 'Runs in your own cloud account', stratus: true, porter: false, render: false, aws: true },
    { feature: 'Multi-cloud coverage (AWS + Azure + GCP)', stratus: true, porter: false, render: false, aws: false },
    { feature: 'Cost visibility across all accounts', stratus: true, porter: 'Partial', render: false, aws: 'Partial' },
    { feature: 'Automated lifecycle agent (delete + restore)', stratus: true, porter: false, render: false, aws: false },
    { feature: 'Infrastructure drift detection', stratus: true, porter: false, render: false, aws: 'Complex' },
    { feature: 'Open source / self-hosted', stratus: true, porter: false, render: false, aws: false },
    { feature: 'Monthly Software Price', stratus: 'Free / MIT', porter: '$499+/mo', render: '$85+/mo', aws: 'AWS Usage' },
  ];

  return (
    <section className="section" id="matrix">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span className="section-label">Technical Matrix</span>
          <h2 className="section-title">Clear specifications.<br /><span className="gradient-text">No marketing fluff.</span></h2>
        </div>

        <div className="matrix-card">
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--bg-2)' }}>
            <button
              className={`cap-tab-btn ${activeTab === 'services' ? 'active' : ''}`}
              onClick={() => setActiveTab('services')}
              style={{ padding: '14px 24px' }}
            >
              Supported Cloud Infrastructure
            </button>
            <button
              className={`cap-tab-btn ${activeTab === 'compare' ? 'active' : ''}`}
              onClick={() => setActiveTab('compare')}
              style={{ padding: '14px 24px' }}
            >
              Stratus vs Alternative Solutions
            </button>
          </div>

          <div className="matrix-table-wrap">
            {activeTab === 'services' ? (
              <table className="matrix-table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Cloud</th>
                    <th>Cost Visibility</th>
                    <th>Stop Action</th>
                    <th>Start Action</th>
                    <th>Automated Schedule</th>
                    <th>State Capture</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((s, i) => (
                    <tr key={i}>
                      <td><strong>{s.service}</strong></td>
                      <td>
                        <span className={`badge ${s.cloud === 'AWS' ? 'badge-aws' : s.cloud === 'Azure' ? 'badge-azure' : 'badge-gcp'}`}>
                          {s.cloud}
                        </span>
                      </td>
                      <td className="yes-check">✓</td>
                      <td className="yes-check">✓</td>
                      <td className="yes-check">✓</td>
                      <td className="yes-check">✓</td>
                      <td>{s.capture ? <span className="yes-check">✓ State Vault</span> : <span className="no-cross">—</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="matrix-table">
                <thead>
                  <tr>
                    <th>Capability</th>
                    <th style={{ color: 'var(--accent)' }}>Stratus (Self-Hosted)</th>
                    <th>Porter</th>
                    <th>Render</th>
                    <th>AWS Native Console</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row, idx) => (
                    <tr key={idx}>
                      <td><strong>{row.feature}</strong></td>
                      <td>
                        {row.stratus === true ? (
                          <span className="yes-check">✓ Included</span>
                        ) : (
                          <strong style={{ color: 'var(--accent)' }}>{row.stratus}</strong>
                        )}
                      </td>
                      <td>
                        {row.porter === true ? <span className="yes-check">✓</span> : row.porter === false ? <span className="no-cross">✗</span> : row.porter}
                      </td>
                      <td>
                        {row.render === true ? <span className="yes-check">✓</span> : row.render === false ? <span className="no-cross">✗</span> : row.render}
                      </td>
                      <td>
                        {row.aws === true ? <span className="yes-check">✓</span> : row.aws === false ? <span className="no-cross">✗</span> : row.aws}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
