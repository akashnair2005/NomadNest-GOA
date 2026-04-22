import React from 'react';
import { MapPin, MessageSquare } from 'lucide-react';

const STATUS_CONFIG = {
  'deep-focus': { label: 'Deep Focus 🎧', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
  'calls': { label: 'On Calls 📞', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  'creative': { label: 'Creative Mode 🎨', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
  'working': { label: 'Working 💻', color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
  'mixed': { label: 'Mixed Day ⚡', color: '#ff8c42', bg: 'rgba(255,140,66,0.1)' },
};

// Generate avatar initials + color from name
function getAvatarProps(name = '') {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const colors = [
    ['#ff6b6b', '#ff8c42'],
    ['#06b6d4', '#2196a8'],
    ['#a78bfa', '#7c3aed'],
    ['#22c55e', '#16a34a'],
    ['#f59e0b', '#d97706'],
    ['#ec4899', '#be185d'],
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return { initials, gradient: colors[idx] };
}

export default function NomadCard({ nomad, onConnect }) {
  const status = STATUS_CONFIG[nomad.status] || STATUS_CONFIG['working'];
  const avatar = getAvatarProps(nomad.displayName);

  return (
    <div className="glass-card" style={{ padding: '18px', position: 'relative' }}>
      {/* Open to collab indicator */}
      {nomad.isOpenToCollaborate && (
        <div style={{
          position: 'absolute',
          top: 12, right: 12,
          background: 'rgba(34,197,94,0.15)',
          border: '1px solid rgba(34,197,94,0.3)',
          borderRadius: 100,
          padding: '2px 10px',
          fontSize: 11,
          color: '#86efac',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 6px rgba(34,197,94,0.8)' }} />
          Open to collab
        </div>
      )}

      {/* Avatar + name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div style={{
          width: 44, height: 44,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${avatar.gradient[0]}, ${avatar.gradient[1]})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 600, color: 'white',
          flexShrink: 0,
          boxShadow: `0 4px 12px ${avatar.gradient[0]}44`,
        }}>
          {avatar.initials}
        </div>
        <div>
          <div style={{ fontWeight: 500, color: 'white', fontSize: 15, marginBottom: 2 }}>
            {nomad.displayName}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
            <MapPin size={10} />
            {nomad.currentLocationName || nomad.workspaceName}
            {nomad.country && <span style={{ marginLeft: 4 }}>· {nomad.country}</span>}
          </div>
        </div>
      </div>

      {/* Status badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 12px',
        borderRadius: 100,
        background: status.bg,
        border: `1px solid ${status.color}33`,
        fontSize: 12,
        color: status.color,
        marginBottom: 12,
      }}>
        {status.label}
      </div>

      {/* Skills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
        {(nomad.skills || []).map(skill => (
          <span key={skill} className="skill-pill">{skill}</span>
        ))}
      </div>

      {/* Looking for */}
      {nomad.lookingFor && (
        <div style={{
          fontSize: 12,
          color: 'rgba(255,255,255,0.6)',
          marginBottom: 14,
          padding: '8px 10px',
          background: 'rgba(255,255,255,0.04)',
          borderRadius: 8,
          borderLeft: '2px solid rgba(255,209,102,0.4)',
        }}>
          <span style={{ color: '#ffd166' }}>Looking for:</span> {nomad.lookingFor}
        </div>
      )}

      {/* Connect button */}
      {nomad.isOpenToCollaborate && (
        <button
          onClick={() => onConnect?.(nomad)}
          className="btn-ghost"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontSize: 13,
          }}
        >
          <MessageSquare size={14} />
          Connect
        </button>
      )}
    </div>
  );
}
