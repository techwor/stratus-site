import React, { useState } from 'react';
import { Menu, X, Github } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="nav">
      <div className="container nav-inner">
        <a href="#" className="nav-brand">
          <svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="nbg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#00b87a"/>
                <stop offset="100%" stopColor="#00a0c8"/>
              </linearGradient>
            </defs>
            <rect width="64" height="64" rx="14" fill="url(#nbg)"/>
            <path d="M46 33a8 8 0 0 0-7.4-8A10 10 0 0 0 19 30a6 6 0 0 0 1 12h26a5 5 0 0 0 0-9z" fill="white" opacity=".92"/>
            <circle cx="22" cy="52" r="3.5" fill="white" opacity=".8"/>
            <circle cx="32" cy="52" r="3.5" fill="white" opacity=".8"/>
            <circle cx="42" cy="52" r="3.5" fill="white" opacity=".8"/>
          </svg>
          <span>Stratus</span>
        </a>

        <nav className={`nav-links ${mobileOpen ? 'open' : ''}`}>
          <a href="#capabilities" onClick={() => setMobileOpen(false)}>Capabilities</a>
          <a href="#start-stop" onClick={() => setMobileOpen(false)}>Start &amp; Stop</a>
          <a href="#quickstart" onClick={() => setMobileOpen(false)}>Quickstart</a>
          <a href="#contact" onClick={() => setMobileOpen(false)}>Contact Us</a>
          <a
            href="https://github.com/techwor/stratus-cloud-management.git"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
            style={{ padding: '6px 14px', fontSize: '13px' }}
          >
            <Github size={15} />
            <span>GitHub</span>
          </a>
        </nav>

        <button
          className="nav-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
}
