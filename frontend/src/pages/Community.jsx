import React, { useState, useEffect } from 'react';
import { Users, Zap, RefreshCw, Filter } from 'lucide-react';
import NomadCard from '../components/NomadCard';
import { checkinAPI, aiAPI } from '../services/api';

const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All nomads' },
  { value: 'collaborate', label: '🤝 Open to collab' },
  { value: 'deep-focus', label: '🎧 Deep Focus' },
  { value: 'calls', label: '📞 On Calls' },
  { value: 'creative', label: '🎨 Creative' },
];

export default function Community() {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [collabMessage, setCollabMessage] = useState('');
  const [selectedNomad, setSelectedNomad] = useState(null);

  const fetchCheckins = async () => {
    setLoading(true);
    try {
      const data = await checkinAPI.getAll();
      setCheckins(data.checkins || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCheckins(); }, []);

  const handleConnect = async (nomad) => {
    setSelectedNomad(nomad);
    try {
      const data = await aiAPI.collab({
        skills: ['React', 'Node.js'],
        lookingFor: 'collaborator',
        projectDescription: 'Looking to connect with other nomads in Goa',
      });
      setCollabMessage(data.message);
    } catch {
      setCollabMessage("Reach out to this nomad — they're open to connecting!");
    }
  };

  const filtered = checkins.filter(c => {
    if (filter === 'all') return true;
    if (filter === 'collaborate') return c.isOpenToCollaborate;
    return c.status === filter;
  });

  // Group by workspace
  const byWorkspace = filtered.reduce((acc, c) => {
    const key = c.workspaceName || 'Unknown';
    if (!acc[key]) acc[key] = [];
    acc[key].push(c);
    return acc;
  }, {});

  return (
    <div style={{ paddingTop: 88, paddingBottom: 60, minHeight: '100vh' }}>
      <div className="container">

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(26px, 5vw, 42px)',
              fontWeight: 600,
              color: 'white',
              marginBottom: 8,
            }}>
              Live Community
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15 }}>
              {checkins.length} nomads checked in right now · Goa, India
            </p>
          </div>
          <button onClick={fetchCheckins} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        {/* Live pulse indicator */}
        <div style={{
          background: 'rgba(34,197,94,0.06)',
          border: '1px solid rgba(34,197,94,0.15)',
          borderRadius: 12,
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 24,
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#86efac' }}>
            <span style={{
              width: 8, height: 8,
              borderRadius: '50%',
              background: '#22c55e',
              display: 'inline-block',
              boxShadow: '0 0 8px rgba(34,197,94,0.8)',
              animation: 'glowPulse 2s infinite',
            }} />
            Live data · Updates every 30 seconds
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            {checkins.filter(c => c.isOpenToCollaborate).length} open to collaboration ·{' '}
            {Object.keys(byWorkspace).length} active locations
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
          {STATUS_FILTER_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              style={{
                padding: '7px 16px',
                borderRadius: 100,
                border: filter === value ? '1px solid rgba(255,107,107,0.5)' : '1px solid rgba(255,255,255,0.12)',
                background: filter === value ? 'rgba(255,107,107,0.15)' : 'rgba(255,255,255,0.05)',
                color: filter === value ? '#ffb347' : 'rgba(255,255,255,0.55)',
                fontSize: 13,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* AI Collab modal */}
        {selectedNomad && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
          onClick={() => setSelectedNomad(null)}
          >
            <div
              className="glass-card"
              style={{ maxWidth: 480, width: '100%', padding: '28px' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 16,
                color: '#ff8c42',
              }}>
                <Zap size={16} />
                <span style={{ fontSize: 13, fontWeight: 500 }}>AI Collab Suggestion</span>
              </div>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 20,
                color: 'white',
                marginBottom: 12,
              }}>
                Connect with {selectedNomad.displayName}
              </h3>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: 20 }}>
                {collabMessage || 'Loading AI suggestion...'}
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn-sunset" style={{ flex: 1, fontSize: 14 }}>
                  Send message
                </button>
                <button
                  className="btn-ghost"
                  style={{ fontSize: 14 }}
                  onClick={() => setSelectedNomad(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Nomad grid grouped by location */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
            {[...Array(4)].map((_, i) => <div key={i} className="shimmer" style={{ height: 240 }} />)}
          </div>
        ) : Object.keys(byWorkspace).length > 0 ? (
          Object.entries(byWorkspace).map(([workspace, nomads]) => (
            <div key={workspace} style={{ marginBottom: 36 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 14,
              }}>
                <div style={{
                  width: 8, height: 8,
                  borderRadius: '50%',
                  background: '#22c55e',
                  boxShadow: '0 0 8px rgba(34,197,94,0.7)',
                  flexShrink: 0,
                }} />
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 18,
                  color: 'white',
                }}>
                  {workspace}
                </h2>
                <span style={{
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.4)',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: 100,
                  padding: '2px 10px',
                }}>
                  {nomads.length} nomad{nomads.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: 14,
              }}>
                {nomads.map(nomad => (
                  <NomadCard
                    key={nomad.userId}
                    nomad={{ ...nomad, displayName: nomad.displayName, currentLocationName: nomad.workspaceName }}
                    onConnect={handleConnect}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 24px', color: 'rgba(255,255,255,0.4)' }}>
            <Users size={40} style={{ marginBottom: 16, opacity: 0.3 }} />
            <div style={{ fontSize: 18, marginBottom: 8 }}>No nomads match this filter</div>
            <div style={{ fontSize: 14 }}>Try a different filter or check back soon</div>
          </div>
        )}
      </div>
    </div>
  );
}
