import React, { useState } from 'react';
import { Zap, DollarSign, ShieldAlert, Layers, CheckCircle2, Play, RefreshCw, AlertTriangle, ArrowRight, Rocket, Cpu } from 'lucide-react';

export default function CapabilitiesExplorer() {
  const [activeTab, setActiveTab] = useState('lifecycle');

  // Tab 1: Lifecycle state
  const [selectedResource, setSelectedResource] = useState('eks');
  const [lifecycleStatus, setLifecycleStatus] = useState('ready');

  // Tab 2: Schedule & FinOps state
  const [scheduleMode, setScheduleMode] = useState('nightly');
  const [riScale, setRiScale] = useState(12);
  const [riTerm, setRiTerm] = useState(1);

  // Tab 3: Drift state
  const [driftItems, setDriftItems] = useState([
    { id: 1, type: 'High Risk', title: 'Security Group Port 5432 Opened to 0.0.0.0/0', resolved: false },
    { id: 2, type: 'Medium Risk', title: 'Instance bumped from t3.large ($47/mo) to c5.4xlarge ($490/mo)', resolved: false }
  ]);

  // Tab 4: Smart Deployment state
  const [cloudProvider, setCloudProvider] = useState('AWS');
  const [selectedRepo, setSelectedRepo] = useState('auth-api');

  // Calculations for Tab 2
  const savingsByMode = {
    nightly: { pct: '65%', amount: '$332/mo', annual: '$3,984/yr' },
    weekend: { pct: '29%', amount: '$148/mo', annual: '$1,776/yr' },
    both: { pct: '76%', amount: '$388/mo', annual: '$4,656/yr' },
    permanent: { pct: '100%', amount: '$510/mo', annual: '$6,120/yr' },
  };

  const currentSavings = savingsByMode[scheduleMode];
  const riDiscount = riTerm === 1 ? 0.38 : 0.62;
  const riBaseYr = riScale * 720;
  const riAnnualSavings = Math.round(riBaseYr * riDiscount);

  const resolveDrift = (id) => {
    setDriftItems(prev => prev.map(item => item.id === id ? { ...item, resolved: true } : item));
  };

  const getSmartRecommendation = () => {
    if (selectedRepo === 'auth-api') {
      return `💡 Smart Recommendation (${cloudProvider}): Deploy to ${cloudProvider === 'AWS' ? 'ECS Fargate' : cloudProvider === 'Azure' ? 'Azure Container Apps' : 'Cloud Run'} for optimal low-idle overhead ($18–35/mo).`;
    } else if (selectedRepo === 'frontend-app') {
      return `💡 Smart Recommendation (${cloudProvider}): Deploy to Serverless SSR Container for automatic scale-to-zero ($12–25/mo).`;
    } else {
      return `💡 Smart Recommendation (${cloudProvider}): Deploy to Scheduled Worker / Batch Job to minimize runtime idle ($8–20/mo).`;
    }
  };

  return (
    <section className="section" id="capabilities">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span className="section-label">Platform Capabilities</span>
          <h2 className="section-title">Everything you need.<br /><span className="gradient-text">Zero unnecessary complexity.</span></h2>
          <p className="section-sub" style={{ margin: '0 auto' }}>
            Click through the interactive modules below to test live previews of Stratus capabilities.
          </p>
        </div>

        {/* 4 Core Tabs */}
        <div className="capabilities-tabs">
          <button
            className={`cap-tab-btn ${activeTab === 'lifecycle' ? 'active' : ''}`}
            onClick={() => setActiveTab('lifecycle')}
          >
            <Zap size={18} /> EC2/EKS Lifecycle Agent
          </button>
          <button
            className={`cap-tab-btn ${activeTab === 'finops' ? 'active' : ''}`}
            onClick={() => setActiveTab('finops')}
          >
            <DollarSign size={18} /> FinOps &amp; Schedules
          </button>
          <button
            className={`cap-tab-btn ${activeTab === 'drift' ? 'active' : ''}`}
            onClick={() => setActiveTab('drift')}
          >
            <ShieldAlert size={18} /> Drift &amp; Security Guard
          </button>
          <button
            className={`cap-tab-btn ${activeTab === 'smart-deploy' ? 'active' : ''}`}
            onClick={() => setActiveTab('smart-deploy')}
          >
            <Rocket size={18} /> Smart Deployment
          </button>
        </div>

        {/* TAB 1: LIFECYCLE AGENT */}
        {activeTab === 'lifecycle' && (
          <div className="cap-card">
            <div className="cap-details">
              <h3>⚡ EC2 &amp; EKS Infrastructure Lifecycle Agent</h3>
              <p>
                Stopping EKS clusters scales all NodeGroups (desired/min/max) down to <strong>0 nodes</strong> (evicting pods safely and eliminating EC2 compute charges). On start, NodeGroups are scaled back up to your pre-configured restore size.
              </p>
              <div className="cap-features-list">
                <div className="cap-feature-item">
                  <CheckCircle2 size={16} className="cap-check-icon" />
                  <span>NodeGroup scaling to 0 on stop &amp; customizable node restore sizing on start</span>
                </div>
                <div className="cap-feature-item">
                  <CheckCircle2 size={16} className="cap-check-icon" />
                  <span>State serialization for Kubernetes CRDs, NodeGroups &amp; VPC references</span>
                </div>
                <div className="cap-feature-item">
                  <CheckCircle2 size={16} className="cap-check-icon" />
                  <span>1-Click EC2/EKS graceful stop and automated state restore</span>
                </div>
              </div>
            </div>

            <div className="interactive-box">
              <div className="control-label" style={{ marginBottom: 6 }}>Select Target Workload:</div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: 16 }}>
                <button
                  className={`btn-secondary ${selectedResource === 'eks' ? 'btn-primary' : ''}`}
                  onClick={() => { setSelectedResource('eks'); setLifecycleStatus('ready'); }}
                >
                  EKS Cluster (dev-cluster)
                </button>
                <button
                  className={`btn-secondary ${selectedResource === 'ec2' ? 'btn-primary' : ''}`}
                  onClick={() => { setSelectedResource('ec2'); setLifecycleStatus('ready'); }}
                >
                  EC2 Instance (worker-node)
                </button>
              </div>

              <div style={{ background: 'var(--surface-2)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>State Status:</span>
                  <span className={`badge ${lifecycleStatus === 'stopped' ? 'badge-red' : 'badge-green'}`}>
                    {lifecycleStatus === 'stopped' ? 'NodeGroup Scaled to 0 ($0/mo)' : 'Active (3 Nodes Running)'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                  {lifecycleStatus === 'ready' ? (
                    <button
                      className="btn-primary"
                      style={{ background: 'var(--red)', color: '#fff', flex: 1, padding: '8px' }}
                      onClick={() => setLifecycleStatus('stopped')}
                    >
                      Scale NodeGroup to 0 (Stop)
                    </button>
                  ) : (
                    <button
                      className="btn-primary"
                      style={{ flex: 1, padding: '8px' }}
                      onClick={() => setLifecycleStatus('ready')}
                    >
                      Restore to 3 Nodes (Start)
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FINOPS & SCHEDULES */}
        {activeTab === 'finops' && (
          <div className="cap-card">
            <div className="cap-details">
              <h3>💰 FinOps &amp; Scheduled Downtime Engine</h3>
              <p>
                Configure paired stop+start cron schedules with quick presets. Save up to 76% on non-production environment costs automatically.
              </p>

              <div className="control-label" style={{ marginBottom: 8 }}>Test Schedule Presets:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: 16 }}>
                <button
                  className={`btn-secondary ${scheduleMode === 'nightly' ? 'btn-primary' : ''}`}
                  onClick={() => setScheduleMode('nightly')}
                  style={{ justifyContent: 'space-between' }}
                >
                  <span>🌙 Nightly Shutdown (8 PM – 8 AM)</span>
                  <span className="badge badge-green">−49% Saved</span>
                </button>
                <button
                  className={`btn-secondary ${scheduleMode === 'weekend' ? 'btn-primary' : ''}`}
                  onClick={() => setScheduleMode('weekend')}
                  style={{ justifyContent: 'space-between' }}
                >
                  <span>⏸ Weekend Shutdown (Sat – Sun)</span>
                  <span className="badge badge-green">−28% Saved</span>
                </button>
                <button
                  className={`btn-secondary ${scheduleMode === 'both' ? 'btn-primary' : ''}`}
                  onClick={() => setScheduleMode('both')}
                  style={{ justifyContent: 'space-between' }}
                >
                  <span>🌙⏸ Nights + Weekends (Business Hours Only)</span>
                  <span className="badge badge-green">−64% Saved</span>
                </button>
                <button
                  className={`btn-secondary ${scheduleMode === 'permanent' ? 'btn-primary' : ''}`}
                  onClick={() => setScheduleMode('permanent')}
                  style={{ justifyContent: 'space-between' }}
                >
                  <span>⏹ Permanently Stop (Complete Decommission)</span>
                  <span className="badge badge-red">−100% Saved</span>
                </button>
              </div>
            </div>

            <div className="interactive-box">
              <div style={{ textAlign: 'center', padding: '12px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-3)', textTransform: 'uppercase' }}>Projected Monthly Savings</div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--accent)', margin: '4px 0' }}>{currentSavings.amount}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-2)' }}>{currentSavings.pct} total idle spend reduction ({currentSavings.annual})</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DRIFT & SECURITY */}
        {activeTab === 'drift' && (
          <div className="cap-card">
            <div className="cap-details">
              <h3>🛡️ Infrastructure Drift &amp; Security Guard</h3>
              <p>
                Continuous scanning detects manual security group changes or unauthorized instance type upgrades across all your AWS organization accounts.
              </p>
              <div className="cap-features-list">
                <div className="cap-feature-item">
                  <CheckCircle2 size={16} className="cap-check-icon" />
                  <span>Automated baseline state drift detection</span>
                </div>
                <div className="cap-feature-item">
                  <CheckCircle2 size={16} className="cap-check-icon" />
                  <span>1-Click instant rollback to secure Terraform/IaC baseline</span>
                </div>
              </div>
            </div>

            <div className="interactive-box">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontWeight: 700, fontSize: '14px' }}>Active Security Alerts</span>
                <span className="badge badge-red">{driftItems.filter(i => !i.resolved).length} Violations</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {driftItems.map(item => (
                  <div key={item.id} style={{
                    background: item.resolved ? 'rgba(0, 184, 122, 0.05)' : 'rgba(240, 85, 85, 0.08)',
                    border: item.resolved ? '1px solid rgba(0, 184, 122, 0.3)' : '1px solid rgba(240, 85, 85, 0.3)',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span className={`badge ${item.resolved ? 'badge-green' : 'badge-red'}`}>{item.type}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>{item.resolved ? 'Resolved' : 'Unresolved'}</span>
                    </div>
                    <div style={{ fontSize: '13px', marginBottom: 8, fontWeight: 500 }}>{item.title}</div>
                    {!item.resolved ? (
                      <button className="btn-outline" style={{ fontSize: '12px', padding: '4px 10px' }} onClick={() => resolveDrift(item.id)}>
                        1-Click Revert Baseline State
                      </button>
                    ) : (
                      <span style={{ fontSize: '12px', color: 'var(--accent)' }}>✓ Reverted back to IaC security baseline</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SMART DEPLOYMENT ENGINE */}
        {activeTab === 'smart-deploy' && (
          <div className="cap-card">
            <div className="cap-details">
              <h3>🚀 Smart Deployment Engine &amp; Multi-Cloud Matrix</h3>
              <p>
                Repo URL stack detection and pre-deployment cost matrix comparison across AWS, Azure, and GCP. Receive instant architecture recommendations before provisioning.
              </p>

              <div className="control-label" style={{ marginBottom: 6 }}>Detect Repository Stack:</div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: 14 }}>
                <button
                  className={`btn-secondary ${selectedRepo === 'auth-api' ? 'btn-primary' : ''}`}
                  onClick={() => setSelectedRepo('auth-api')}
                  style={{ fontSize: '12.5px', padding: '6px 12px' }}
                >
                  auth-api (Node.js API)
                </button>
                <button
                  className={`btn-secondary ${selectedRepo === 'frontend-app' ? 'btn-primary' : ''}`}
                  onClick={() => setSelectedRepo('frontend-app')}
                  style={{ fontSize: '12.5px', padding: '6px 12px' }}
                >
                  frontend-app (Next.js)
                </button>
                <button
                  className={`btn-secondary ${selectedRepo === 'data-pipeline' ? 'btn-primary' : ''}`}
                  onClick={() => setSelectedRepo('data-pipeline')}
                  style={{ fontSize: '12.5px', padding: '6px 12px' }}
                >
                  data-pipeline (Python Batch)
                </button>
              </div>

              <div className="control-label" style={{ marginBottom: 6 }}>Filter Target Cloud Provider:</div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: 16 }}>
                {['AWS', 'Azure', 'GCP'].map(cloud => (
                  <button
                    key={cloud}
                    className={`btn-secondary ${cloudProvider === cloud ? 'btn-primary' : ''}`}
                    onClick={() => setCloudProvider(cloud)}
                    style={{ fontSize: '12.5px', padding: '6px 12px' }}
                  >
                    {cloud}
                  </button>
                ))}
              </div>
            </div>

            <div className="interactive-box">
              <div style={{ background: 'rgba(0, 184, 122, 0.08)', border: '1px solid rgba(0, 184, 122, 0.3)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: '14px', fontSize: '13px', lineHeight: '1.5' }}>
                {getSmartRecommendation()}
              </div>

              <div style={{ fontWeight: 700, fontSize: '13.5px', marginBottom: '8px' }}>Pre-Deployment Cost Comparison ({cloudProvider})</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--surface-2)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <div>
                    <strong style={{ fontSize: '13px' }}>Serverless / Container Task</strong>
                    <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>Auto-scaling serverless container (Zero idle cost)</div>
                  </div>
                  <span style={{ color: 'var(--accent)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>$18–35/mo</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--surface-2)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <div>
                    <strong style={{ fontSize: '13px' }}>Standard Compute VM</strong>
                    <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>Dedicated 2 vCPU / 4GB RAM node</div>
                  </div>
                  <span style={{ color: 'var(--text)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>$30–45/mo</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--surface-2)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <div>
                    <strong style={{ fontSize: '13px' }}>Managed Kubernetes Cluster</strong>
                    <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>High availability control plane</div>
                  </div>
                  <span style={{ color: 'var(--text-2)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>$140–180/mo</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
