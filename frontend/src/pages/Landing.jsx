import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Wifi, Users, Calendar, ArrowRight, Waves, Star } from 'lucide-react';

const FLOAT_WORDS = ['Focus', 'Connect', 'Create', 'Build', 'Ship', 'Explore'];

const STATS = [
  { value: '6', label: 'Verified Spaces', suffix: '+' },
  { value: '40', label: 'Nomads Online', suffix: '+' },
  { value: '98', label: 'WiFi Uptime', suffix: '%' },
  { value: '12', label: 'Weekly Meetups', suffix: '' },
];

const FEATURES = [
  {
    icon: Sparkles,
    title: 'AI Workspace Matching',
    desc: 'Tell us your work style — deep focus, calls, or creative — and Claude AI finds your perfect Goa spot instantly.',
    color: '#ff8c42',
    glow: 'rgba(255,140,66,0.3)',
  },
  {
    icon: Wifi,
    title: 'Live WiFi Intelligence',
    desc: 'Real-time crowdsourced WiFi scores, speed data, and power socket counts — no more surprises.',
    color: '#06b6d4',
    glow: 'rgba(6,182,212,0.3)',
  },
  {
    icon: Users,
    title: 'Nomad Social Layer',
    desc: "See who's working where right now. Find collaborators, swap skills, and build your Goa community.",
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.3)',
  },
  {
    icon: Calendar,
    title: 'AI Meetup Engine',
    desc: 'Our AI reads the community pulse and auto-suggests the perfect weekly meetup — topic, venue, and format.',
    color: '#22c55e',
    glow: 'rgba(34,197,94,0.3)',
  },
];

const TESTIMONIALS = [
  {
    text: "Found my go-to coworking spot in 30 seconds. The AI match was scarily accurate.",
    name: "Kai D.", role: "Product Designer · Berlin",
  },
  {
    text: "Met my startup co-founder through the community board. We're now 3 months in. Thank you NomadNest!",
    name: "Priya S.", role: "ML Engineer · Bangalore",
  },
  {
    text: "The WiFi scores alone are worth it. I've stopped walking into cafés with 2 Mbps connections.",
    name: "Marco T.", role: "Full-stack Dev · Lisbon",
  },
];

