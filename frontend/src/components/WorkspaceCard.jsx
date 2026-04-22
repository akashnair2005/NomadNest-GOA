import React from 'react';
import { Link } from 'react-router-dom';
import { Wifi, Volume2, Zap, MapPin, Users, Star, Clock, Shield } from 'lucide-react';

const NOISE_COLORS = {
  'very-low': '#22c55e',
  'low': '#86efac',
  'moderate': '#f59e0b',
  'variable': '#f97316',
  'high': '#ef4444',
};

const NOISE_LABELS = {
  'very-low': 'Silent',
  'low': 'Quiet',
  'moderate': 'Moderate',
  'variable': 'Variable',
  'high': 'Lively',
};

const TYPE_LABELS = {
  'coworking': 'Coworking',
  'cafe': 'Café',
};

export default function WorkspaceCard({ workspace, matchScore, matchReason, proTip, bestTimeToGo, style = {} }) {
  const occupancyPct = Math.round((workspace.currentOccupancy / workspace.maxCapacity) * 100);
  const noiseColor = NOISE_COLORS[workspace.noiseLevel] || '#f59e0b';
  const wifiDots = Math.round(workspace.wifiScore / 2); // out of 5

  return (
    <Link
      to={`/workspace/${workspace.id}`}
      style={{
        display: 'block',
        textDecoration: 'none',
        ...style,
      }}
    >
      <div className="glass-card" style={{
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
      }}>
        {/* Subtle top glow */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: 2,
          background: matchScore
            ? 'linear-gradient(90deg, #ff6b6b, #ff8c42)'
            : 'linear-gradient(90deg, rgba(6,182,212,0.5), rgba(255,255,255,0.1))',
          borderRadius: '24px 24px 0 0',
        }} />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 18,
                fontWeight: 600,
                color: 'white',
              }}>
                {workspace.name}
              </h3>
              {workspace.isVerified && (
                <Shield size={14} color="#06b6d4" title="Verified" />
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
              <MapPin size={12} />
              {workspace.area} · {workspace.neighborhood}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            {matchScore && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(255,107,107,0.3), rgba(255,140,66,0.3))',
                border: '1px solid rgba(255,107,107,0.4)',
                borderRadius: 100,
                padding: '3px 12px',
                fontSize: 13,
                fontWeight: 600,
                color: '#ffd166',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                ✦ {matchScore}%
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#ffd166', fontSize: 12 }}>
              <Star size={11} fill="#ffd166" />
              {workspace.rating} ({workspace.reviewCount})
            </div>
          </div>
        </div>

        {/* Type + Price */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
          <span className="badge badge-ocean">
            {TYPE_LABELS[workspace.type] || workspace.type}
          </span>
          {workspace.pricePerDay > 0 ? (
            <span className="badge badge-gold">
              ₹{workspace.pricePerDay}/day
            </span>
          ) : (
            <span className="badge badge-green">
              Free entry
            </span>
          )}
          {workspace.hasBackupPower && (
            <span className="badge badge-green">
              <Zap size={10} /> Power backup
            </span>
          )}
        </div>

        {/* Stats row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 10,
          marginBottom: 14,
          padding: '12px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          {/* WiFi */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
              <Wifi size={14} color="#06b6d4" />
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>WiFi</div>
            <div className="wifi-dots" style={{ justifyContent: 'center' }}>
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className={`wifi-dot ${i < wifiDots ? 'active' : ''}`} />
              ))}
            </div>
            <div style={{ fontSize: 11, color: '#7dd3e8', marginTop: 3 }}>{workspace.wifiSpeed}</div>
          </div>

          {/* Noise */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
              <Volume2 size={14} color={noiseColor} />
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Noise</div>
            <div className="noise-bar" style={{ width: '100%' }}>
              <div className="noise-fill" style={{
                width: `${(workspace.noiseLevelScore / 10) * 100}%`,
                background: noiseColor,
              }} />
            </div>
            <div style={{ fontSize: 11, color: noiseColor, marginTop: 3 }}>{NOISE_LABELS[workspace.noiseLevel]}</div>
          </div>

          {/* Occupancy */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
              <Users size={14} color={occupancyPct > 75 ? '#ef4444' : '#22c55e'} />
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Spots</div>
            <div style={{
              fontSize: 14,
              fontWeight: 600,
              color: occupancyPct > 75 ? '#fca5a5' : '#86efac',
            }}>
              {workspace.spotsLeft ?? workspace.maxCapacity - workspace.currentOccupancy}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>left</div>
          </div>
        </div>

        {/* Best hours */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
          <Clock size={12} />
          Best hours: <span style={{ color: '#ffd166' }}>{workspace.bestHours}</span>
        </div>

        {/* AI Match reason */}
        {matchReason && (
          <div style={{
            background: 'rgba(255,107,107,0.08)',
            border: '1px solid rgba(255,107,107,0.2)',
            borderRadius: 10,
            padding: '10px 12px',
            marginBottom: 10,
            fontSize: 13,
            color: 'rgba(255,255,255,0.8)',
            lineHeight: 1.5,
          }}>
            <span style={{ color: '#ffb347', marginRight: 4 }}>✦ AI:</span>
            {matchReason}
          </div>
        )}

        {/* Pro tip */}
        {proTip && (
          <div style={{
            fontSize: 12,
            color: '#7dd3e8',
            display: 'flex',
            gap: 6,
            alignItems: 'flex-start',
          }}>
            <span style={{ flexShrink: 0 }}>💡</span>
            {proTip}
          </div>
        )}

        {/* Tags */}
        {!matchReason && workspace.tags && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
            {workspace.tags.slice(0, 4).map(tag => (
              <span key={tag} className="skill-pill">#{tag}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
