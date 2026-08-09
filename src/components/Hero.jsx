import React, { useState } from 'react';
import { Github, ArrowRight, Server, DollarSign, Clock, Play, Square, Check, Layers, Zap, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function Hero() {
  const [panelTab, setPanelTab] = useState('active'); // 'active' | 'nodegroups' | 'strategies' | 'cron'
  
  // Tab 1 state: Active Resources
  const [resources, setResources] = useState([
    { id: 'eks-1', name: 'dev-cluster-us-east-1', type: 'EKS', cost: 183, state: 'Running', idle: true, nodegroups: [{ name: 'ng-workloads', current: 3, restore: 3 }] },
    { id: 'rds-1', name: 'db-staging-r5', type: 'RDS', cost: 280, state: 'Running', idle: true },
    { id: 'ec2-1', name: 'worker-ec2-dev', type: 'EC2', cost: 47, state: 'Running', idle: true },
    { id: 'ec2-2', name: 'api-prod-1', type: 'EC2', cost: 24, state: 'Running', idle: false },
  ]);

  // EKS NodeGroup specific state
  const [ngSize, setNgSize] = useState(3);
  const [eksState, setEksState] = useState('Running'); // 'Running' | 'Scaling to 0' | 'Stopped'

  const [terminalLog, setTerminalLog] = useState([
    { type: 'cmd', text: 'stratus scan --all-accounts' },
    { type: 'dim', text: '[Scanner] 4 active resources discovered across AWS us-east-1' },
    { type: 'red', text: '⚠ EKS cluster dev-cluster-us-east-1 running 3 nodes 24/7 -> $183/mo waste' }
  ]);

  const toggleStopResource = (id) => {
    setResources(prev => prev.map(r => {
      if (r.id === id) {
        const newState = r.state === 'Running' ? 'Stopped' : 'Running';
        const costStr = newState === 'Stopped' ? '$0' : `$${r.cost}`;
        
        if (r.type === 'EKS') {
          if (newState === 'Stopped') {
            setEksState('Stopped');
            setTerminalLog(logs => [
              ...logs,
              { type: 'cmd', text: `stratus eks stop dev-cluster-us-east-1 --restore-size ${ngSize}` },
              { type: 'dim', text: '[EKS] Scaling NodeGroup ng-workloads desiredSize: 3 -> 0 (pods evicted)' },
              { type: 'green', text: '✓ Cluster stopped! NodeGroup scaled to 0. Saved $183/mo (Restore size set to ' + ngSize + ')' }
            ]);
          } else {
            setEksState('Running');
            setTerminalLog(logs => [
              ...logs,
              { type: 'cmd', text: `stratus eks start dev-cluster-us-east-1` },
              { type: 'dim', text: `[EKS] Scaling NodeGroup ng-workloads desiredSize: 0 -> ${ngSize}` },
              { type: 'green', text: `✓ Cluster started! Restored ${ngSize} nodes. Endpoint active.` }
            ]);
          }
        } else {
          setTerminalLog(logs => [
            ...logs,
            { type: 'cmd', text: `stratus lifecycle ${newState.toLowerCase()} ${r.name}` },
            { type: 'green', text: `✓ ${r.name} ${newState.toLowerCase()}! Net cost: ${costStr}/mo` }
          ]);
        }
        
        return { ...r, state: newState };
      }
      return r;
    }));
  };

  const [selectedStrategy, setSelectedStrategy] = useState('nightly');
  const [selectedAction, setSelectedAction] = useState('stop-recurring');
  const [selectedTemplate, setSelectedTemplate] = useState('nightly');

  const totalWaste = resources.filter(r => r.idle && r.state === 'Running').reduce((acc, r) => acc + r.cost, 0);

  const strategies = [
    { id: 'nightly', label: 'Nightly Shutdown', desc: 'Stop at 10 PM, start at 7 AM on all days', savingPct: '65%', savingAmt: '$332/mo', color: '#00b87a', bg: 'rgba(0, 184, 122, 0.08)', icon: '🌙' },
    { id: 'weekend', label: 'Weekend Shutdown', desc: 'Stop Friday 10 PM, start Monday 8 AM', savingPct: '29%', savingAmt: '$148/mo', color: '#00a0c8', bg: 'rgba(0, 160, 200, 0.08)', icon: '📅' },
    { id: 'both', label: 'Nights + Weekends', desc: 'Off outside business hours (76% off-peak)', savingPct: '76%', savingAmt: '$388/mo', color: '#f5c842', bg: 'rgba(245, 200, 66, 0.08)', icon: '💸' },
    { id: 'permanent', label: 'Permanent Stop & Capture', desc: 'Scale node groups to 0 / capture config state', savingPct: '100%', savingAmt: '$510/mo', color: '#f05555', bg: 'rgba(240, 85, 85, 0.08)', icon: '🗑️' }
  ];

  const templates = [
    { id: 'weekend', label: 'Weekend shutdown', cron: 'Stop Fri 22:00 · Start Mon 08:00' },
    { id: 'nightly', label: 'Nightly shutdown', cron: 'Stop daily 22:00 · Start daily 07:00' },
    { id: 'business', label: 'Business hours', cron: 'Stop Mon-Fri 19:00 · Start Mon-Fri 08:00' }
  ];

  return (
    <section className="hero" id="overview">
      <div className="hero-glow-1"></div>
      <div className="hero-glow-2"></div>

      <div className="container">
        {/* Top Headline & Pitch */}
        <div className="hero-header">
          <div className="hero-badge-pill">
            <span className="hero-stat-dot"></span>
            Open Source · Self-Hosted · AWS / Azure / GCP
          </div>

          <h1 className="hero-title">
            EC2 &amp; EKS Start/Stop Control.<br />
            <span className="gradient-text">NodeGroup Scaling to 0 &amp; Auto Schedules.</span>
          </h1>

          <p className="hero-sub">
            Stratus scales EKS NodeGroups to 0 on stop and restores desired sizes on start. Combine with automated cron schedules over EC2, EKS, and RDS to eliminate idle cloud waste.
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

          {/* Key Feature Highlight Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(0, 184, 122, 0.08)',
            border: '1px solid rgba(0, 184, 122, 0.25)',
            padding: '10px 20px',
            borderRadius: 'var(--radius)',
            marginBottom: '28px',
            fontSize: '13.5px'
          }}>
            <Zap size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
            <span>
              <strong>EKS NodeGroup Control:</strong> Stopping EKS scales NodeGroups desired/min/max to 0. Starting restores pre-configured NodeGroup sizes automatically.
            </span>
          </div>

          <div className="hero-stats-row">
            <div className="hero-stat-item">
              <strong>3</strong> Cloud Providers
            </div>
            <div style={{ width: 1, height: 14, background: 'var(--border-2)' }}></div>
            <div className="hero-stat-item">
              <strong>$0</strong> Vendor Lock-in
            </div>
            <div style={{ width: 1, height: 14, background: 'var(--border-2)' }}></div>
            <div className="hero-stat-item">
              <strong>MIT</strong> Open License
            </div>
          </div>
        </div>

        {/* Master Control Panel Showcase */}
        <div className="control-panel">
          {/* Top Bar */}
          <div className="panel-bar">
            <div className="panel-dots">
              <span className="dot dot-red"></span>
              <span className="dot dot-yellow"></span>
              <span className="dot dot-green"></span>
            </div>

            <div style={{ display: 'flex', gap: '4px', background: 'var(--surface-3)', padding: '3px', borderRadius: '6px' }}>
              <button
                onClick={() => setPanelTab('active')}
                style={{
                  background: panelTab === 'active' ? 'var(--accent)' : 'transparent',
                  color: panelTab === 'active' ? '#000' : 'var(--text-2)',
                  border: 'none',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Server size={13} /> Active Monitor &amp; Log
              </button>
              <button
                onClick={() => setPanelTab('nodegroups')}
                style={{
                  background: panelTab === 'nodegroups' ? 'var(--accent)' : 'transparent',
                  color: panelTab === 'nodegroups' ? '#000' : 'var(--text-2)',
                  border: 'none',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Layers size={13} /> EKS NodeGroup Scaling
              </button>
              <button
                onClick={() => setPanelTab('strategies')}
                style={{
                  background: panelTab === 'strategies' ? 'var(--accent)' : 'transparent',
                  color: panelTab === 'strategies' ? '#000' : 'var(--text-2)',
                  border: 'none',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <DollarSign size={13} /> Downtime Strategies
              </button>
              <button
                onClick={() => setPanelTab('cron')}
                style={{
                  background: panelTab === 'cron' ? 'var(--accent)' : 'transparent',
                  color: panelTab === 'cron' ? '#000' : 'var(--text-2)',
                  border: 'none',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Clock size={13} /> Schedule Engine
              </button>
            </div>

            <span className={`badge ${totalWaste > 0 ? 'badge-red' : 'badge-green'}`} style={{ fontSize: '11px' }}>
              {totalWaste > 0 ? `$${totalWaste}/mo waste` : 'Optimal State'}
            </span>
          </div>

          {/* TAB A: Active Resources & Live Console */}
          {panelTab === 'active' && (
            <div className="panel-grid">
              <div className="panel-side">
                <div className="panel-head">
                  <span className="panel-head-title">
                    <DollarSign size={15} style={{ color: 'var(--accent)' }} /> Multi-Cloud Inventory
                  </span>
                  <span className="badge badge-aws">AWS us-east-1</span>
                </div>

                <div className="resource-list">
                  {resources.map(r => (
                    <div key={r.id} className="resource-row">
                      <div className="resource-info">
                        <span className="badge badge-aws">{r.type}</span>
                        <div>
                          <div className="resource-name">{r.name}</div>
                          <div className="resource-sub">
                            us-east-1 · {r.state} {r.type === 'EKS' && `(NodeGroup: ${r.state === 'Stopped' ? '0 nodes' : `${ngSize} nodes`})`}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span className={`resource-cost ${r.state === 'Stopped' ? 'term-dim' : r.idle ? 'cost-red' : ''}`}>
                          {r.state === 'Stopped' ? '$0/mo' : `$${r.cost}/mo`}
                        </span>
                        <button
                          className="btn-outline"
                          style={{ padding: '4px 10px', fontSize: '12px' }}
                          onClick={() => toggleStopResource(r.id)}
                        >
                          {r.state === 'Running' ? 'Stop' : 'Start'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel-side" style={{ background: '#090c0e' }}>
                <div className="panel-head">
                  <span className="panel-head-title" style={{ color: 'var(--text-3)' }}>
                    <Clock size={14} /> Execution Trail Log
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                    ● Live Audit Log
                  </span>
                </div>

                <div className="terminal-body">
                  {terminalLog.map((log, idx) => (
                    <div key={idx} className="term-row">
                      {log.type === 'cmd' && (
                        <>
                          <span className="term-prompt">$</span>
                          <span className="term-cmd">{log.text}</span>
                        </>
                      )}
                      {log.type === 'dim' && <span className="term-dim">{log.text}</span>}
                      {log.type === 'green' && <span className="term-green">{log.text}</span>}
                      {log.type === 'red' && <span className="term-red">{log.text}</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB B: EKS NodeGroup Scaling Modal & Controls */}
          {panelTab === 'nodegroups' && (
            <div className="panel-side" style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>EKS NodeGroup Scale-to-0 Control</div>
                <p style={{ color: 'var(--text-2)', fontSize: '13.5px', marginBottom: '16px' }}>
                  When stopping an EKS cluster, Stratus scales NodeGroups (desired/min/max) down to <strong>0 nodes</strong> to stop EC2 compute charges completely. When starting, nodes are scaled back up to your target restore size.
                </p>

                <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border-2)', borderRadius: 'var(--radius)', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div>
                      <strong style={{ fontSize: '14px' }}>dev-cluster-us-east-1</strong>
                      <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>NodeGroup: <code>ng-workloads</code></div>
                    </div>
                    <span className={`badge ${eksState === 'Stopped' ? 'badge-red' : 'badge-green'}`}>
                      {eksState === 'Stopped' ? 'Scaled to 0 nodes ($0/mo)' : `Active (${ngSize} nodes)`}
                    </span>
                  </div>

                  <div className="control-label" style={{ marginBottom: 6 }}>Set Target Restore Size on Start:</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={ngSize}
                      onChange={(e) => setNgSize(Number(e.target.value))}
                      className="slider-range"
                      style={{ flex: 1 }}
                    />
                    <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--accent)', width: '60px', fontFamily: 'var(--font-mono)' }}>
                      {ngSize} nodes
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      className="btn-primary"
                      style={{ flex: 1, background: 'var(--red)', color: '#fff' }}
                      onClick={() => toggleStopResource('eks-1')}
                    >
                      Scale NodeGroup to 0 (Stop)
                    </button>
                    <button
                      className="btn-secondary"
                      style={{ flex: 1 }}
                      onClick={() => toggleStopResource('eks-1')}
                    >
                      Restore to {ngSize} Nodes (Start)
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px' }}>
                <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '8px' }}>EKS Lifecycle Logic</div>
                <ul style={{ fontSize: '13px', color: 'var(--text-2)', paddingLeft: '18px', lineHeight: '1.7' }}>
                  <li><strong>Stop:</strong> Pods receive termination signals; Auto Scaling Group sizes set to 0.</li>
                  <li><strong>Zero Compute Cost:</strong> AWS charges $0 for EC2 instances while NodeGroup count is 0.</li>
                  <li><strong>Start:</strong> ASG scaled back up to target restore size ({ngSize} nodes). Kubernetes re-attaches PVCs and starts pods automatically.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB C: Optimization Strategies */}
          {panelTab === 'strategies' && (
            <div className="panel-side" style={{ padding: '24px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-2)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Supported Downtime Strategies &amp; Cost Calculation
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {strategies.map(s => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedStrategy(s.id)}
                    style={{
                      background: selectedStrategy === s.id ? s.bg : 'var(--surface-2)',
                      border: selectedStrategy === s.id ? `1.5px solid ${s.color}` : '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      padding: '16px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '24px' }}>{s.icon}</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '14.5px', color: 'var(--text)' }}>{s.label}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-2)' }}>{s.desc}</div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, fontSize: '16px', color: s.color, fontFamily: 'var(--font-mono)' }}>
                        {s.savingAmt}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>{s.savingPct} saved</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB D: Cron & Schedule Engine */}
          {panelTab === 'cron' && (
            <div className="panel-side" style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <div className="control-label" style={{ marginBottom: 8 }}>Schedule Presets:</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {templates.map(t => (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTemplate(t.id)}
                      style={{
                        background: selectedTemplate === t.id ? 'var(--surface-3)' : 'var(--surface-2)',
                        border: selectedTemplate === t.id ? '1px solid var(--accent)' : '1px solid var(--border)',
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
                        <span style={{ fontWeight: 600, color: selectedTemplate === t.id ? 'var(--accent)' : 'var(--text)' }}>
                          {t.label}
                        </span>
                        <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>{t.cron}</div>
                      </div>
                      {selectedTemplate === t.id && <Check size={14} style={{ color: 'var(--accent)' }} />}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="control-label" style={{ marginBottom: 8 }}>Recurring Cron Action Mode:</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                  <button
                    className={`btn-secondary ${selectedAction === 'stop-recurring' ? 'btn-primary' : ''}`}
                    onClick={() => setSelectedAction('stop-recurring')}
                    style={{ fontSize: '12px', padding: '8px' }}
                  >
                    <Square size={12} fill="currentColor" /> Stop (Cron)
                  </button>
                  <button
                    className={`btn-secondary ${selectedAction === 'start-recurring' ? 'btn-primary' : ''}`}
                    onClick={() => setSelectedAction('start-recurring')}
                    style={{ fontSize: '12px', padding: '8px' }}
                  >
                    <Play size={12} fill="currentColor" /> Start (Cron)
                  </button>
                </div>

                <div style={{
                  background: 'rgba(0, 184, 122, 0.08)',
                  border: '1px solid rgba(0, 184, 122, 0.2)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px',
                  marginBottom: '12px'
                }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-2)', textTransform: 'uppercase' }}>Configured Cron Expression</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600, color: 'var(--accent)' }}>
                    0 22 * * 1-5 (Stop EC2/EKS at 22:00 Mon-Fri)
                  </div>
                </div>

                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  <Clock size={15} /> Apply Schedule to Selected Resources
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