export default function Landing() {
  const [wordIdx, setWordIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setWordIdx(i => (i + 1) % FLOAT_WORDS.length);
        setVisible(true);
      }, 300);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ paddingTop: 80 }}>
      {/* Hero */}
      <section style={{
        minHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '60px 24px',
        position: 'relative',
      }}>
        {/* Pill badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(255,107,107,0.12)',
          border: '1px solid rgba(255,107,107,0.3)',
          borderRadius: 100,
          padding: '6px 16px',
          marginBottom: 32,
          fontSize: 13,
          color: '#ffb347',
        }}>
          <Waves size={14} />
          Now live in Goa — 40+ nomads online
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#22c55e',
            display: 'inline-block',
            boxShadow: '0 0 8px rgba(34,197,94,0.8)',
            animation: 'glowPulse 2s infinite',
          }} />
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(42px, 8vw, 88px)',
          fontWeight: 600,
          lineHeight: 1.05,
          maxWidth: 900,
          marginBottom: 20,
          color: 'white',
        }}>
          Your perfect Goa workspace,{' '}
          <span style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #ff6b6b, #ff8c42, #ffd166)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            minWidth: 180,
            transition: 'opacity 0.3s ease',
            opacity: visible ? 1 : 0,
          }}>
            {FLOAT_WORDS[wordIdx]}
          </span>
          {' '}awaits.
        </h1>

        <p style={{
          fontSize: 'clamp(16px, 2.5vw, 20px)',
          color: 'rgba(255,255,255,0.6)',
          maxWidth: 580,
          lineHeight: 1.7,
          marginBottom: 40,
        }}>
          AI-powered workspace discovery for digital nomads in Goa.
          Real-time WiFi scores, live community check-ins, and instant collab matching.
        </p>

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/match">
            <button className="btn-sunset" style={{
              fontSize: 16,
              padding: '14px 32px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <Sparkles size={16} />
              AI Match My Space
            </button>
          </Link>
          <Link to="/discover">
            <button className="btn-ghost" style={{
              fontSize: 16,
              padding: '14px 32px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              Browse Workspaces
              <ArrowRight size={16} />
            </button>
          </Link>
        </div>

        {/* Floating cards hint */}
        <div style={{
          marginTop: 60,
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          justifyContent: 'center',
          opacity: 0.7,
        }}>
          {['🌊 Anjuna', '☀️ Assagao', '🌴 Vagator', '🏖️ Palolem'].map(area => (
            <div key={area} style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 100,
              padding: '6px 16px',
              fontSize: 13,
              color: 'rgba(255,255,255,0.6)',
            }}>{area}</div>
          ))}
        </div>
      </section>

      {/* Stats bar */}
      <section style={{
        padding: '40px 24px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          maxWidth: 900,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 24,
          textAlign: 'center',
        }}>
          {STATS.map(({ value, label, suffix }) => (
            <div key={label}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 42,
                fontWeight: 600,
                background: 'var(--gradient-sunset)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1.1,
              }}>
                {value}{suffix}
              </div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: 600,
            color: 'white',
            marginBottom: 14,
          }}>
            Everything a Goa nomad needs
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)', maxWidth: 500, margin: '0 auto' }}>
            Built by nomads, for nomads. We've solved every friction point of working remotely in Goa.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16,
        }}>
          {FEATURES.map(({ icon: Icon, title, desc, color, glow }) => (
            <div key={title} className="glass-card" style={{
              padding: '28px 24px',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                top: -40, right: -40,
                width: 150, height: 150,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`,
                pointerEvents: 'none',
              }} />
              <div style={{
                width: 48, height: 48,
                borderRadius: 14,
                background: `${color}22`,
                border: `1px solid ${color}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16,
              }}>
                <Icon size={22} color={color} />
              </div>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 18,
                fontWeight: 600,
                color: 'white',
                marginBottom: 10,
              }}>
                {title}
              </h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{
        padding: '60px 24px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(24px, 4vw, 38px)',
            textAlign: 'center',
            marginBottom: 40,
            color: 'white',
          }}>
            From the community
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 16,
          }}>
            {TESTIMONIALS.map(({ text, name, role }) => (
              <div key={name} className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="#ffd166" color="#ffd166" />
                  ))}
                </div>
                <p style={{
                  fontSize: 15,
                  color: 'rgba(255,255,255,0.8)',
                  lineHeight: 1.65,
                  marginBottom: 16,
                  fontStyle: 'italic',
                }}>
                  "{text}"
                </p>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'white' }}>{name}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA footer */}
      <section style={{
        padding: '80px 24px',
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(28px, 5vw, 52px)',
          fontWeight: 600,
          color: 'white',
          marginBottom: 16,
          maxWidth: 700,
          margin: '0 auto 16px',
        }}>
          Ready to find your flow in Goa?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 17, marginBottom: 36 }}>
          Join 40+ nomads already discovering, working, and connecting.
        </p>
        <Link to="/match">
          <button className="btn-sunset" style={{
            fontSize: 17,
            padding: '16px 40px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            boxShadow: '0 8px 32px rgba(255,107,107,0.4)',
          }}>
            <Sparkles size={18} />
            Get AI Matched Now
          </button>
        </Link>
        <div style={{ marginTop: 16, fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
          Free · No account needed · Results in 10 seconds
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '28px 24px',
        textAlign: 'center',
        fontSize: 13,
        color: 'rgba(255,255,255,0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
      }}>
        <Waves size={14} />
        NomadNest GoaAI · Built with 🌊 for the nomad community
      </footer>
    </div>
  );
}
