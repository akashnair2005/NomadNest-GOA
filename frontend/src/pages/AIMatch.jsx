import React, { useState } from 'react';
import { Sparkles, ArrowRight, RefreshCw, Lightbulb } from 'lucide-react';
import WorkspaceCard from '../components/WorkspaceCard';
import { aiAPI } from '../services/api';

const WORK_STYLES = [
  { value: 'deep-focus', emoji: '🎧', label: 'Deep Focus', desc: 'Heads-down coding or writing. Need silence and fast WiFi.' },
  { value: 'calls', emoji: '📞', label: 'Video Calls', desc: 'Back-to-back meetings. Need quiet + reliable connection.' },
  { value: 'creative', emoji: '🎨', label: 'Creative', desc: 'Design, ideation, mood-boarding. Vibe matters more than speed.' },
  { value: 'mixed', emoji: '⚡', label: 'Mixed Day', desc: 'A bit of everything. Flexible and adaptable.' },
];

const SKILL_OPTIONS = [
  'React', 'Node.js', 'Python', 'Design', 'Figma', 'Marketing',
  'SEO', 'Copywriting', 'ML/AI', 'Mobile Dev', 'DevOps', 'Data Analysis',
];

const MUST_HAVES = [
  { value: 'power-backup', label: '⚡ Power backup' },
  { value: 'ultra-fast-wifi', label: '🚀 Ultra fast WiFi' },
  { value: 'phone-booth', label: '🔇 Phone booth' },
  { value: 'standing-desk', label: '🧍 Standing desk' },
  { value: 'outdoor', label: '🌿 Outdoor seating' },
  { value: '24-7', label: '🌙 24/7 access' },
];

const MOODS = [
  { value: 'need to ship', emoji: '🚀', label: 'Ship mode' },
  { value: 'creative exploration', emoji: '🌊', label: 'Explore mode' },
  { value: 'networking', emoji: '🤝', label: 'Network mode' },
  { value: 'just vibing', emoji: '🌴', label: 'Vibe mode' },
];

