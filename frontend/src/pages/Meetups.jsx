import React, { useState, useEffect } from 'react';
import { Calendar, Sparkles, MapPin, Users, Clock, Plus, CheckCircle } from 'lucide-react';
import { meetupAPI, aiAPI } from '../services/api';

export default function Meetups() {
  const [meetups, setMeetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiMeetup, setAiMeetup] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [rsvpd, setRsvpd] = useState(new Set());
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ title: '', description: '', venue: '', date: '', time: '', format: '' });

  useEffect(() => {
    meetupAPI.getAll()
      .then(d => setMeetups(d.meetups || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const generateAIMeetup = async () => {
    setAiLoading(true);
    try {
      const data = await aiAPI.meetup();
      setAiMeetup(data);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleRsvp = async (id) => {
    try {
      await meetupAPI.rsvp(id);
      setRsvpd(s => new Set([...s, id]));
      setMeetups(prev => prev.map(m =>
        m.id === id ? { ...m, rsvpCount: m.rsvpCount + 1 } : m
      ));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async () => {
    try {
      const data = await meetupAPI.create({ ...createForm, createdBy: 'demo_user' });
      setMeetups(prev => [data.meetup, ...prev]);
      setShowCreate(false);
      setCreateForm({ title: '', description: '', venue: '', date: '', time: '', format: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const MeetupCard = ({ meetup, isAI }) => {
    const done = rsvpd.has(meetup.id);
    return (
      <div className="glass-card" style={{ padding: '22px', position: 'relative', overflow: 'hidden' }}>
        {isAI && (
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, #ff6b6b, #ff8c42, #ffd166)',
          }} />
        )}
        {meetup.isAiGenerated && (
          <div style={{
            position: 'absolute', top: 14, right: 14,
            background: 'rgba(255,140,66,0.15)',
            border: '1px solid rgba(255,140,66,0.3)',
            borderRadius: 100,
            padding: '2px 10px',
            fontSize: 11, color: '#ffb347',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <Sparkles size={10} />
            AI suggested
          </div>
        )}

        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 20,
          color: 'white',
          marginBottom: 6,
          paddingRight: meetup.isAiGenerated ? 100 : 0,
        }}>
          {meetup.title}
        </h3>

        <div style={{ fontSize: 13, color: '#ffb347', marginBottom: 14 }}>
          {meetup.theme || meetup.format}
        </div>

        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: 16 }}>
          {meetup.description}
        </p>

        {meetup.icebreaker && (
          <div style={{
            fontSize: 13, color: 'rgba(255,255,255,0.5)',
            background: 'rgba(255,255,255,0.04)',
            borderRadius: 8,
            padding: '8px 12px',
            marginBottom: 16,
            borderLeft: '2px solid rgba(167,139,250,0.4)',
          }}>
            🎯 Icebreaker: {meetup.icebreaker}
          </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
            <MapPin size={13} color="#06b6d4" />
            {meetup.venue || meetup.suggestedVenue}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
            <Clock size={13} color="#06b6d4" />
            {meetup.date || meetup.suggestedDay} · {meetup.time || meetup.suggestedTime}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
            <Users size={13} color="#06b6d4" />
            {meetup.rsvpCount} going · ~{meetup.expectedTurnout} expected
          </div>
        </div>

        {(meetup.tags || []).length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            {meetup.tags.map(t => (
              <span key={t} className="skill-pill">#{t}</span>
            ))}
          </div>
        )}

        <button
          onClick={() => handleRsvp(meetup.id)}
          disabled={done}
          className={done ? 'btn-ghost' : 'btn-sunset'}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontSize: 14,
            opacity: done ? 0.7 : 1,
          }}
        >
          {done ? (
            <><CheckCircle size={14} /> You're going! 🎉</>
          ) : (
            <>RSVP — I'm in!</>
          )}
        </button>
      </div>
    );
  };

  return (
    <div style={{ paddingTop: 88, paddingBottom: 60, minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: 860 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 14 }}>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(26px, 5vw, 42px)',
              fontWeight: 600,
              color: 'white',
              marginBottom: 8,
            }}>
              Meetups & Sessions
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15 }}>
              Community events, skill swaps, and build-in-public sessions
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={generateAIMeetup}
              disabled={aiLoading}
              className="btn-ghost"
              style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}
            >
              <Sparkles size={14} />
              {aiLoading ? 'Generating...' : 'AI Suggest'}
            </button>
            <button
              onClick={() => setShowCreate(v => !v)}
              className="btn-sunset"
              style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}
            >
              <Plus size={14} />
              Create
            </button>
          </div>
        </div>

        {/* Create form */}
        {showCreate && (
          <div className="glass-card" style={{ padding: '24px', marginBottom: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'white', marginBottom: 16 }}>
              Host a meetup or session
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input placeholder="Title" value={createForm.title} onChange={e => setCreateForm(f => ({ ...f, title: e.target.value }))} />
              <textarea placeholder="Description" rows={3} value={createForm.description} onChange={e => setCreateForm(f => ({ ...f, description: e.target.value }))} style={{ resize: 'vertical' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <input placeholder="Venue name" value={createForm.venue} onChange={e => setCreateForm(f => ({ ...f, venue: e.target.value }))} />
                <input placeholder="Format (e.g. Lightning talks)" value={createForm.format} onChange={e => setCreateForm(f => ({ ...f, format: e.target.value }))} />
                <input placeholder="Date (e.g. This Saturday)" value={createForm.date} onChange={e => setCreateForm(f => ({ ...f, date: e.target.value }))} />
                <input placeholder="Time (e.g. 6:00 PM)" value={createForm.time} onChange={e => setCreateForm(f => ({ ...f, time: e.target.value }))} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={handleCreate} className="btn-sunset" style={{ flex: 1, fontSize: 14 }}>
                  Post meetup
                </button>
                <button onClick={() => setShowCreate(false)} className="btn-ghost" style={{ fontSize: 14 }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI generated meetup */}
        {aiMeetup && (
          <div style={{ marginBottom: 24 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              marginBottom: 12, fontSize: 13, color: '#ff8c42',
            }}>
              <Sparkles size={14} />
              AI-generated this week's meetup idea
            </div>
            <MeetupCard meetup={aiMeetup} isAI={true} />
          </div>
        )}

        {/* Meetup list */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[...Array(2)].map((_, i) => <div key={i} className="shimmer" style={{ height: 280 }} />)}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {meetups.map(m => <MeetupCard key={m.id} meetup={m} />)}
          </div>
        )}

        {!loading && meetups.length === 0 && !aiMeetup && (
          <div style={{ textAlign: 'center', padding: '60px 24px', color: 'rgba(255,255,255,0.4)' }}>
            <Calendar size={40} style={{ marginBottom: 16, opacity: 0.3 }} />
            <div style={{ fontSize: 18, marginBottom: 8 }}>No meetups yet</div>
            <div style={{ fontSize: 14 }}>Be the first to host one, or let AI suggest one!</div>
          </div>
        )}
      </div>
    </div>
  );
}
