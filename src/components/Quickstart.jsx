import React, { useState } from 'react';
import { Copy, Check, Terminal, Play } from 'lucide-react';

export default function Quickstart() {
  const [copied, setCopied] = useState(false);
  const command = 'git clone https://github.com/techwor/stratus-cloud-management.git && cd stratus-cloud-management && docker compose up -d';

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="section" id="quickstart" style={{ padding: '40px 0' }}>
      <div className="container">
        <div className="quickstart-box">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Terminal size={18} style={{ color: 'var(--accent)' }} />
              <h3 style={{ fontSize: '20px', fontWeight: 700 }}>Deploy Stratus in 30 Seconds</h3>
            </div>
            <p style={{ color: 'var(--text-2)', fontSize: '14.5px' }}>
              Self-hosted on your infrastructure using Docker Compose. Zero phone-home telemetry.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '580px' }}>
            <div className="code-snippet">
              <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                $ {command}
              </span>
              <button
                className="btn-outline"
                style={{ padding: '4px 10px', fontSize: '12px', flexShrink: 0 }}
                onClick={handleCopy}
              >
                {copied ? <Check size={14} style={{ color: 'var(--accent)' }} /> : <Copy size={14} />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
