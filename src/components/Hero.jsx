import React, { useState } from 'react';
import { Github, ArrowRight, Server, DollarSign, Clock, Play, Square, Check, Layers, Zap, Shield, FileText, Lock, Users } from 'lucide-react';

export default function Hero() {
  const [panelTab, setPanelTab] = useState('control'); // 'control' | 'schedule' | 'audit' | 'security'
  
  // Tab 1 state: Resources & EKS NodeGroup scale-to-0
  const [resources, setResources] = useState([
    { id: 'eks-1', name: 'dev-cluster-us-east-1', type: 'EKS', cost: 183, state: 'Running', nodegroup: 'ng-workloads', restoreSize: 3 },
    { id: 'rds-1', name: 'db-staging-r5', type: 'RDS', cost: 280, state: 'Running', nodegroup: '-' },
    { id: 'ec2-1', name: 'worker-ec2-dev', type: 'EC2', cost: 47, state: 'Running', nodegroup: '-' },
    { id: 'ec2-2', name: 'api-prod-1', type: 'EC2', cost: 24, state: 'Running', nodegroup: '-' },
  ]);

  const [ngRestoreSize, setNgRestoreSize] = useState(3);

  // Tab 3 state: Audit Log entries matching real stratus-cloud-management schema
  const [auditEntries, setAuditEntries] = useState([
    { id: 1, time: '11:42:10 AM', user: 'alex.morgan', service: 'EKS', action: 'eks:stop-cluster', desc: 'Scaled dev-cluster-us-east-1 NodeGroup to 0 nodes (restore set to 3)', status: 'SUCCESS' },
    { id: 2, time: '11:30:05 AM', user: 'parithi', service: 'EC2', action: 'ec2:stop', desc: 'Stopped worker-ec2-dev (t3.large) via nightly schedule', status: 'SUCCESS' },
    { id: 3, time: '10:15:22 AM', user: 'system.cron', service: 'SCHEDULE', action: 'schedule:create', desc: 'Created Nightly shutdown schedule for dev environment', status: 'SUCCESS' },
    { id: 4, time: '09:00:00 AM', user: 'parithi', service: 'RDS', action: 'rds:stop-instance', desc: 'Stopped db-staging-r5 instance', status: 'SUCCESS' },
  ]);

  // Tab 2 state: Schedules
  const [selectedTemplate, setSelectedTemplate] = useState('nightly');
  const [selectedAction, setSelectedAction] = useState('stop');

  // Tab 4 state: RBAC Role
  const [activeRole, setActiveRole] = useState('admin');

  const toggleStopResource = (id) => {
    setResources(prev => prev.map(r => {
      if (r.id === id) {
        const newState = r.state === 'Running' ? 'Stopped' : 'Running';
        const actionTag = r.type === 'EKS' ? (newState === 'Stopped' ? 'eks:stop-cluster' : 'eks:start-cluster') : `${r.type.toLowerCase()}:${newState.toLowerCase()}`;
        const descText = r.type === 'EKS'
          ? (newState === 'Stopped' ? `Scaled ${r.name} NodeGroup to 0 nodes` : `Restored ${r.name} NodeGroup to ${ngRestoreSize} nodes`)
          : `${newState} ${r.name}`;

        // Append to real Audit Log
        setAuditEntries(log => [
          {
            id: Date.now(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            user: activeRole === 'admin' ? 'parithi (admin)' : 'viewer (blocked)',
            service: r.type,
            action: actionTag,
            desc: descText,
            status: activeRole === 'admin' ? 'SUCCESS' : 'BLOCKED'
          },
          ...log
        ]);

        if (activeRole === 'viewer') {
          return r; // Block mutation in viewer mode
        }

        return { ...r, state: newState };
      }
      return r;
    }));
  };

  const totalWaste = resources.filter(r => r.state === 'Running' && r.cost > 30).reduce((acc, r) => acc + r.cost, 0);

  const templates = [
    { id: 'weekend', label: 'Weekend shutdown', cron: 'Stop Fri 22:00 · Start Mon 08:00', saving: 'Save ~29%' },
    { id: 'nightly', label: 'Nightly shutdown', cron: 'Stop daily 22:00 · Start daily 07:00', saving: 'Save ~65%' },
    { id: 'business', label: 'Business hours', cron: 'Stop Mon-Fri 19:00 · Start Mon-Fri 08:00', saving: 'Save ~76%' }
  ];

  return (
    <section className="hero" id="overview">
      <div className="hero-glow-1"></div>
      <div className="hero-glow-2"></div>

      <div className="container">
        {/* Top Headline & Value Prop */}
        <div className="hero-header">
          <div className="hero-badge-pill">
            <span className="hero-stat-dot"></span>
            Open Source · Self-Hosted · AWS Multi-Account &amp; Multi-Cloud
          </div>

          <h1 className="hero-title">
            EC2 &amp; EKS Start/Stop Control.<br />
            <span className="gradient-text">NodeGroup Scale-to-0 &amp; Audit Logs.</span>
          </h1>

          <p className="hero-sub">
            Stratus scales EKS NodeGroups to 0 on stop and restores sizes on start. Feature-complete with automated cron schedules, audit logs, and TOTP 2FA role-based access control.
          </p>

          <div className="hero-ctas">
            <a
              href="https://github.com/techwor/stratus-cloud-management.git"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <Github size={18} />
              View on GitHub
            </a>
            <a href="#capabilities" className="btn-secondary">
              Platform Capabilities <ArrowRight size={16} />
            </a>
          </div>

          <div className="hero-stats-row">
            <div className="hero-stat-item">
              <strong>Multi-Account</strong> AWS Org
            </div>
            <div style={{ width: 1, height: 14, background: 'var(--border-2)' }}></div>
            <div className="hero-stat-item">
              <strong>EKS / EC2 / RDS / ECS</strong> Support
            </div>
            <div style={{ width: 1, height: 14, background: 'var(--border-2)' }}></div>
            <div className="hero-stat-item">
              <strong>Audit &amp; TOTP 2FA</strong> Security
            </div>
          </div>
        </div>

        {/* Master Control Panel Showcase (Matching Real App Codebase) */}
        <div className="control-panel">
          {/* Top Navigation Bar Matching App Codebase */}
          <div className="panel-bar">
            <div className="panel-dots">
              <span className="dot dot-red"></span>
              <span className="dot dot-yellow"></span>
              <span className="dot dot-green"></span>
            </div>

            <div style={{ display: 'flex', gap: '4px', background: 'var(--surface-3)', padding: '3px', borderRadius: '6px' }}>
              <button
                onClick={() => setPanelTab('control')}
                style={{
                  background: panelTab === 'control' ? 'var(--accent)' : 'transparent',
                  color: panelTab === 'control' ? '#000' : 'var(--text-2)',
                  border: 'none',
                  padding: '5px 14px',
                  borderRadius: '4px',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Server size={13} /> EC2 / EKS Start-Stop
              </button>
              <button
                onClick={() => setPanelTab('schedule')}
                style={{
                  background: panelTab === 'schedule' ? 'var(--accent)' : 'transparent',
                  color: panelTab === 'schedule' ? '#000' : 'var(--text-2)',
                  border: 'none',
                  padding: '5px 14px',
                  borderRadius: '4px',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Clock size={13} /> Schedules &amp; Presets
              </button>
              <button
                onClick={() => setPanelTab('audit')}
                style={{
                  background: panelTab === 'audit' ? 'var(--accent)' : 'transparent',
                  color: panelTab === 'audit' ? '#000' : 'var(--text-2)',
                  border: 'none',
                  padding: '5px 14px',
                  borderRadius: '4px',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <FileText size={13} /> Audit Log
              </button>
              <button
                onClick={() => setPanelTab('security')}
                style={{
                  background: panelTab === 'security' ? 'var(--accent)' : 'transparent',
                  color: panelTab === 'security' ? '#000' : 'var(--text-2)',
                  border: 'none',
                  padding: '5px 14px',
                  borderRadius: '4px',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Lock size={13} /> Security &amp; RBAC
              </button>
            </div>

            <span className={`badge ${totalWaste > 0 ? 'badge-red' : 'badge-green'}`} style={{ fontSize: '11px' }}>
              {totalWaste > 0 ? `$${totalWaste}/mo potential waste` : 'Optimal State'}
            </span>
          </div>

          {/* PANEL TAB 1: EC2 & EKS Start/Stop Control */}
          {panelTab === 'control' && (
            <div className="panel-side" style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '24px' }}>
              <div>
                <div className="panel-head" style={{ marginBottom: '12px' }}>
                  <span className="panel-head-title">
                    <Server size={15} style={{ color: 'var(--accent)' }} /> EC2 &amp; EKS Resource Management
                  </span>
                  <span className="badge badge-aws">AWS Organization</span>
                </div>

                <div className="resource-list">
                  {resources.map(r => (
                    <div key={r.id} className="resource-row">
                      <div className="resource-info">
                        <span className="badge badge-aws">{r.type}</span>
                        <div>
                          <div className="resource-name">{r.name}</div>
                          <div className="resource-sub">
                            us-east-1 · {r.state} {r.type === 'EKS' && `(NodeGroup: ${r.state === 'Stopped' ? '0 nodes' : `${ngRestoreSize} nodes`})`}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span className={`resource-cost ${r.state === 'Stopped' ? 'term-dim' : 'cost-red'}`}>
                          {r.state === 'Stopped' ? '$0/mo' : `$${r.cost}/mo`}
                        </span>
                        <button
                          className="btn-outline"
                          style={{
                            padding: '5px 12px',
                            fontSize: '12px',
                            background: r.state === 'Running' ? 'rgba(240, 85, 85, 0.1)' : 'rgba(0, 184, 122, 0.1)',
                            borderColor: r.state === 'Running' ? 'rgba(240, 85, 85, 0.3)' : 'rgba(0, 184, 122, 0.3)',
                            color: r.state === 'Running' ? 'var(--red)' : 'var(--accent)'
                          }}
                          onClick={() => toggleStopResource(r.id)}
                        >
                          {r.state === 'Running' ? 'Stop' : 'Start'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side: EKS NodeGroup Modal Configurator */}
              <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border-2)', borderRadius: 'var(--radius)', padding: '16px' }}>
                <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '6px' }}>EKS Scale-to-0 &amp; Restore Modal</div>
                <p style={{ fontSize: '12px', color: 'var(--text-2)', marginBottom: '14px', lineHeight: '1.5' }}>
                  Stopping an EKS cluster scales NodeGroups (desired/min/max) down to <strong>0 nodes</strong>. On start, nodes restore to your target size.
                </p>

                <div className="control-label" style={{ marginBottom: 6 }}>Target Restore Size on Start:</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={ngRestoreSize}
                    onChange={(e) => setNgRestoreSize(Number(e.target.value))}
                    className="slider-range"
                    style={{ flex: 1 }}
                  />
                  <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                    {ngRestoreSize} nodes
                  </span>
                </div>

                <div style={{ background: 'rgba(0, 184, 122, 0.08)', border: '1px solid rgba(0,184,122,0.2)', padding: '10px', borderRadius: 'var(--radius-sm)', fontSize: '12px' }}>
                  <div style={{ fontWeight: 600, color: 'var(--accent)' }}>✓ Pods Evicted Safely</div>
                  <div style={{ color: 'var(--text-2)' }}>100% EC2 node charges stopped while at 0 nodes.</div>
                </div>
              </div>
            </div>
          )}

          {/* PANEL TAB 2: Schedules & Presets */}
          {panelTab === 'schedule' && (
            <div className="panel-side" style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <div className="control-label" style={{ marginBottom: 8 }}>Schedule Quick Templates:</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {templates.map(t => (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTemplate(t.id)}
                      style={{
                        background: selectedTemplate === t.id ? 'var(--surface-3)' : 'var(--surface-2)',
                        border: selectedTemplate === t.id ? '1px solid var(--accent)' : '1px solid var(--border)',
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '13px'
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: 600, color: selectedTemplate === t.id ? 'var(--accent)' : 'var(--text)' }}>
                          {t.label}
                        </span>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-3)' }}>{t.cron}</div>
                      </div>
                      <span className="badge badge-green">{t.saving}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="control-label" style={{ marginBottom: 8 }}>Configured Cron Schedule Expression:</div>
                <div style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border-2)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '16px',
                  marginBottom: '16px'
                }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-2)', marginBottom: '4px' }}>Paired Stop + Start Group</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700, color: 'var(--accent)' }}>
                    Stop: 0 22 * * 1-5 · Start: 0 7 * * 1-5
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-3)', marginTop: '4px' }}>
                    Automatically turns off target EC2 instances &amp; EKS node groups during off-hours.
                  </div>
                </div>

                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  <Clock size={15} /> Save Scheduled Job
                </button>
              </div>
            </div>
          )}

          {/* PANEL TAB 3: Audit Log (Matching Real App Codebase) */}
          {panelTab === 'audit' && (
            <div className="panel-side" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Append-Only Mutating Action Audit Log
                </div>
                <span className="badge badge-green">Real-Time Audit Trail</span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'var(--surface-2)', color: 'var(--text-2)', borderBottom: '1px solid var(--border)' }}>
                      <th style={{ padding: '10px 14px' }}>Timestamp</th>
                      <th style={{ padding: '10px 14px' }}>User</th>
                      <th style={{ padding: '10px 14px' }}>Service</th>
                      <th style={{ padding: '10px 14px' }}>Action Badge</th>
                      <th style={{ padding: '10px 14px' }}>Description</th>
                      <th style={{ padding: '10px 14px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditEntries.map(entry => (
                      <tr key={entry.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-3)' }}>{entry.time}</td>
                        <td style={{ padding: '10px 14px', fontWeight: 600 }}>{entry.user}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <span className="badge badge-aws">{entry.service}</span>
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <span className={`badge ${entry.action.includes('stop') ? 'badge-red' : 'badge-green'}`}>
                            {entry.action}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px', color: 'var(--text-2)', fontSize: '12.5px' }}>{entry.desc}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <span className={`badge ${entry.status === 'SUCCESS' ? 'badge-green' : 'badge-red'}`}>
                            {entry.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PANEL TAB 4: Security & Role-Based Access Control (RBAC) */}
          {panelTab === 'security' && (
            <div className="panel-side" style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border-2)', borderRadius: 'var(--radius)', padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Shield size={18} style={{ color: 'var(--accent)' }} />
                  <strong style={{ fontSize: '15px' }}>Role-Based Access Control (RBAC)</strong>
                </div>
                <p style={{ fontSize: '12.5px', color: 'var(--text-2)', marginBottom: '14px', lineHeight: '1.5' }}>
                  Stratus enforces <strong>Admin</strong> (full mutate access) vs <strong>Viewer</strong> (read-only; mutating API requests blocked).
                </p>

                <div className="control-label" style={{ marginBottom: 6 }}>Switch Active Session Role:</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className={`btn-secondary ${activeRole === 'admin' ? 'btn-primary' : ''}`}
                    onClick={() => setActiveRole('admin')}
                    style={{ flex: 1 }}
                  >
                    Admin (Full Access)
                  </button>
                  <button
                    className={`btn-secondary ${activeRole === 'viewer' ? 'btn-primary' : ''}`}
                    onClick={() => setActiveRole('viewer')}
                    style={{ flex: 1 }}
                  >
                    Viewer (Read-Only)
                  </button>
                </div>
              </div>

              <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border-2)', borderRadius: 'var(--radius)', padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Lock size={18} style={{ color: 'var(--cyan)' }} />
                  <strong style={{ fontSize: '15px' }}>TOTP 2-Factor Authentication</strong>
                </div>
                <p style={{ fontSize: '12.5px', color: 'var(--text-2)', marginBottom: '14px', lineHeight: '1.5' }}>
                  Per-user TOTP 2FA compatible with Google Authenticator, 1Password, Authy, and Apple Passwords.
                </p>
                <div className="badge badge-green">✓ TOTP 2FA Active</div>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
