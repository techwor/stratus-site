import React, { useState } from 'react';
import { Play, Square, Calendar, Clock, DollarSign, Check, ChevronDown, CheckCircle, ShieldAlert, Layers } from 'lucide-react';

export default function StartStopShowcase() {
  const [selectedStrategy, setSelectedStrategy] = useState('nightly');
  const [selectedAction, setSelectedAction] = useState('stop-recurring');
  const [selectedTemplate, setSelectedTemplate] = useState('nightly');

  // Real app strategy data
  const strategies = [
    {
      id: 'nightly',
      label: 'Nightly Shutdown',
      desc: 'Stop at 10 PM, start at 7 AM on all days',
      savingPct: '65%',
      savingAmt: '$332/mo',
      color: '#00b87a',
      bg: 'rgba(0, 184, 122, 0.08)',
      border: 'rgba(0, 184, 122, 0.3)',
      icon: '🌙'
    },
    {
      id: 'weekend',
      label: 'Weekend Shutdown',
      desc: 'Stop Friday 10 PM, start Monday 8 AM',
      savingPct: '29%',
      savingAmt: '$148/mo',
      color: '#00a0c8',
      bg: 'rgba(0, 160, 200, 0.08)',
      border: 'rgba(0, 160, 200, 0.3)',
      icon: '📅'
    },
    {
      id: 'both',
      label: 'Nights + Weekends',
      desc: 'Off outside business hours (76% off-peak)',
      savingPct: '76%',
      savingAmt: '$388/mo',
      color: '#f5c842',
      bg: 'rgba(245, 200, 66, 0.08)',
      border: 'rgba(245, 200, 66, 0.3)',
      icon: '💸'
    },
    {
      id: 'permanent',
      label: 'Permanent Stop & Capture',
      desc: 'Scale node groups to 0 / capture config state',
      savingPct: '100%',
      savingAmt: '$510/mo',
      color: '#f05555',
      bg: 'rgba(240, 85, 85, 0.08)',
      border: 'rgba(240, 85, 85, 0.3)',
      icon: '🗑️'
    }
  ];

  const templates = [
    { id: 'weekend', label: 'Weekend shutdown', cron: 'Stop Fri 22:00 · Start Mon 08:00' },
    { id: 'nightly', label: 'Nightly shutdown', cron: 'Stop daily 22:00 · Start daily 07:00' },
    { id: 'business', label: 'Business hours', cron: 'Stop Mon-Fri 19:00 · Start Mon-Fri 08:00' }
  ];

  return (
    <section className="section" id="start-stop" style={{ background: 'var(--surface)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <span className="section-label">Lifecycle &amp; Schedule Control</span>
          <h2 className="section-title">Automated Start/Stop Control.<br /><span className="gradient-text">Eliminate idle cloud bill.</span></h2>
          <p className="section-sub" style={{ margin: '0 auto' }}>
            Preview the exact multi-account Start/Stop modal and schedule templates from the Stratus platform UI.
          </p>
        </div>

        {/* Start/Stop Interface Showcase Container */}
        <div style={{
          background: 'var(--bg-2)',
          border: '1px solid var(--border-2)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)'
        }}>
          
          {/* Header Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 20px',
            background: 'var(--surface-2)',
            borderBottom: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <span className="dot dot-red"></span>
                <span className="dot dot-yellow"></span>
                <span className="dot dot-green"></span>
              </div>
              <span style={{ fontWeight: 700, fontSize: '14px', letterSpacing: '-0.01em' }}>
                Stratus — Bulk Resource Start / Stop &amp; Schedule Engine
              </span>
            </div>
            <span className="badge badge-green">3 Resources Selected</span>
          </div>

          <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            
            {/* Left Side: Savings Strategy Cards */}
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-2)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                1. Select Cost Optimization Strategy
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {strategies.map(s => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedStrategy(s.id)}
                    style={{
                      background: selectedStrategy === s.id ? s.bg : 'var(--surface)',
                      border: selectedStrategy === s.id ? `1.5px solid ${s.color}` : '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      padding: '14px 16px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '22px' }}>{s.icon}</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text)' }}>{s.label}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-2)' }}>{s.desc}</div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, fontSize: '15px', color: s.color, fontFamily: 'var(--font-mono)' }}>
                        {s.savingAmt}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>{s.savingPct} saved</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Interactive Schedule Configurator Modal */}
            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--border-2)',
              borderRadius: 'var(--radius)',
              padding: '20px'
            }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-2)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                2. Configure Action &amp; Cron Schedule
              </div>

              {/* Mode Selection Grid */}
              <div className="control-label" style={{ marginBottom: 6 }}>Action Mode:</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                <button
                  className={`btn-secondary ${selectedAction === 'stop-recurring' ? 'btn-primary' : ''}`}
                  onClick={() => setSelectedAction('stop-recurring')}
                  style={{ fontSize: '12.5px', padding: '8px 10px' }}
                >
                  <Square size={13} fill="currentColor" /> Stop (Recurring Cron)
                </button>
                <button
                  className={`btn-secondary ${selectedAction === 'start-recurring' ? 'btn-primary' : ''}`}
                  onClick={() => setSelectedAction('start-recurring')}
                  style={{ fontSize: '12.5px', padding: '8px 10px' }}
                >
                  <Play size={13} fill="currentColor" /> Start (Recurring Cron)
                </button>
              </div>

              {/* Quick Presets */}
              <div className="control-label" style={{ marginBottom: 6 }}>Schedule Presets:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                {templates.map(t => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTemplate(t.id)}
                    style={{
                      background: selectedTemplate === t.id ? 'var(--surface-3)' : 'var(--surface-2)',
                      border: selectedTemplate === t.id ? '1px solid var(--accent)' : '1px solid var(--border)',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '12.5px'
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

              {/* Action Button & Live Cron Summary */}
              <div style={{
                background: 'rgba(0, 184, 122, 0.08)',
                border: '1px solid rgba(0, 184, 122, 0.2)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px',
                marginBottom: '12px'
              }}>
                <div style={{ fontSize: '11px', color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Active Cron Schedule</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600, color: 'var(--accent)' }}>
                  0 22 * * 1-5 (Stop at 22:00 Mon-Fri)
                </div>
              </div>

              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <Clock size={15} /> Apply Schedule to Selected Resources
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
