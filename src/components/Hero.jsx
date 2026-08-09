import React, { useState } from 'react';
import { Github, ArrowRight, Play, Server, ShieldCheck, DollarSign, Clock, CheckCircle, RefreshCw } from 'lucide-react';

export default function Hero() {
  const [resources, setResources] = useState([
    { id: 'eks-1', name: 'dev-cluster-us-east-1', type: 'EKS', cost: 183, state: 'Running', idle: true },
    { id: 'rds-1', name: 'db-staging-r5', type: 'RDS', cost: 280, state: 'Running', idle: true },
    { id: 'ec2-1', name: 'worker-ec2-dev', type: 'EC2', cost: 47, state: 'Running', idle: true },
    { id: 'ec2-2', name: 'api-prod-1', type: 'EC2', cost: 24, state: 'Running', idle: false },
  ]);

  const [terminalLog, setTerminalLog] = useState([
    { type: 'cmd', text: 'stratus scan --all-accounts' },
    { type: 'dim', text: '[Scanner] 4 active resources discovered across AWS us-east-1' },
    { type: 'red', text: '⚠ Idle alert: 3 resources detected running with 0 traffic -> $510/mo waste' }
  ]);

  const toggleStopResource = (id) => {
    setResources(prev => prev.map(r => {
      if (r.id === id) {
        const newState = r.state === 'Running' ? 'Stopped' : 'Running';
        const costStr = newState === 'Stopped' ? '$0' : `$${r.cost}`;
        
        setTerminalLog(logs => [
          ...logs,
          { type: 'cmd', text: `stratus lifecycle ${newState.toLowerCase()} ${r.name}` },
          { type: 'green', text: `✓ ${r.name} ${newState.toLowerCase()}! Net monthly cost: ${costStr}/mo` }
        ]);
        
        return { ...r, state: newState };
      }
      return r;
    }));
  };

  const totalWaste = resources.filter(r => r.idle && r.state === 'Running').reduce((acc, r) => acc + r.cost, 0);

  return (
    <section className="hero">
      <div className="hero-glow-1"></div>
      <div className="hero-glow-2"></div>

      <div className="container">
        <div className="hero-header">
          <div className="hero-badge-pill">
            <span className="hero-stat-dot"></span>
            Open Source · Self-Hosted · AWS / Azure / GCP
          </div>

          <h1 className="hero-title">
            Cost visibility &amp; automated control.<br />
            <span className="gradient-text">Built for DevOps engineers.</span>
          </h1>

          <p className="hero-sub">
            Stratus gives DevOps teams complete multi-cloud cost visibility and automated schedule policies over AWS, Azure, and GCP infrastructure — stopping idle waste automatically.
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
              Explore Capabilities <ArrowRight size={16} />
            </a>
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

        {/* Live Interactive Control Panel */}
        <div className="control-panel">
          <div className="panel-bar">
            <div className="panel-dots">
              <span className="dot dot-red"></span>
              <span className="dot dot-yellow"></span>
              <span className="dot dot-green"></span>
            </div>
            <div className="panel-title">
              <Server size={14} /> stratus — live-infrastructure-dashboard
            </div>
            <div style={{ width: 40 }}></div>
          </div>

          <div className="panel-grid">
            {/* Left: Resource Monitor */}
            <div className="panel-side">
              <div className="panel-head">
                <span className="panel-head-title">
                  <DollarSign size={15} style={{ color: 'var(--accent)' }} /> Active Infrastructure
                </span>
                <span className={`badge ${totalWaste > 0 ? 'badge-red' : 'badge-green'}`}>
                  {totalWaste > 0 ? `$${totalWaste}/mo waste detected` : 'Optimal State'}
                </span>
              </div>

              <div className="resource-list">
                {resources.map(r => (
                  <div key={r.id} className="resource-row">
                    <div className="resource-info">
                      <span className={`badge ${r.type === 'EKS' ? 'badge-aws' : r.type === 'RDS' ? 'badge-aws' : 'badge-aws'}`}>
                        {r.type}
                      </span>
                      <div>
                        <div className="resource-name">{r.name}</div>
                        <div className="resource-sub">us-east-1 · {r.state}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className={`resource-cost ${r.state === 'Stopped' ? 'term-dim' : r.idle ? 'cost-red' : ''}`}>
                        {r.state === 'Stopped' ? '$0/mo' : `$${r.cost}/mo`}
                      </span>
                      <button
                        className={`btn-outline`}
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

            {/* Right: Live Terminal Execution */}
            <div className="panel-side" style={{ background: '#090c0e' }}>
              <div className="panel-head">
                <span className="panel-head-title" style={{ color: 'var(--text-3)' }}>
                  <Clock size={14} /> Live Lifecycle Log
                </span>
                <span style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                  ● Interactive Console
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
        </div>

      </div>
    </section>
  );
}
