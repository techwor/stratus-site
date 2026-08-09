import React, { useState } from 'react';
import { Github, ArrowRight, LayoutDashboard, Server, Layers, Database, Clock, FileText, DollarSign, Check, Square, Play, TrendingDown, AlertTriangle, Shield } from 'lucide-react';

export default function Hero() {
  const [activeAppTab, setActiveAppTab] = useState('ec2'); // 'dashboard' | 'ec2' | 'eks' | 'rds' | 'schedules' | 'cost' | 'audit'
  const [ec2SubTab, setEc2SubTab] = useState('cost'); // 'instances' | 'cost'
  const [eksSubTab, setEksSubTab] = useState('clusters'); // 'clusters' | 'cost'

  // Mock state reflecting real app dataset
  const [ec2Instances, setEc2Instances] = useState([
    { id: 'i-019d82e', name: 'worker-ec2-dev', type: 't3.large', state: 'running', account: 'Engineering-Dev', region: 'us-east-1', cost: 47, dailyCost: 1.56 },
    { id: 'i-091a82f', name: 'api-prod-1', type: 't3.medium', state: 'running', account: 'Production', region: 'us-east-1', cost: 24, dailyCost: 0.80 },
    { id: 'i-058b12c', name: 'stage-worker-1', type: 't3.xlarge', state: 'stopped', account: 'Staging', region: 'us-east-1', cost: 0, dailyCost: 0.00 },
  ]);

  const [eksClusters, setEksClusters] = useState([
    { id: 'eks-dev-1', name: 'dev-cluster-us-east-1', state: 'active', nodeCount: 3, cost: 183, dailyCost: 6.10, ngName: 'ng-workloads' },
  ]);

  const [rdsInstances, setRdsInstances] = useState([
    { id: 'rds-stage-1', name: 'db-staging-r5', type: 'r5.large', state: 'available', cost: 280, dailyCost: 9.33 },
  ]);

  const [ngRestoreSize, setNgRestoreSize] = useState(3);
  const [selectedPreset, setSelectedPreset] = useState('nightly');
  const [expandedStrategy, setExpandedStrategy] = useState('both');

  const [auditLogs, setAuditLogs] = useState([
    { id: 1, time: '12:02:10 PM', user: 'parithi (admin)', action: 'eks:stop-cluster', desc: 'Scaled dev-cluster-us-east-1 NodeGroup to 0 nodes', status: 'SUCCESS' },
    { id: 2, time: '11:45:00 AM', user: 'parithi (admin)', action: 'ec2:stop', desc: 'Stopped worker-ec2-dev (t3.large)', status: 'SUCCESS' },
    { id: 3, time: '09:00:00 AM', user: 'system.cron', action: 'schedule:create', desc: 'Created Nightly shutdown schedule for dev accounts', status: 'SUCCESS' },
  ]);

  // Real app cost savings strategy definitions from stratus-cloud-management
  const savingsStrategies = [
    {
      key: 'weekend',
      label: 'Weekend Shutdown',
      icon: '⏸',
      desc: 'Stop Sat & Sun (48 hrs/wk). Ideal for dev/test workloads not needed on weekends.',
      badge: '−28%',
      savedHours: 208,
      color: '#00a0c8',
      bg: 'rgba(0, 160, 200, 0.08)',
      border: 'rgba(0, 160, 200, 0.3)'
    },
    {
      key: 'nightly',
      label: 'Nightly Shutdown',
      icon: '🌙',
      desc: 'Stop 8 PM to 8 AM (12 hrs/day). Great for workloads needed only in business hours.',
      badge: '−49%',
      savedHours: 360,
      color: '#00b87a',
      bg: 'rgba(0, 184, 122, 0.08)',
      border: 'rgba(0, 184, 122, 0.3)'
    },
    {
      key: 'both',
      label: 'Nights + Weekends',
      icon: '🌙⏸',
      desc: 'Stop nightly AND weekends — business hours only (Mon–Fri, 8 AM–8 PM).',
      badge: '−64%',
      savedHours: 468,
      color: '#f5c842',
      bg: 'rgba(245, 200, 66, 0.08)',
      border: 'rgba(245, 200, 66, 0.3)'
    },
    {
      key: 'permanent',
      label: 'Permanently Stop',
      icon: '⏹',
      desc: 'Decommission idle instances completely. 100% saved with state capture.',
      badge: '−100%',
      savedHours: 730,
      color: '#f05555',
      bg: 'rgba(240, 85, 85, 0.08)',
      border: 'rgba(240, 85, 85, 0.3)'
    }
  ];

  const toggleEc2 = (id) => {
    setEc2Instances(prev => prev.map(inst => {
      if (inst.id === id) {
        const nextState = inst.state === 'running' ? 'stopped' : 'running';
        const costVal = nextState === 'stopped' ? 0 : 47;
        
        setAuditLogs(logs => [
          {
            id: Date.now(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            user: 'parithi (admin)',
            action: `ec2:${nextState}`,
            desc: `${nextState === 'stopped' ? 'Stopped' : 'Started'} ${inst.name}`,
            status: 'SUCCESS'
          },
          ...logs
        ]);

        return { ...inst, state: nextState, cost: costVal };
      }
      return inst;
    }));
  };

  const toggleEks = (id) => {
    setEksClusters(prev => prev.map(c => {
      if (c.id === id) {
        const nextState = c.state === 'active' ? 'scaled_zero' : 'active';
        const nextNodes = nextState === 'scaled_zero' ? 0 : ngRestoreSize;
        const nextCost = nextState === 'scaled_zero' ? 0 : 183;

        setAuditLogs(logs => [
          {
            id: Date.now(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            user: 'parithi (admin)',
            action: nextState === 'scaled_zero' ? 'eks:stop-cluster' : 'eks:start-cluster',
            desc: nextState === 'scaled_zero' ? `Scaled ${c.name} NodeGroup to 0 nodes` : `Restored ${c.name} NodeGroup to ${ngRestoreSize} nodes`,
            status: 'SUCCESS'
          },
          ...logs
        ]);

        return { ...c, state: nextState, nodeCount: nextNodes, cost: nextCost };
      }
      return c;
    }));
  };

  const totalMonthlySpend = ec2Instances.reduce((a, b) => a + b.cost, 0) + eksClusters.reduce((a, b) => a + b.cost, 0) + rdsInstances.reduce((a, b) => a + b.cost, 0);

  return (
    <section className="hero" id="overview">
      <div className="hero-glow-1"></div>
      <div className="hero-glow-2"></div>

      <div className="container">
        {/* Hero Header */}
        <div className="hero-header">
          <h1 className="hero-title">
            Automated Cloud Cost Optimization.<br />
            <span className="gradient-text">Cut idle AWS compute spend automatically.</span>
          </h1>

          <p className="hero-sub">
            Stratus gives you instant cost visibility and automated start/stop schedules across EC2, EKS, RDS, and ECS — turning off non-production resources when not in use.
          </p>

          <div className="hero-ctas">
            <a href="#contact" className="btn-primary">
              Contact Us <ArrowRight size={18} />
            </a>
            <a href="#capabilities" className="btn-secondary">
              Platform Capabilities
            </a>
          </div>

          <div className="hero-stats-row">
            <div className="hero-stat-item">
              <strong>Weekend</strong> (−28% Saved)
            </div>
            <div style={{ width: 1, height: 14, background: 'var(--border-2)' }}></div>
            <div className="hero-stat-item">
              <strong>Nightly</strong> (−49% Saved)
            </div>
            <div style={{ width: 1, height: 14, background: 'var(--border-2)' }}></div>
            <div className="hero-stat-item">
              <strong>Nights + Weekends</strong> (−64% Saved)
            </div>
            <div style={{ width: 1, height: 14, background: 'var(--border-2)' }}></div>
            <div className="hero-stat-item">
              <strong>Permanent</strong> (−100% Saved)
            </div>
          </div>
        </div>

        {/* Master Control Panel Showcase (Matching Real App Codebase Navigation & Sub-Tabs) */}
        <div className="control-panel">
          {/* Main Navigation Bar */}
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
                <Server size={13} /> EC2
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
                <Layers size={13} /> EKS
              </button>

              <button
                onClick={() => setActiveAppTab('rds')}
                style={{
                  background: activeAppTab === 'rds' ? 'var(--accent)' : 'transparent',
                  color: activeAppTab === 'rds' ? '#000' : 'var(--text-2)',
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
                <Database size={13} /> RDS
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

            <span className="badge badge-aws" style={{ fontSize: '11px' }}>
              AWS Organization
            </span>
          </div>

          {/* TAB 1: DASHBOARD TAB */}
          {activeAppTab === 'dashboard' && (
            <div className="panel-side" style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
                <div style={{ background: 'var(--surface-2)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase' }}>Current Monthly Spend</div>
                  <div style={{ fontSize: '22px', fontWeight: 800 }}>${totalMonthlySpend}/mo</div>
                </div>
                <div style={{ background: 'var(--surface-2)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase' }}>Active Compute</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--accent)' }}>
                    {ec2Instances.filter(i => i.state === 'running').length + eksClusters.filter(c => c.state === 'active').length} Running
                  </div>
                </div>
                <div style={{ background: 'var(--surface-2)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase' }}>Nightly Savings Impact</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--accent)' }}>
                    −${Math.round(totalMonthlySpend * 0.49)}/mo (−49%)
                  </div>
                </div>
                <div style={{ background: 'var(--surface-2)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase' }}>Nights + Weekends Impact</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--accent)' }}>
                    −${Math.round(totalMonthlySpend * 0.64)}/mo (−64%)
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(240, 85, 85, 0.08)', border: '1px solid rgba(240,85,85,0.25)', padding: '14px 18px', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <strong style={{ fontSize: '14px', color: 'var(--red)' }}>⚠ Cost Optimization Suggestions Active</strong>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-2)' }}>
                    4 downtime strategies available: Weekend (−28%), Nightly (−49%), Nights + Weekends (−64%), Permanent (−100%).
                  </div>
                </div>
                <button className="btn-primary" style={{ padding: '6px 14px', fontSize: '12px' }} onClick={() => setActiveAppTab('ec2')}>
                  View Cost Sub-Tab →
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: EC2 TAB (Separated Instances vs Cost Sub-Tabs) */}
          {activeAppTab === 'ec2' && (
            <div className="panel-side" style={{ padding: '24px' }}>
              {/* Sub-Tab Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className={`btn-secondary ${ec2SubTab === 'instances' ? 'btn-primary' : ''}`}
                    onClick={() => setEc2SubTab('instances')}
                    style={{ fontSize: '12.5px', padding: '6px 14px' }}
                  >
                    Instances &amp; Start/Stop
                  </button>
                  <button
                    className={`btn-secondary ${ec2SubTab === 'cost' ? 'btn-primary' : ''}`}
                    onClick={() => setEc2SubTab('cost')}
                    style={{ fontSize: '12.5px', padding: '6px 14px' }}
                  >
                    <DollarSign size={13} /> Cost &amp; 4 Savings Strategies
                  </button>
                </div>
                <span className="badge badge-aws">EC2 Service</span>
              </div>

              {/* Sub-Tab 1: Instances Start/Stop */}
              {ec2SubTab === 'instances' && (
                <div className="resource-list">
                  {ec2Instances.map(inst => (
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
                          onClick={() => toggleEc2(inst.id)}
                        >
                          {inst.state === 'running' ? 'Stop' : 'Start'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Sub-Tab 2: 4 Savings Strategies Cards matching CostTab.jsx in stratus-cloud-management */}
              {ec2SubTab === 'cost' && (
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-2)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    4 Supported Cost Savings Strategies (from stratus-cloud-management)
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {savingsStrategies.map(strat => (
                      <div
                        key={strat.key}
                        onClick={() => setExpandedStrategy(strat.key)}
                        style={{
                          background: expandedStrategy === strat.key ? strat.bg : 'var(--surface-2)',
                          border: expandedStrategy === strat.key ? `1.5px solid ${strat.color}` : '1px solid var(--border)',
                          borderRadius: 'var(--radius)',
                          padding: '14px 16px',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '18px' }}>{strat.icon}</span>
                            <strong style={{ fontSize: '14px', color: 'var(--text)' }}>{strat.label}</strong>
                          </div>
                          <span style={{
                            background: strat.bg,
                            border: `1px solid ${strat.border}`,
                            color: strat.color,
                            fontWeight: 800,
                            fontSize: '12px',
                            padding: '2px 8px',
                            borderRadius: '12px'
                          }}>
                            {strat.badge}
                          </span>
                        </div>

                        <div style={{ fontSize: '12px', color: 'var(--text-2)', lineHeight: '1.4', marginBottom: '8px' }}>
                          {strat.desc}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', paddingTop: '6px', borderTop: '1px solid var(--border)' }}>
                          <span style={{ color: 'var(--text-3)' }}>Hours saved: {strat.savedHours} hrs/mo</span>
                          <span style={{ color: strat.color, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                            −${Math.round(71 * (strat.savedHours / 730))}/mo per t3.large
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: EKS TAB (Separated NodeGroup Start/Stop vs Node Cost Sub-Tabs) */}
          {activeAppTab === 'eks' && (
            <div className="panel-side" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className={`btn-secondary ${eksSubTab === 'clusters' ? 'btn-primary' : ''}`}
                    onClick={() => setEksSubTab('clusters')}
                    style={{ fontSize: '12.5px', padding: '6px 14px' }}
                  >
                    Clusters &amp; NodeGroup Scale-to-0
                  </button>
                  <button
                    className={`btn-secondary ${eksSubTab === 'cost' ? 'btn-primary' : ''}`}
                    onClick={() => setEksSubTab('cost')}
                    style={{ fontSize: '12.5px', padding: '6px 14px' }}
                  >
                    <DollarSign size={13} /> Node Cost Savings Strategies
                  </button>
                </div>
                <span className="badge badge-aws">EKS Kubernetes</span>
              </div>

              {eksSubTab === 'clusters' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
                  <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border-2)', borderRadius: 'var(--radius)', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div>
                        <strong style={{ fontSize: '14px' }}>dev-cluster-us-east-1</strong>
                        <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>NodeGroup: <code>ng-workloads</code></div>
                      </div>
                      <span className={`badge ${eksClusters[0].state === 'scaled_zero' ? 'badge-red' : 'badge-green'}`}>
                        {eksClusters[0].state === 'scaled_zero' ? 'Scaled to 0 nodes ($0/mo)' : `Active (${eksClusters[0].nodeCount} nodes)`}
                      </span>
                    </div>

                    <div className="control-label" style={{ marginBottom: 6 }}>Set Target Restore Size on Start:</div>
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
                        onClick={() => toggleEks('eks-dev-1')}
                      >
                        Scale NodeGroup to 0 (Stop)
                      </button>
                      <button
                        className="btn-secondary"
                        style={{ flex: 1 }}
                        onClick={() => toggleEks('eks-dev-1')}
                      >
                        Restore to {ngRestoreSize} Nodes (Start)
                      </button>
                    </div>
                  </div>

                  <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px' }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '8px' }}>EKS Scale-to-0 Mechanism</div>
                    <ul style={{ fontSize: '12.5px', color: 'var(--text-2)', paddingLeft: '18px', lineHeight: '1.7' }}>
                      <li><strong>Stop:</strong> ASG desired/min/max set to 0. Pods receive termination signals.</li>
                      <li><strong>Zero Compute Cost:</strong> AWS charges $0 while NodeGroup node count is 0.</li>
                      <li><strong>Start:</strong> ASG restored back to target size ({ngRestoreSize} nodes).</li>
                    </ul>
                  </div>
                </div>
              )}

              {eksSubTab === 'cost' && (
                <div style={{ background: 'var(--surface-2)', padding: '16px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                  <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '12px', color: 'var(--accent)' }}>
                    💰 EKS Node Group Cost Reduction Strategies
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ background: 'var(--surface)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <strong>Weekend Shutdown</strong>
                        <span style={{ color: '#00a0c8', fontWeight: 800 }}>−28%</span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-2)' }}>Saves −$51/mo per node group (208 hrs/mo)</div>
                    </div>
                    <div style={{ background: 'var(--surface)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <strong>Nightly Shutdown</strong>
                        <span style={{ color: '#00b87a', fontWeight: 800 }}>−49%</span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-2)' }}>Saves −$90/mo per node group (360 hrs/mo)</div>
                    </div>
                    <div style={{ background: 'var(--surface)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <strong>Nights + Weekends</strong>
                        <span style={{ color: '#f5c842', fontWeight: 800 }}>−64%</span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-2)' }}>Saves −$117/mo per node group (468 hrs/mo)</div>
                    </div>
                    <div style={{ background: 'var(--surface)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <strong>Permanently Scale 0</strong>
                        <span style={{ color: '#f05555', fontWeight: 800 }}>−100%</span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-2)' }}>Saves −$183/mo total node cost (730 hrs/mo)</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: RDS TAB */}
          {activeAppTab === 'rds' && (
            <div className="panel-side" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-2)' }}>
                  RDS Instance &amp; Aurora Cluster Inventory
                </div>
                <span className="badge badge-aws">RDS Database</span>
              </div>

              {rdsInstances.map(rds => (
                <div key={rds.id} className="resource-row" style={{ marginBottom: '12px' }}>
                  <div className="resource-info">
                    <span className="badge badge-aws">RDS</span>
                    <div>
                      <div className="resource-name">{rds.name} ({rds.type})</div>
                      <div className="resource-sub">PostgreSQL · Multi-AZ: No · state: {rds.state}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="resource-cost cost-red">${rds.cost}/mo</span>
                    <button className="btn-outline" style={{ padding: '5px 12px', fontSize: '12px' }}>
                      Stop Database
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: DEDICATED SCHEDULES TAB */}
          {activeAppTab === 'schedules' && (
            <div className="panel-side" style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <div className="control-label" style={{ marginBottom: 8 }}>Schedule Quick Templates:</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div
                    style={{
                      background: 'var(--surface-3)',
                      border: '1px solid var(--accent)',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '13px'
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 600, color: 'var(--accent)' }}>Nightly Shutdown (8 PM – 8 AM)</span>
                      <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>Stop daily 20:00 · Start daily 08:00 (360 hrs/mo)</div>
                    </div>
                    <span className="badge badge-green">−49% Saved</span>
                  </div>

                  <div
                    style={{
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '13px'
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 600 }}>Weekend Shutdown (Sat – Sun)</span>
                      <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>Stop Fri 22:00 · Start Mon 08:00 (208 hrs/mo)</div>
                    </div>
                    <span className="badge badge-green">−28% Saved</span>
                  </div>

                  <div
                    style={{
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '13px'
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 600 }}>Nights + Weekends (Business Hours Only)</span>
                      <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>Stop Mon–Fri 19:00 · Start Mon–Fri 08:00 (468 hrs/mo)</div>
                    </div>
                    <span className="badge badge-green">−64% Saved</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="control-label" style={{ marginBottom: 8 }}>Active Paired Stop + Start Group:</div>
                <div style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border-2)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '16px',
                  marginBottom: '16px'
                }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-2)', marginBottom: '4px' }}>Paired Job Group</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13.5px', fontWeight: 700, color: 'var(--accent)' }}>
                    Stop: 0 20 * * * · Start: 0 8 * * *
                  </div>
                </div>

                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  <Clock size={15} /> Save Scheduled Job
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: AUDIT LOG TAB */}
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
