import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Wifi, Volume2, Zap, MapPin, Star, Clock, Users,
  Shield, Monitor, Coffee, Send, CheckCircle
} from 'lucide-react';
import { workspaceAPI, checkinAPI } from '../services/api';

const NOISE_LABELS = {
  'very-low': 'Silent', 'low': 'Quiet',
  'moderate': 'Moderate', 'variable': 'Variable', 'high': 'Lively',
};
const NOISE_COLORS = {
  'very-low': '#22c55e', 'low': '#86efac',
  'moderate': '#f59e0b', 'variable': '#f97316', 'high': '#ef4444',
};

export default function WorkspaceDetail() {
  const { id } = useParams();
  const [workspace, setWorkspace] = useState(null);
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkedIn, setCheckedIn] = useState(false);
  const [reportSent, setReportSent] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportForm, setReportForm] = useState({ wifiSpeed: '', noiseLevel: 'low', occupancyEstimate: '', powerAvailable: true });
  const [showNegotiate, setShowNegotiate] = useState(false);
  const [negotiateSent, setNegotiateSent] = useState(false);

  useEffect(() => {
    Promise.all([
      workspaceAPI.getById(id),
      checkinAPI.getAll({ workspaceId: id }),
    ]).then(([ws, ch]) => {
      setWorkspace(ws);
      setCheckins(ch.checkins || []);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleCheckin = async () => {
    try {
      await checkinAPI.checkin({
        userId: 'user_demo',
        displayName: 'You',
        skills: ['React', 'Node.js'],
        workspaceId: id,
        status: 'working',
        isOpenToCollaborate: true,
      });
      setCheckedIn(true);
    } catch (err) { console.error(err); }
  };

  const handleReport = async () => {
    try {
      await workspaceAPI.report(id, { ...reportForm, reportedBy: 'user_demo' });
      setReportSent(true);
      setShowReport(false);
    } catch (err) { console.error(err); }
  };

  if (loading) return (
    <div style={{ paddingTop: 120, textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
      <div className="shimmer" style={{ height: 400, maxWidth: 800, margin: '0 auto', borderRadius: 20 }} />
    </div>
  );

  if (!workspace) return (
    <div style={{ paddingTop: 120, textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
      Workspace not found. <Link to="/discover" style={{ color: '#ff8c42' }}>Back to discover</Link>
    </div>
  );

  const wifiDots = Math.round(workspace.wifiScore / 2);
  const noiseColor = NOISE_COLORS[workspace.noiseLevel] || '#f59e0b';
  const occupancyPct = Math.round((workspace.currentOccupancy / workspace.maxCapacity) * 100);

  return (
    <div style={{ paddingTop: 88, paddingBottom: 60 }}>
      <div className="container" style={{ maxWidth: 860 }}>
        {/* Back */}
        <Link to="/discover" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          color: 'rgba(255,255,255,0.5)', textDecoration: 'none',
          fontSize: 14, marginBottom: 24,
          transition: 'color 0.2s',
        }}>
          <ArrowLeft size={16} />
          Back to Discover
        </Link>

        {/* Hero */}
        <div className="glass-card" style={{ padding: '28px', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 3,
            background: 'linear-gradient(90deg, #ff6b6b, #ff8c42, #ffd166)',
          }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <h1 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(22px, 4vw, 34px)',
                  fontWeight: 600,
                  color: 'white',
                }}>
                  {workspace.name}
                </h1>
                {workspace.isVerified && <Shield size={16} color="#06b6d4" />}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
                <MapPin size={13} />
                {workspace.area} · {workspace.neighborhood}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#ffd166' }}>
              <Star size={16} fill="#ffd166" />
              <span style={{ fontSize: 18, fontWeight: 600 }}>{workspace.rating}</span>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>({workspace.reviewCount} reviews)</span>
            </div>
          </div>

          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.65, marginBottom: 20 }}>
            {workspace.description}
          </p>

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {(workspace.tags || []).map(t => <span key={t} className="skill-pill">#{t}</span>)}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={handleCheckin}
              disabled={checkedIn}
              className={checkedIn ? 'btn-ghost' : 'btn-sunset'}
              style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}
            >
              {checkedIn ? <><CheckCircle size={14} /> Checked in!</> : '✓ Check In Here'}
            </button>
            <button
              onClick={() => setShowReport(v => !v)}
              className="btn-ghost"
              style={{ fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Wifi size={14} />
              {reportSent ? '✓ Report sent' : 'Report WiFi'}
            </button>
            <button
              onClick={() => setShowNegotiate(v => !v)}
              className="btn-ghost"
              style={{ fontSize: 14 }}
            >
              💬 Negotiate rate
            </button>
          </div>
        </div>

        {/* WiFi report form */}
        {showReport && (
          <div className="glass-card" style={{ padding: '20px', marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'white', marginBottom: 14 }}>
              Share your real-time experience
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              <div>
                <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6 }}>WiFi speed right now (Mbps)</label>
                <input type="number" placeholder="e.g. 60" value={reportForm.wifiSpeed} onChange={e => setReportForm(f => ({ ...f, wifiSpeed: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6 }}>Noise level</label>
                <select value={reportForm.noiseLevel} onChange={e => setReportForm(f => ({ ...f, noiseLevel: e.target.value }))}>
                  <option value="very-low">Silent</option>
                  <option value="low">Quiet</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">Lively</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6 }}>Approx occupancy (%)</label>
                <input type="number" min={0} max={100} placeholder="e.g. 60" value={reportForm.occupancyEstimate} onChange={e => setReportForm(f => ({ ...f, occupancyEstimate: e.target.value }))} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 24 }}>
                <input type="checkbox" id="power" checked={reportForm.powerAvailable} onChange={e => setReportForm(f => ({ ...f, powerAvailable: e.target.checked }))} style={{ width: 'auto' }} />
                <label htmlFor="power" style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Power sockets available</label>
              </div>
            </div>
            <button onClick={handleReport} className="btn-sunset" style={{ fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Send size={14} /> Submit report
            </button>
          </div>
        )}

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 20 }}>
          {[
            { icon: Wifi, color: '#06b6d4', label: 'WiFi Speed', value: workspace.wifiSpeed, sub: `Score: ${workspace.wifiScore}/10` },
            { icon: Volume2, color: noiseColor, label: 'Noise Level', value: NOISE_LABELS[workspace.noiseLevel], sub: workspace.bestHours },
            { icon: Users, color: occupancyPct > 75 ? '#ef4444' : '#22c55e', label: 'Occupancy', value: `${occupancyPct}%`, sub: `${workspace.spotsLeft ?? workspace.maxCapacity - workspace.currentOccupancy} spots left` },
            { icon: Zap, color: '#ffd166', label: 'Power Backup', value: workspace.hasBackupPower ? 'Yes' : 'No', sub: workspace.powerSockets },
          ].map(({ icon: Icon, color, label, value, sub }) => (
            <div key={label} className="glass-card" style={{ padding: '18px', textAlign: 'center' }}>
              <Icon size={22} color={color} style={{ marginBottom: 8 }} />
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 20, fontWeight: 600, color: 'white', marginBottom: 2 }}>{value}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Info row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          {/* Amenities */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'white', marginBottom: 12 }}>Amenities</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {(workspace.amenities || []).map(a => (
                <span key={a} style={{
                  padding: '5px 12px',
                  borderRadius: 100,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.6)',
                }}>
                  {a}
                </span>
              ))}
            </div>
          </div>

          {/* Pricing + hours */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'white', marginBottom: 12 }}>Pricing & Hours</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {workspace.pricePerDay > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>Day pass</span>
                  <span style={{ color: '#ffd166', fontWeight: 500 }}>₹{workspace.pricePerDay}</span>
                </div>
              )}
              {workspace.pricePerMonth && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>Monthly</span>
                  <span style={{ color: '#ffd166', fontWeight: 500 }}>₹{workspace.pricePerMonth}</span>
                </div>
              )}
              {workspace.minimumSpend && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>Min. spend</span>
                  <span style={{ color: '#86efac', fontWeight: 500 }}>₹{workspace.minimumSpend}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>Hours</span>
                <span style={{ color: 'white' }}>{workspace.openTime} – {workspace.closeTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Who's here now */}
        {checkins.length > 0 && (
          <div className="glass-card" style={{ padding: '20px', marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'white', marginBottom: 14 }}>
              Who's here right now ({checkins.length})
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {checkins.map(c => (
                <div key={c.userId} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: 100,
                  padding: '6px 12px',
                }}>
                  <div style={{
                    width: 24, height: 24,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ff6b6b, #ff8c42)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 600, color: 'white',
                  }}>
                    {c.displayName[0]}
                  </div>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>{c.displayName}</span>
                  {c.isOpenToCollaborate && (
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: '#22c55e',
                      boxShadow: '0 0 6px rgba(34,197,94,0.8)',
                    }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Negotiate modal */}
        {showNegotiate && !negotiateSent && (
          <div className="glass-card" style={{ padding: '22px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'white', marginBottom: 16 }}>
              Request a custom rate
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
              <input placeholder="Your name" />
              <input placeholder="Your email" type="email" />
              <input placeholder="Duration (e.g. 2 months)" />
              <input placeholder="Budget (₹ per month)" type="number" />
              <textarea placeholder="Tell them about your work + why you'd be a great long-term tenant" rows={3} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setNegotiateSent(true)} className="btn-sunset" style={{ flex: 1, fontSize: 14 }}>
                Send request
              </button>
              <button onClick={() => setShowNegotiate(false)} className="btn-ghost" style={{ fontSize: 14 }}>Cancel</button>
            </div>
          </div>
        )}
        {negotiateSent && (
          <div style={{
            background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
            borderRadius: 12, padding: '16px 20px', fontSize: 14, color: '#86efac',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <CheckCircle size={16} />
            Request sent! {workspace.name} will get back to you within 24 hours.
          </div>
        )}
      </div>
    </div>
  );
}