export default function AIMatch() {
  const [step, setStep] = useState(0); // 0=form, 1=loading, 2=results
  const [form, setForm] = useState({
    workStyle: '',
    skills: [],
    mustHaves: [],
    budget: '',
    mood: '',
  });
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const toggleSkill = (s) => setForm(f => ({
    ...f,
    skills: f.skills.includes(s) ? f.skills.filter(x => x !== s) : [...f.skills, s],
  }));

  const toggleMustHave = (v) => setForm(f => ({
    ...f,
    mustHaves: f.mustHaves.includes(v) ? f.mustHaves.filter(x => x !== v) : [...f.mustHaves, v],
  }));

  const handleMatch = async () => {
    if (!form.workStyle) return;
    setStep(1);
    setError(null);
    try {
      const data = await aiAPI.match(form);
      setResults(data);
      setStep(2);
    } catch (err) {
      setError(err.message);
      setStep(0);
    }
  };

  const reset = () => {
    setStep(0);
    setResults(null);
    setError(null);
    setForm({ workStyle: '', skills: [], mustHaves: [], budget: '', mood: '' });
  };

  return (
    <div style={{ paddingTop: 88, paddingBottom: 60, minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: 820 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(255,140,66,0.12)',
            border: '1px solid rgba(255,140,66,0.3)',
            borderRadius: 100,
            padding: '5px 16px',
            marginBottom: 16,
            fontSize: 13,
            color: '#ffb347',
          }}>
            <Sparkles size={14} />
            Powered by Claude AI
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: 600,
            color: 'white',
            marginBottom: 12,
          }}>
            Find your perfect workspace
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16 }}>
            Answer 4 quick questions. Get AI-matched to your ideal Goa spot in seconds.
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 12,
            padding: '14px 20px',
            color: '#fca5a5',
            marginBottom: 24,
            fontSize: 14,
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* STEP 0: Form */}
        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

            {/* Work style */}
            <div>
              <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 12, display: 'block' }}>
                How will you be working today?
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 10 }}>
                {WORK_STYLES.map(({ value, emoji, label, desc }) => {
                  const active = form.workStyle === value;
                  return (
                    <button
                      key={value}
                      onClick={() => setForm(f => ({ ...f, workStyle: value }))}
                      style={{
                        background: active
                          ? 'rgba(255,107,107,0.18)'
                          : 'rgba(255,255,255,0.05)',
                        border: active
                          ? '1px solid rgba(255,107,107,0.5)'
                          : '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 14,
                        padding: '16px 14px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s',
                        transform: active ? 'scale(1.02)' : 'scale(1)',
                      }}
                    >
                      <div style={{ fontSize: 24, marginBottom: 8 }}>{emoji}</div>
                      <div style={{ fontWeight: 500, color: 'white', fontSize: 15, marginBottom: 4 }}>{label}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.4 }}>{desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Skills */}
            <div>
              <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 12, display: 'block' }}>
                Your skills (optional — helps find collaborators)
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {SKILL_OPTIONS.map(skill => {
                  const active = form.skills.includes(skill);
                  return (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      style={{
                        padding: '7px 16px',
                        borderRadius: 100,
                        border: active ? '1px solid rgba(6,182,212,0.5)' : '1px solid rgba(255,255,255,0.12)',
                        background: active ? 'rgba(6,182,212,0.15)' : 'rgba(255,255,255,0.06)',
                        color: active ? '#7dd3e8' : 'rgba(255,255,255,0.6)',
                        fontSize: 13,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Must-haves */}
            <div>
              <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 12, display: 'block' }}>
                Must-haves
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {MUST_HAVES.map(({ value, label }) => {
                  const active = form.mustHaves.includes(value);
                  return (
                    <button
                      key={value}
                      onClick={() => toggleMustHave(value)}
                      style={{
                        padding: '7px 16px',
                        borderRadius: 100,
                        border: active ? '1px solid rgba(255,209,102,0.5)' : '1px solid rgba(255,255,255,0.12)',
                        background: active ? 'rgba(255,209,102,0.12)' : 'rgba(255,255,255,0.06)',
                        color: active ? '#ffd166' : 'rgba(255,255,255,0.6)',
                        fontSize: 13,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mood + Budget row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 12, display: 'block' }}>
                  Today's vibe
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {MOODS.map(({ value, emoji, label }) => {
                    const active = form.mood === value;
                    return (
                      <button
                        key={value}
                        onClick={() => setForm(f => ({ ...f, mood: value }))}
                        style={{
                          padding: '9px 14px',
                          borderRadius: 10,
                          border: active ? '1px solid rgba(167,139,250,0.5)' : '1px solid rgba(255,255,255,0.1)',
                          background: active ? 'rgba(167,139,250,0.15)' : 'rgba(255,255,255,0.04)',
                          color: active ? '#c4b5fd' : 'rgba(255,255,255,0.6)',
                          fontSize: 13,
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.15s',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        {emoji} {label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 12, display: 'block' }}>
                  Budget per day (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 500"
                  value={form.budget}
                  onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
                  min={0}
                  style={{ marginBottom: 8 }}
                />
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
                  Free = café minimum spend<br />
                  ₹300–600 = coworking day pass
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleMatch}
              disabled={!form.workStyle}
              className="btn-sunset"
              style={{
                fontSize: 16,
                padding: '16px 32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                opacity: form.workStyle ? 1 : 0.4,
                cursor: form.workStyle ? 'pointer' : 'not-allowed',
                width: '100%',
              }}
            >
              <Sparkles size={18} />
              Find My Perfect Workspace
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* STEP 1: Loading */}
        {step === 1 && (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{
              width: 72, height: 72,
              borderRadius: '50%',
              background: 'rgba(255,107,107,0.1)',
              border: '2px solid rgba(255,107,107,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
              animation: 'glowPulse 1.5s infinite',
            }}>
              <Sparkles size={28} color="#ff8c42" />
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 26,
              color: 'white',
              marginBottom: 12,
            }}>
              Claude is thinking...
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 15 }}>
              Analyzing {form.workStyle} requirements across all Goa workspaces
            </p>
            <div style={{
              marginTop: 24,
              display: 'flex',
              justifyContent: 'center',
              gap: 8,
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 8, height: 8,
                  borderRadius: '50%',
                  background: '#ff8c42',
                  animation: `wave 1.2s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Results */}
        {step === 2 && results && (
          <div>
            {/* AI message */}
            <div style={{
              background: 'rgba(255,140,66,0.08)',
              border: '1px solid rgba(255,140,66,0.2)',
              borderRadius: 16,
              padding: '20px 22px',
              marginBottom: 28,
              display: 'flex',
              gap: 14,
              alignItems: 'flex-start',
            }}>
              <div style={{
                width: 36, height: 36,
                borderRadius: '50%',
                background: 'rgba(255,140,66,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Sparkles size={16} color="#ff8c42" />
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#ffb347', marginBottom: 6, fontWeight: 500 }}>Claude AI</div>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
                  {results.personalizedMessage}
                </p>
              </div>
            </div>

            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 24,
              color: 'white',
              marginBottom: 20,
            }}>
              Your top matches
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {results.recommendations?.map((rec, i) => (
                rec.workspace && (
                  <WorkspaceCard
                    key={rec.workspaceId}
                    workspace={{ ...rec.workspace, spotsLeft: rec.workspace.maxCapacity - rec.workspace.currentOccupancy }}
                    matchScore={rec.score}
                    matchReason={rec.matchReason}
                    proTip={rec.proTip}
                    bestTimeToGo={rec.bestTimeToGo}
                  />
                )
              ))}
            </div>

            {results.alternativeSuggestion && (
              <div style={{
                marginTop: 20,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                padding: '14px 18px',
                display: 'flex',
                gap: 10,
                alignItems: 'flex-start',
              }}>
                <Lightbulb size={16} color="#ffd166" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: 12, color: '#ffd166', marginBottom: 4 }}>Also consider</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{results.alternativeSuggestion}</div>
                </div>
              </div>
            )}

            <button
              onClick={reset}
              className="btn-ghost"
              style={{
                marginTop: 24,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                width: '100%',
                justifyContent: 'center',
              }}
            >
              <RefreshCw size={14} />
              Try different preferences
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
