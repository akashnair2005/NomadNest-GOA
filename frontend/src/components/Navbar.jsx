import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Waves, Compass, Sparkles, Users, Calendar, Menu, X } from 'lucide-react';

const navLinks = [
  { to: '/discover', label: 'Discover', icon: Compass },
  { to: '/match', label: 'AI Match', icon: Sparkles },
  { to: '/community', label: 'Community', icon: Users },
  { to: '/meetups', label: 'Meetups', icon: Calendar },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      padding: '12px 24px',
      transition: 'all 0.3s ease',
      background: scrolled
        ? 'rgba(15, 10, 30, 0.85)'
        : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : 'none',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #ff6b6b, #ff8c42)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(255,107,107,0.4)',
          }}>
            <Waves size={18} color="white" />
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              fontWeight: 600,
              color: 'white',
              lineHeight: 1,
            }}>
              NomadNest
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em' }}>
              GOA AI
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}
             className="desktop-nav">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link key={to} to={to} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px',
                borderRadius: 100,
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: active ? 500 : 400,
                color: active ? 'white' : 'rgba(255,255,255,0.6)',
                background: active ? 'rgba(255,107,107,0.15)' : 'transparent',
                border: active ? '1px solid rgba(255,107,107,0.3)' : '1px solid transparent',
                transition: 'all 0.2s ease',
              }}>
                <Icon size={14} />
                {label}
              </Link>
            );
          })}
          <button className="btn-sunset" style={{ marginLeft: 8, padding: '8px 20px', fontSize: 14 }}>
            Check In ✓
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(v => !v)}
          style={{
            display: 'none',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 8,
            padding: 8,
            color: 'white',
            cursor: 'pointer',
          }}
          className="mobile-toggle"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          marginTop: 12,
          background: 'rgba(15,10,30,0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: 16,
          padding: 16,
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}>
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 16px',
              borderRadius: 10,
              textDecoration: 'none',
              color: location.pathname === to ? 'white' : 'rgba(255,255,255,0.6)',
              background: location.pathname === to ? 'rgba(255,107,107,0.15)' : 'transparent',
              fontSize: 15,
            }}>
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
