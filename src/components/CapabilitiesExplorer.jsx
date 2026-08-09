import React, { useState } from 'react';
import { Zap, DollarSign, ShieldAlert, Layers, CheckCircle2, Play, RefreshCw, AlertTriangle, ArrowRight } from 'lucide-react';

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

  // Tab 4: Multi-cloud deploy matrix state
  const [cloudProvider, setCloudProvider] = useState('AWS');

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
            className={`cap-tab-btn ${activeTab === 'multicloud' ? 'active' : ''}`}
            onClick={() => setActiveTab('multicloud')}
          >
            <Layers size={18} /> Multi-Cloud Inventory
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
              <div className="control-label">Target Infrastructure Resource:</div>
              <select
                className="form-select"
                value={selectedResource}
                onChange={(e) => { setSelectedResource(e.target.value); setLifecycleStatus('ready'); }}
              >
                <option value="eks">dev-cluster-us-east-1 (EKS) — $183/mo waste</option>
                <option value="rds">db-staging-r5 (RDS) — $280/mo waste</option>
                <option value="ec2">worker-ec2-dev (EC2) — $47/mo waste</option>
              </select>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className="btn-primary"
                  style={{ flex: 1, background: 'var(--red)', color: '#fff' }}
                  onClick={() => setLifecycleStatus('stopped')}
                >
                  ⚡ Scale NodeGroup to 0 &amp; Stop
                </button>
                <button
                  className="btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setLifecycleStatus('restored')}
                >
                  🚀 Restore NodeGroup Size &amp; Start
                </button>
              </div>

              <div className="terminal-body" style={{ minHeight: '140px' }}>
                {lifecycleStatus === 'ready' && (
                  <>
                    <div className="term-row"><span className="term-prompt">$</span><span className="term-cmd">stratus agent plan --resource {selectedResource}</span></div>
                    <div className="term-row"><span className="term-dim">[Lifecycle] NodeGroup scaling state ready. Click "Scale NodeGroup to 0 &amp; Stop" above.</span></div>
                  </>
                )}
                {lifecycleStatus === 'stopped' && (
                  <>
                    <div className="term-row"><span className="term-prompt">$</span><span className="term-cmd">stratus agent stop {selectedResource} --approve</span></div>
                    <div className="term-row"><span className="term-dim">[Lifecycle] Scaling NodeGroup ng-workloads desiredSize: 3 -&gt; 0...</span></div>
                    <div className="term-row"><span className="term-green">✓ {selectedResource} stopped! NodeGroup scaled to 0 nodes ($0/mo compute charge).</span></div>
                  </>
                )}
                {lifecycleStatus === 'restored' && (
                  <>
                    <div className="term-row"><span className="term-prompt">$</span><span className="term-cmd">stratus agent start {selectedResource}</span></div>
                    <div className="term-row"><span className="term-dim">[Lifecycle] Scaling NodeGroup ng-workloads desiredSize: 0 -&gt; 3...</span></div>
                    <div className="term-row"><span className="term-green">✓ {selectedResource} restored with 3 nodes! Endpoint &amp; pods online.</span></div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FINOPS & SCHEDULES */}
        {activeTab === 'finops' && (
          <div className="cap-card">
            <div className="cap-details">
              <h3>💰 FinOps &amp; Automated Schedules</h3>
              <p>
                Development and staging environments don't need to run 24/7. Turn resources off overnight or on weekends to save 65%–76% on cloud bill instantly.
              </p>

              <div className="control-label" style={{ marginBottom: 8 }}>Automated Schedule Policy:</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: 20 }}>
                <button
                  className={`btn-secondary ${scheduleMode === 'nightly' ? 'btn-primary' : ''}`}
                  onClick={() => setScheduleMode('nightly')}
                >
                  🌙 Nightly (8pm - 8am)
                </button>
                <button
                  className={`btn-secondary ${scheduleMode === 'weekend' ? 'btn-primary' : ''}`}
                  onClick={() => setScheduleMode('weekend')}
                >
                  📅 Weekend (Fri-Mon)
                </button>
                <button
                  className={`btn-secondary ${scheduleMode === 'both' ? 'btn-primary' : ''}`}
                  onClick={() => setScheduleMode('both')}
                >
                  💸 Nightly + Weekend
                </button>
                <button
                  className={`btn-secondary ${scheduleMode === 'permanent' ? 'btn-primary' : ''}`}
                  onClick={() => setScheduleMode('permanent')}
                >
                  🗑️ Delete Idle
                </button>
              </div>

              <div style={{ background: 'var(--surface-2)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '13px', color: 'var(--text-2)' }}>Estimated Savings Rate</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent)' }}>
                  {currentSavings.amount} <span style={{ fontSize: '14px', color: 'var(--text-2)' }}>({currentSavings.pct} reduction)</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>Annual projected impact: {currentSavings.annual}</div>
              </div>
            </div>

            <div className="interactive-box">
              <div style={{ fontWeight: 700, fontSize: '15px' }}>AWS Savings Plan Purchase Calculator</div>
              
              <div className="control-label">
                <span>Commitment Term:</span>
                <span style={{ color: 'var(--accent)' }}>{riTerm}-Year ({riTerm === 1 ? '38%' : '62%'} OFF)</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className={`btn-secondary ${riTerm === 1 ? 'btn-primary' : ''}`} onClick={() => setRiTerm(1)}>1-Year Term</button>
                <button className={`btn-secondary ${riTerm === 3 ? 'btn-primary' : ''}`} onClick={() => setRiTerm(3)}>3-Year Term</button>
              </div>

              <div className="control-label" style={{ marginTop: 12 }}>
                <span>Workload Scale:</span>
                <span><strong>{riScale} Instances</strong></span>
              </div>
              <input
                type="range"
                min="4"
                max="60"
                step="2"
                value={riScale}
                onChange={(e) => setRiScale(Number(e.target.value))}
                className="slider-range"
              />

              <div style={{ background: 'rgba(0, 184, 122, 0.08)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,184,122,0.2)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-2)' }}>Projected Savings Plan Net Discount</div>
                <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--accent)' }}>
                  ${riAnnualSavings.toLocaleString()} <span style={{ fontSize: '14px' }}>/ year</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DRIFT GUARD */}
        {activeTab === 'drift' && (
          <div className="cap-card">
            <div className="cap-details">
              <h3>🛡️ Automated Infrastructure Drift Guard</h3>
              <p>
                Developers manually tweaking security groups or bumping instance sizes creates security vulnerabilities and surprise billing spikes. Stratus runs background scans every 6 hours and alerts you instantly.
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, fontSize: '14px' }}>Active Security Alerts</span>
                <span className="badge badge-red">{driftItems.filter(i => !i.resolved).length} Violations</span>
              </div>

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
        )}

        {/* TAB 4: MULTI-CLOUD INVENTORY */}
        {activeTab === 'multicloud' && (
          <div className="cap-card">
            <div className="cap-details">
              <h3>🚀 Unified Multi-Cloud Inventory &amp; Cost Matrix</h3>
              <p>
                Manage AWS EC2, RDS, EKS alongside Azure VMs and GCP instances from a single unified control panel. Compare deployment costs before launching workloads.
              </p>

              <div className="control-label" style={{ marginBottom: 8 }}>Filter Cloud Provider:</div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: 20 }}>
                {['AWS', 'Azure', 'GCP'].map(cloud => (
                  <button
                    key={cloud}
                    className={`btn-secondary ${cloudProvider === cloud ? 'btn-primary' : ''}`}
                    onClick={() => setCloudProvider(cloud)}
                  >
                    {cloud}
                  </button>
                ))}
              </div>
            </div>

            <div className="interactive-box">
              <div style={{ fontWeight: 700, fontSize: '14px' }}>Pre-Deployment Cost Matrix ({cloudProvider})</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--surface-2)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <div>
                    <strong style={{ fontSize: '13.5px' }}>Container Task (Fargate / App)</strong>
                    <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>Auto-scaling serverless container</div>
                  </div>
                  <span style={{ color: 'var(--accent)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>$18–35/mo</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--surface-2)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <div>
                    <strong style={{ fontSize: '13.5px' }}>Standard VM Instance</strong>
                    <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>Dedicated 2 vCPU / 4GB RAM node</div>
                  </div>
                  <span style={{ color: 'var(--text)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>$30–45/mo</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--surface-2)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <div>
                    <strong style={{ fontSize: '13.5px' }}>Managed Kubernetes Cluster</strong>
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
