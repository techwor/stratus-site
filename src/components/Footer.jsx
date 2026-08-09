import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: 'var(--text)' }}>
          <svg width="24" height="24" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="fbg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#00b87a"/>
                <stop offset="100%" stopColor="#00a0c8"/>
              </linearGradient>
            </defs>
            <rect width="64" height="64" rx="14" fill="url(#fbg)"/>
            <path d="M46 33a8 8 0 0 0-7.4-8A10 10 0 0 0 19 30a6 6 0 0 0 1 12h26a5 5 0 0 0 0-9z" fill="white" opacity=".92"/>
          </svg>
          <span>Stratus</span>
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          <a href="#overview">Overview &amp; Control</a>
          <a href="#capabilities">Capabilities</a>
          <a href="#quickstart">Quickstart</a>
          <a href="#contact">Contact Us</a>
          <a href="https://github.com/techwor/stratus-cloud-management.git" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>

        <div>MIT License · Self-Hosted Cloud Management</div>
      </div>
    </footer>
  );
}
