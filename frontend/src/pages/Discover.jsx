import React, { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, MapPin, RefreshCw } from 'lucide-react';
import WorkspaceCard from '../components/WorkspaceCard';
import { workspaceAPI } from '../services/api';

const AREAS = ['All Areas', 'Anjuna', 'Vagator', 'Assagao', 'Palolem', 'Mapusa', 'Morjim'];
const TYPES = ['All Types', 'coworking', 'cafe'];
const SORT_OPTIONS = [
  { value: 'wifi', label: 'Best WiFi' },
  { value: 'noise', label: 'Quietest' },
  { value: 'occupancy', label: 'Most Available' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'price', label: 'Price: Low' },
];

export default function Discover() {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [area, setArea] = useState('All Areas');
  const [type, setType] = useState('All Types');
  const [sortBy, setSortBy] = useState('wifi');
  const [backupOnly, setBackupOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const fetchWorkspaces = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = {};
      if (area !== 'All Areas') filters.area = area;
      if (type !== 'All Types') filters.type = type;
      if (backupOnly) filters.hasBackup = true;
      const data = await workspaceAPI.getAll(filters);
      setWorkspaces(data.workspaces || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWorkspaces(); }, [area, type, backupOnly]);

  const filtered = workspaces
    .filter(w => {
      if (!search) return true;
      const q = search.toLowerCase();
      return w.name.toLowerCase().includes(q) ||
        w.area.toLowerCase().includes(q) ||
        (w.tags || []).some(t => t.includes(q)) ||
        (w.vibes || []).some(v => v.includes(q));
    })
    .sort((a, b) => {
      if (sortBy === 'wifi') return b.wifiScore - a.wifiScore;
      if (sortBy === 'noise') return a.noiseLevelScore - b.noiseLevelScore;
      if (sortBy === 'occupancy') return (a.currentOccupancy / a.maxCapacity) - (b.currentOccupancy / b.maxCapacity);
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price') return (a.pricePerDay || 0) - (b.pricePerDay || 0);
      return 0;
    });

  return (
    <div style={{ paddingTop: 88, paddingBottom: 60, minHeight: '100vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 5vw, 44px)',
            fontWeight: 600,
            color: 'white',
            marginBottom: 8,
          }}>
            Discover Workspaces
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16 }}>
            {workspaces.length} verified spaces across Goa · Real-time data
          </p>
        </div>

        {/* Search + Filter bar */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
            {/* Search */}
            <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
              <Search size={16} color="rgba(255,255,255,0.4)" style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
              }} />
              <input
                placeholder="Search name, area, vibe..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: 40 }}
              />
            </div>

            {/* Area select */}
            <select value={area} onChange={e => setArea(e.target.value)} style={{ width: 160 }}>
              {AREAS.map(a => <option key={a}>{a}</option>)}
            </select>

            {/* Type select */}
            <select value={type} onChange={e => setType(e.target.value)} style={{ width: 150 }}>
              {TYPES.map(t => <option key={t} value={t}>{t === 'All Types' ? 'All Types' : t === 'coworking' ? 'Coworking' : 'Café'}</option>)}
            </select>

            {/* Sort */}
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width: 150 }}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            {/* Backup power toggle */}
            <button
              onClick={() => setBackupOnly(v => !v)}
              style={{
                padding: '10px 16px',
                borderRadius: 8,
                border: `1px solid ${backupOnly ? 'rgba(34,197,94,0.5)' : 'rgba(255,255,255,0.15)'}`,
                background: backupOnly ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)',
                color: backupOnly ? '#86efac' : 'rgba(255,255,255,0.6)',
                cursor: 'pointer',
                fontSize: 13,
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}
            >
              ⚡ Backup Power
            </button>

            <button
              onClick={fetchWorkspaces}
              className="btn-ghost"
              style={{ padding: '10px 14px' }}
              title="Refresh"
            >
              <RefreshCw size={16} />
            </button>
          </div>

          {/* Results count */}
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            {loading ? 'Loading...' : `${filtered.length} space${filtered.length !== 1 ? 's' : ''} found`}
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 12,
            padding: '16px 20px',
            color: '#fca5a5',
            marginBottom: 24,
            fontSize: 14,
          }}>
            ⚠️ {error} — showing demo data
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="shimmer" style={{ height: 320 }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {filtered.map(w => (
              <WorkspaceCard key={w.id} workspace={w} />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 24px',
            color: 'rgba(255,255,255,0.4)',
          }}>
            <MapPin size={40} style={{ marginBottom: 16, opacity: 0.3 }} />
            <div style={{ fontSize: 18, marginBottom: 8 }}>No spaces found</div>
            <div style={{ fontSize: 14 }}>Try adjusting your filters or search</div>
          </div>
        )}
      </div>
    </div>
  );
}
