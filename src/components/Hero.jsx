import React, { useState } from 'react';
import { Github, ArrowRight, LayoutDashboard, Server, Layers, Database, Clock, FileText, Shield, DollarSign, Check, Square, Play, Sliders } from 'lucide-react';

export default function Hero() {
  const [activeAppTab, setActiveAppTab] = useState('dashboard'); // 'dashboard' | 'ec2' | 'eks' | 'schedules' | 'audit'

  // Mock state reflecting real app dataset
  const [instances, setInstances] = useState([
    { id: 'i-04f82a1', name: 'dev-eks-node-1', type: 't3.medium', state: 'running', account: 'Engineering-Dev', region: 'us-east-1', cost: 183, isEks: true },
    { id: 'i-089c19b', name: 'db-staging-r5', type: 'r5.large', state: 'running', account: 'Staging', region: 'us-east-1', cost: 280, isEks: false },
    { id: 'i-019d82e', name: 'worker-ec2-dev', type: 't3.large', state: 'running', account: 'Engineering-Dev', region: 'us-east-1', cost: 47, isEks: false },
    { id: 'i-091a82f', name: 'api-prod-1', type: 't3.medium', state: 'running', account: 'Production', region: 'us-east-1', cost: 24, isEks: false },
  ]);

  const [ngRestoreSize, setNgRestoreSize] = useState(3);
  const [selectedPreset, setSelectedPreset] = useState('nightly');

  const [auditLogs, setAuditLogs] = useState([
    { id: 1, time: '11:58:12 AM', user: 'parithi (admin)', action: 'eks:stop-cluster', desc: 'Scaled dev-cluster-us-east-1 NodeGroup to 0 nodes', status: 'SUCCESS' },
    { id: 2, time: '11:45:00 AM', user: 'parithi (admin)', action: 'ec2:stop', desc: 'Stopped worker-ec2-dev (t3.large)', status: 'SUCCESS' },
    { id: 3, time: '09:00:00 AM', user: 'system.cron', action: 'schedule:create', desc: 'Created Nightly shutdown schedule for dev accounts', status: 'SUCCESS' },
  ]);

  const toggleInstance = (id) => {
    setInstances(prev => prev.map(inst => {
      if (inst.id === id) {
        const nextState = inst.state === 'running' ? 'stopped' : 'running';
        const actionName = inst.isEks
          ? (nextState === 'stopped' ? 'eks:stop-cluster' : 'eks:start-cluster')
          : `ec2:${nextState}`;

        const actionDesc = inst.isEks
          ? (nextState === 'stopped' ? `Scaled ${inst.name} NodeGroup to 0 nodes` : `Restored ${inst.name} NodeGroup to ${ngRestoreSize} nodes`)
          : `${nextState === 'stopped' ? 'Stopped' : 'Started'} ${inst.name}`;

        setAuditLogs(logs => [
          {
            id: Date.now(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            user: 'parithi (admin)',
            action: actionName,
            desc: actionDesc,
            status: 'SUCCESS'
          },
          ...logs
        ]);

        return { ...inst, state: nextState };
      }
      return inst;
    }));
  };

  const totalWaste = instances.filter(i => i.state === 'running' && i.cost > 30).reduce((acc, i) => acc + i.cost, 0);

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
        {/* Hero Header */}
        <div className="hero-header">
          <div className="hero-badge-pill">
            <span className="hero-stat-dot"></span>
            Open Source · Self-Hosted · Multi-Account AWS Organization
          </div>

          <h1 className="hero-title">
            Self-hosted multi-cloud management.<br />
            <span className="gradient-text">Cost visibility &amp; automated start/stop.</span>
          </h1>

          <p className="hero-sub">
            Stratus gives DevOps engineers complete cost visibility and automated start/stop schedule policies over EC2, EKS, RDS, and ECS — scaling EKS NodeGroups to 0 and stopping idle waste automatically.
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
              <strong>EC2 / EKS / RDS / ECS</strong> Inventory
            </div>
            <div style={{ width: 1, height: 14, background: 'var(--border-2)' }}></div>
            <div className="hero-stat-item">
              <strong>Audit Log &amp; TOTP 2FA</strong> Security
            </div>
          </div>
        </div>

        {/* Stratus App UI Showcase (Replicating stratus-cloud-management Sidebar & Main Tabs) */}
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
                onClick={() => setActiveAppTab('dashboard')}
                style={{
                  background: activeAppTab === 'dashboard' ? 'var(--accent)' : 'transparent',
                  color: activeAppTab === 'dashboard' ? '#000' : 'var(--text-2)',
                  border: 'none',
                  padding: '5px 12px',
                  borderRadius: '4px',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <LayoutDashboard size={13} /> Dashboard
              </button>
              <button
                onClick={() => setActiveAppTab('ec2')}
                style={{
                  background: activeAppTab === 'ec2' ? 'var(--accent)' : 'transparent',
                  color: activeAppTab === 'ec2' ? '#000' : 'var(--text-2)',
                  border: 'none',
                  padding: '5px 12px',
                  borderRadius: '4px',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Server size={13} /> EC2 Instances
              </button>
              <button
                onClick={() => setActiveAppTab('eks')}
                style={{
                  background: activeAppTab === 'eks' ? 'var(--accent)' : 'transparent',
                  color: activeAppTab === 'eks' ? '#000' : 'var(--text-2)',
                  border: 'none',
                  padding: '5px 12px',
                  borderRadius: '4px',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Layers size={13} /> EKS Clusters
              </button>
              <button
                onClick={() => setActiveAppTab('schedules')}
                style={{
                  background: activeAppTab === 'schedules' ? 'var(--accent)' : 'transparent',
                  color: activeAppTab === 'schedules' ? '#000' : 'var(--text-2)',
                  border: 'none',
                  padding: '5px 12px',
                  borderRadius: '4px',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Clock size={13} /> Schedules
              </button>
              <button
                onClick={() => setActiveAppTab('audit')}
                style={{
                  background: activeAppTab === 'audit' ? 'var(--accent)' : 'transparent',
                  color: activeAppTab === 'audit' ? '#000' : 'var(--text-2)',
                  border: 'none',
                  padding: '5px 12px',
                  borderRadius: '4px',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <FileText size={13} /> Audit Log
              </button>
            </div>

            <span className={`badge ${totalWaste > 0 ? 'badge-red' : 'badge-green'}`} style={{ fontSize: '11px' }}>
              {totalWaste > 0 ? `$${totalWaste}/mo waste detected` : 'Optimal State'}
            </span>
          </div>

          {/* TAB 1: DASHBOARD TAB */}
          {activeAppTab === 'dashboard' && (
            <div className="panel-side" style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
                <div style={{ background: 'var(--surface-2)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase' }}>AWS Accounts</div>
                  <div style={{ fontSize: '22px', fontWeight: 800 }}>4 Accounts</div>
                </div>
                <div style={{ background: 'var(--surface-2)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase' }}>Active Compute</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--accent)' }}>
                    {instances.filter(i => i.state === 'running').length} Running
                  </div>
                </div>
                <div style={{ background: 'var(--surface-2)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase' }}>Stopped Compute</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--yellow)' }}>
                    {instances.filter(i => i.state === 'stopped').length} Stopped
                  </div>
                </div>
                <div style={{ background: 'var(--surface-2)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase' }}>Monthly Cost Impact</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--red)' }}>
                    ${instances.filter(i => i.state === 'running').reduce((a, b) => a + b.cost, 0)}/mo
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(240, 85, 85, 0.08)', border: '1px solid rgba(240,85,85,0.25)', padding: '14px 18px', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <strong style={{ fontSize: '14px', color: 'var(--red)' }}>⚠ Savings Suggestion Detected</strong>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-2)' }}>
                    EC2 and EKS development workloads running 24/7 with zero traffic nights &amp; weekends.
                  </div>
                </div>
                <button className="btn-primary" style={{ padding: '6px 14px', fontSize: '12px' }} onClick={() => setActiveAppTab('ec2')}>
                  View Instances →
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: EC2 INSTANCES TAB */}
          {activeAppTab === 'ec2' && (
            <div className="panel-side" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-2)' }}>
                  EC2 Instance Inventory across all Org Accounts &amp; Regions
                </div>
                <span className="badge badge-aws">AWS Organization</span>
              </div>

              <div className="resource-list">
                {instances.map(inst => (
                  <div key={inst.id} className="resource-row">
                    <div className="resource-info">
                      <span className="badge badge-aws">{inst.type}</span>
                      <div>
                        <div className="resource-name">{inst.name} ({inst.id})</div>
                        <div className="resource-sub">{inst.account} · {inst.region} · state: <strong>{inst.state}</strong></div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className={`resource-cost ${inst.state === 'stopped' ? 'term-dim' : 'cost-red'}`}>
                        {inst.state === 'stopped' ? '$0/mo' : `$${inst.cost}/mo`}
                      </span>
                      <button
                        className="btn-outline"
                        style={{
                          padding: '5px 12px',
                          fontSize: '12px',
                          background: inst.state === 'running' ? 'rgba(240, 85, 85, 0.1)' : 'rgba(0, 184, 122, 0.1)',
                          borderColor: inst.state === 'running' ? 'rgba(240, 85, 85, 0.3)' : 'rgba(0, 184, 122, 0.3)',
                          color: inst.state === 'running' ? 'var(--red)' : 'var(--accent)'
                        }}
                        onClick={() => toggleInstance(inst.id)}
                      >
                        {inst.state === 'running' ? 'Stop' : 'Start'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: EKS TAB */}
          {activeAppTab === 'eks' && (
            <div className="panel-side" style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>EKS NodeGroup Scale-to-0 Control</div>
                <p style={{ fontSize: '12.5px', color: 'var(--text-2)', marginBottom: '14px', lineHeight: '1.5' }}>
                  Stopping an EKS cluster scales all NodeGroups (desired/min/max) down to <strong>0 nodes</strong> to stop EC2 compute charges completely. Starting restores NodeGroups to your restore size.
                </p>

                <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border-2)', borderRadius: 'var(--radius)', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div>
                      <strong style={{ fontSize: '14px' }}>dev-cluster-us-east-1</strong>
                      <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>NodeGroup: <code>ng-workloads</code></div>
                    </div>
                    <span className={`badge ${instances.find(i => i.isEks)?.state === 'stopped' ? 'badge-red' : 'badge-green'}`}>
                      {instances.find(i => i.isEks)?.state === 'stopped' ? 'Scaled to 0 nodes ($0/mo)' : `Active (${ngRestoreSize} nodes)`}
                    </span>
                  </div>

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

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      className="btn-primary"
                      style={{ flex: 1, background: 'var(--red)', color: '#fff' }}
                      onClick={() => toggleInstance('eks-1')}
                    >
                      Scale NodeGroup to 0 (Stop)
                    </button>
                    <button
                      className="btn-secondary"
                      style={{ flex: 1 }}
                      onClick={() => toggleInstance('eks-1')}
                    >
                      Restore to {ngRestoreSize} Nodes (Start)
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px' }}>
                <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '8px' }}>EKS Lifecycle Logic</div>
                <ul style={{ fontSize: '12.5px', color: 'var(--text-2)', paddingLeft: '18px', lineHeight: '1.7' }}>
                  <li><strong>Stop:</strong> Auto Scaling Group sizes set to 0; pod termination signals sent.</li>
                  <li><strong>Zero Compute Cost:</strong> AWS charges $0 for EC2 instances while NodeGroup count is 0.</li>
                  <li><strong>Start:</strong> ASG scaled back up to target restore size ({ngRestoreSize} nodes).</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 4: SCHEDULES TAB */}
          {activeAppTab === 'schedules' && (
            <div className="panel-side" style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <div className="control-label" style={{ marginBottom: 8 }}>Schedule Presets:</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {templates.map(t => (
                    <div
                      key={t.id}
                      onClick={() => setSelectedPreset(t.id)}
                      style={{
                        background: selectedPreset === t.id ? 'var(--surface-3)' : 'var(--surface-2)',
                        border: selectedPreset === t.id ? '1px solid var(--accent)' : '1px solid var(--border)',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '13px'
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: 600, color: selectedPreset === t.id ? 'var(--accent)' : 'var(--text)' }}>
                          {t.label}
                        </span>
                        <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>{t.cron}</div>
                      </div>
                      {selectedPreset === t.id && <Check size={14} style={{ color: 'var(--accent)' }} />}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="control-label" style={{ marginBottom: 8 }}>Active Scheduled Job Expression:</div>
                <div style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border-2)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '16px',
                  marginBottom: '16px'
                }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-2)', marginBottom: '4px' }}>Paired Stop + Start Group</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13.5px', fontWeight: 700, color: 'var(--accent)' }}>
                    Stop: 0 22 * * 1-5 · Start: 0 7 * * 1-5
                  </div>
                </div>

                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  <Clock size={15} /> Save Scheduled Job
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: AUDIT LOG TAB */}
          {activeAppTab === 'audit' && (
            <div className="panel-side" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase' }}>
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
                      <th style={{ padding: '10px 14px' }}>Action Badge</th>
                      <th style={{ padding: '10px 14px' }}>Description</th>
                      <th style={{ padding: '10px 14px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map(entry => (
                      <tr key={entry.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-3)' }}>{entry.time}</td>
                        <td style={{ padding: '10px 14px', fontWeight: 600 }}>{entry.user}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <span className={`badge ${entry.action.includes('stop') ? 'badge-red' : 'badge-green'}`}>
                            {entry.action}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px', color: 'var(--text-2)', fontSize: '12.5px' }}>{entry.desc}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <span className="badge badge-green">{entry.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
