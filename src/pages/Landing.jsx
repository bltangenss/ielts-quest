import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../components/Card';
import { CARDS } from '../data/cards';

// Spring physics — weighty, premium feel. No linear easing.
const spring = { type: 'spring', stiffness: 75, damping: 17 };
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { ...spring, delay },
});

// Arrow icon nested inside button pill
function ArrowIcon({ color = '#fff', size = 11 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 11 11" fill="none">
      <path d="M1 10L10 1M10 1H3M10 1v7" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Trailing icon pill inside CTA button (Button-in-Button pattern)
function BtnTrail({ color = '#fff', bg = 'rgba(255,255,255,0.2)' }) {
  return (
    <span style={{ width: 24, height: 24, borderRadius: 999, background: bg, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
      <ArrowIcon color={color} />
    </span>
  );
}

export default function Landing() {
  const fanCards = [
    CARDS.find(c => c.rarity === 'common'),
    CARDS.find(c => c.rarity === 'uncommon'),
    CARDS.find(c => c.rarity === 'rare'),
    CARDS.find(c => c.rarity === 'epic'),
    CARDS.find(c => c.rarity === 'legendary'),
  ].filter(Boolean);

  return (
    <>
      {/* Responsive collapse rules */}
      <style>{`
        @media (max-width: 768px) {
          .lnd-hero   { grid-template-columns: 1fr !important; padding-top: 2rem !important; }
          .lnd-hero-cards { display: none !important; }
          .lnd-bento  { grid-template-columns: 1fr !important; }
          .lnd-bento > *:first-child { grid-row: auto !important; }
          .lnd-arena  { grid-template-columns: 1fr !important; }
          .lnd-arena-badges { display: none !important; }
          .lnd-fan    { gap: 4px !important; }
        }
      `}</style>

      <div style={{
        minHeight: '100dvh', position: 'relative',
        background: '#F5F7FE',
        backgroundImage: [
          'radial-gradient(1100px 560px at 10% -5%, rgba(109,94,246,0.11), transparent 60%)',
          'radial-gradient(900px 480px at 100% 0%, rgba(255,92,154,0.09), transparent 55%)',
          'radial-gradient(800px 460px at 50% 110%, rgba(22,199,154,0.07), transparent 60%)',
        ].join(', '),
        color: 'var(--ink)',
      }}>

        {/* ── FLOATING PILL NAV ── */}
        <header style={{ position: 'sticky', top: 0, zIndex: 100, padding: '1rem 1.5rem 0' }}>
          <nav style={{
            maxWidth: 1100, margin: '0 auto',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'rgba(255,255,255,0.86)',
            backdropFilter: 'blur(22px) saturate(180%)',
            border: '1px solid rgba(228,232,246,0.9)',
            borderRadius: 999,
            padding: '0.55rem 0.55rem 0.55rem 1.4rem',
            boxShadow: '0 2px 24px rgba(34,26,91,0.07)',
          }}>
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                width: 26, height: 26, borderRadius: 7,
                background: 'linear-gradient(135deg, var(--iris), var(--grape))',
                display: 'grid', placeItems: 'center',
                boxShadow: 'var(--shadow-iris)',
              }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: '#fff', transform: 'rotate(45deg)' }} />
              </span>
              <span className="font-display" style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--ink)' }}>
                IELTS<span className="aurora-text"> Quest</span>
              </span>
            </Link>

            <Link to="/dashboard" style={{
              textDecoration: 'none',
              background: 'linear-gradient(100deg, var(--iris), var(--grape))',
              color: '#fff', borderRadius: 999, fontWeight: 700, fontSize: '0.85rem',
              padding: '0.58rem 1rem 0.58rem 1.2rem',
              boxShadow: 'var(--shadow-iris)',
              display: 'flex', alignItems: 'center', gap: 7,
              transition: 'transform 0.2s cubic-bezier(0.32,0.72,0,1), box-shadow 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 14px 36px -10px rgba(109,94,246,0.6)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'var(--shadow-iris)'; }}
            >
              Start your quest
              <BtnTrail />
            </Link>
          </nav>
        </header>

        {/* ── HERO: asymmetric split ── */}
        <section className="lnd-hero" style={{
          maxWidth: 1100, margin: '0 auto',
          padding: '5rem 1.5rem 3rem',
          display: 'grid', gridTemplateColumns: '1.1fr 0.9fr',
          gap: '4rem', alignItems: 'center',
          minHeight: 'calc(100dvh - 80px)',
        }}>
          {/* Left: content */}
          <div>
            <motion.div {...fadeUp(0)}>
              <div className="eyebrow" style={{ marginBottom: 22 }}>IELTS preparation, reimagined</div>
            </motion.div>

            <motion.h1 {...fadeUp(0.08)} className="font-display" style={{
              fontSize: 'clamp(3rem, 5.5vw, 5rem)',
              fontWeight: 900, color: 'var(--ink)',
              margin: '0 0 1.5rem', lineHeight: 1.0,
              letterSpacing: '-0.035em',
            }}>
              Study. Collect.<br />
              <span className="aurora-text">Conquer.</span>
            </motion.h1>

            <motion.p {...fadeUp(0.15)} style={{
              color: 'var(--slate)', fontSize: '1.1rem', lineHeight: 1.75,
              maxWidth: 440, margin: '0 0 2.5rem',
            }}>
              Turn IELTS practice into an adventure. Answer questions, open chests and evolve your deck all the way to Band 9.
            </motion.p>

            <motion.div {...fadeUp(0.22)} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <Link to="/dashboard" style={{
                textDecoration: 'none',
                background: 'linear-gradient(100deg, var(--iris), var(--grape))',
                color: '#fff', borderRadius: 999, fontWeight: 700, fontSize: '1rem',
                padding: '0.88rem 1.2rem 0.88rem 1.8rem',
                boxShadow: 'var(--shadow-iris)',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                transition: 'transform 0.2s cubic-bezier(0.32,0.72,0,1), box-shadow 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 18px 44px -12px rgba(109,94,246,0.6)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'var(--shadow-iris)'; }}
              >
                Start your quest
                <BtnTrail />
              </Link>

              <Link to="/collection" style={{
                textDecoration: 'none', color: 'var(--ink)',
                background: 'var(--cloud)', border: '1px solid var(--border)',
                borderRadius: 999, fontWeight: 600, fontSize: '1rem',
                padding: '0.88rem 1.6rem',
                transition: 'border-color 0.18s, transform 0.18s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--iris)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.transform = ''; }}
              >
                Browse cards
              </Link>
            </motion.div>
          </div>

          {/* Right: card fan */}
          <motion.div className="lnd-hero-cards"
            initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ ...spring, delay: 0.25 }}
            style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', height: 380 }}>
            {/* glow beneath cards */}
            <div aria-hidden style={{
              position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)',
              width: 300, height: 60,
              background: 'radial-gradient(ellipse, rgba(109,94,246,0.38), transparent 70%)',
              filter: 'blur(20px)',
            }} />
            {fanCards.map((card, i) => {
              const rots = [-16, -8, 0, 8, 16];
              const ys   = [28,  10,  0, 10, 28];
              const xs   = [-95, -47, 0, 47, 95];
              return (
                <motion.div key={card.id}
                  style={{ position: 'absolute', x: xs[i], y: ys[i], rotate: rots[i], zIndex: i === 2 ? 5 : 5 - Math.abs(i - 2) }}
                  whileHover={{ y: ys[i] - 26, rotate: 0, zIndex: 10, scale: 1.09, transition: spring }}>
                  <Card card={card} size="sm" owned={true} showStats={false} />
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* ── BENTO FEATURES: asymmetric 2-col grid ── */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem 1rem' }}>
          <div className="lnd-bento" style={{
            display: 'grid',
            gridTemplateColumns: '1.55fr 1fr',
            gridTemplateRows: 'auto auto',
            gap: 14,
          }}>

            {/* Large hero cell: Learn IELTS */}
            <motion.div
              initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }} transition={spring}
              className="panel" style={{
                gridRow: 'span 2', padding: '2.5rem',
                position: 'relative', overflow: 'hidden',
                background: 'linear-gradient(150deg, #fff 55%, rgba(109,94,246,0.055) 100%)',
              }}>
              <div aria-hidden style={{
                position: 'absolute', right: -50, top: -50,
                width: 240, height: 240, borderRadius: '50%',
                background: 'radial-gradient(closest-side, rgba(109,94,246,0.11), transparent)',
                pointerEvents: 'none',
              }} />
              <div style={{
                width: 54, height: 54, borderRadius: 15,
                background: 'rgba(109,94,246,0.1)',
                color: 'var(--iris)', display: 'grid', placeItems: 'center',
                marginBottom: 22, border: '1px solid rgba(109,94,246,0.18)',
              }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z" />
                  <path d="M20 18v3H6.5A2.5 2.5 0 0 1 4 18.5" />
                </svg>
              </div>
              <h3 className="font-display" style={{ fontWeight: 800, fontSize: '1.7rem', color: 'var(--ink)', margin: '0 0 12px', letterSpacing: '-0.03em' }}>
                Learn IELTS
              </h3>
              <p style={{ color: 'var(--slate)', fontSize: '0.98rem', lineHeight: 1.72, margin: '0 0 1.75rem', maxWidth: 310 }}>
                Exam-style questions across all four modules, designed to raise your band score through deliberate practice.
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['Reading', 'Listening', 'Vocabulary', 'Grammar'].map(m => (
                  <span key={m} className="chip" style={{ fontSize: '0.77rem' }}>{m}</span>
                ))}
              </div>
            </motion.div>

            {/* Collect cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }} transition={{ ...spring, delay: 0.08 }}
              className="panel" style={{
                padding: '1.75rem', position: 'relative', overflow: 'hidden',
                background: 'linear-gradient(150deg, #fff 60%, rgba(255,92,154,0.055) 100%)',
              }}>
              <div aria-hidden style={{ position: 'absolute', right: -22, bottom: -22, width: 130, height: 130, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(255,92,154,0.15), transparent)', pointerEvents: 'none' }} />
              <div style={{ width: 48, height: 48, borderRadius: 13, background: 'rgba(255,92,154,0.1)', color: 'var(--blossom)', display: 'grid', placeItems: 'center', marginBottom: 16, border: '1px solid rgba(255,92,154,0.18)' }}>
                <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="13" height="16" rx="2" /><path d="M8 3h11a2 2 0 0 1 2 2v12" />
                </svg>
              </div>
              <h3 className="font-display" style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--ink)', margin: '0 0 9px', letterSpacing: '-0.022em' }}>
                Collect cards
              </h3>
              <p style={{ color: 'var(--slate)', fontSize: '0.91rem', lineHeight: 1.68, margin: 0 }}>
                Thirty original creatures across five rarities, from common sprites to legendary sovereigns.
              </p>
            </motion.div>

            {/* Evolve */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }} transition={{ ...spring, delay: 0.17 }}
              className="panel" style={{
                padding: '1.75rem', position: 'relative', overflow: 'hidden',
                background: 'linear-gradient(150deg, #fff 60%, rgba(22,199,154,0.06) 100%)',
              }}>
              <div aria-hidden style={{ position: 'absolute', right: -22, bottom: -22, width: 130, height: 130, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(22,199,154,0.18), transparent)', pointerEvents: 'none' }} />
              <div style={{ width: 48, height: 48, borderRadius: 13, background: 'rgba(22,199,154,0.1)', color: 'var(--mint)', display: 'grid', placeItems: 'center', marginBottom: 16, border: '1px solid rgba(22,199,154,0.18)' }}>
                <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v4M12 17v4M5 12H1M23 12h-4" /><circle cx="12" cy="12" r="4" />
                  <path d="m6 6 2 2M16 16l2 2M18 6l-2 2M8 16l-2 2" />
                </svg>
              </div>
              <h3 className="font-display" style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--ink)', margin: '0 0 9px', letterSpacing: '-0.022em' }}>
                Evolve and grow
              </h3>
              <p style={{ color: 'var(--slate)', fontSize: '0.91rem', lineHeight: 1.68, margin: 0 }}>
                Merge duplicates and spend dust to evolve creatures into far stronger forms.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── ARENA: dark split section ── */}
        <section style={{ maxWidth: 1100, margin: '1rem auto', padding: '0 1.5rem 1.5rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }} transition={spring}
            className="lnd-arena" style={{
              borderRadius: 28, overflow: 'hidden',
              background: 'linear-gradient(135deg, #18124b 0%, #2c147a 55%, #19093e 100%)',
              display: 'grid', gridTemplateColumns: '1fr auto',
              gap: '3rem', alignItems: 'center',
              padding: '3rem',
              position: 'relative',
            }}>

            {/* atmospheric glow */}
            <div aria-hidden style={{
              position: 'absolute', right: 160, top: '50%', transform: 'translateY(-50%)',
              width: 340, height: 340, borderRadius: '50%',
              background: 'radial-gradient(closest-side, rgba(255,92,154,0.22), transparent)',
              pointerEvents: 'none', filter: 'blur(4px)',
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 className="font-display" style={{
                fontWeight: 900,
                fontSize: 'clamp(2rem, 3.5vw, 3.2rem)',
                color: '#fff', margin: '0 0 16px',
                letterSpacing: '-0.035em', lineHeight: 1.0,
              }}>
                Enter the<br />
                <span style={{
                  background: 'linear-gradient(100deg, var(--blossom), var(--grape))',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>Arena</span>
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', margin: '0 0 2rem', maxWidth: 380, lineHeight: 1.68 }}>
                Take your collected heroes into a fast top-down roguelite. Explore biomes, clear rooms and chase a high score.
              </p>
              <Link to="/game" style={{
                textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'linear-gradient(100deg, var(--blossom), var(--grape))',
                color: '#fff', borderRadius: 999,
                padding: '0.85rem 1.1rem 0.85rem 1.8rem',
                fontWeight: 700, fontSize: '0.95rem',
                boxShadow: '0 10px 32px -8px rgba(255,92,154,0.55)',
                transition: 'transform 0.2s cubic-bezier(0.32,0.72,0,1), box-shadow 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 16px 42px -8px rgba(255,92,154,0.65)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 10px 32px -8px rgba(255,92,154,0.55)'; }}
              >
                Play the Arena
                <BtnTrail />
              </Link>
            </div>

            {/* Feature badges */}
            <div className="lnd-arena-badges" style={{ display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 1 }}>
              {[
                {
                  label: 'Dungeons',
                  icon: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.82)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
                },
                {
                  label: 'Biomes',
                  icon: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.82)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>,
                },
                {
                  label: 'Boss fights',
                  icon: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.82)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
                },
              ].map(({ label, icon }) => (
                <div key={label} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '0.65rem 1.1rem', borderRadius: 12,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.11)',
                  minWidth: 140,
                }}>
                  {icon}
                  <span style={{ color: 'rgba(255,255,255,0.82)', fontSize: '0.85rem', fontWeight: 600 }}>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── CARD SHOWCASE ── */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem 5rem', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={spring}>
            <h2 className="font-display" style={{ fontWeight: 800, fontSize: '1.8rem', color: 'var(--ink)', margin: '0 0 8px', letterSpacing: '-0.03em' }}>
              Thirty creatures to discover
            </h2>
            <p style={{ color: 'var(--slate)', margin: '0 0 2.5rem', fontSize: '0.97rem' }}>
              Five rarities, each with its own glow. Hover to take a closer look.
            </p>
          </motion.div>

          <div className="lnd-fan" style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            {fanCards.map((card, i) => {
              const rots = [-11, -5, 0, 5, 11];
              const ys   = [18,   7,  0, 7, 18];
              return (
                <motion.div key={card.id}
                  initial={{ opacity: 0, y: 36 }}
                  whileInView={{ opacity: 1, y: ys[i] }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ ...spring, delay: i * 0.07 }}
                  whileHover={{ y: ys[i] - 22, rotate: 0, zIndex: 10, scale: 1.08, transition: spring }}
                  style={{ rotate: rots[i], zIndex: 5 - Math.abs(i - 2), position: 'relative' }}>
                  <Card card={card} size="sm" owned={true} showStats={false} />
                </motion.div>
              );
            })}
          </div>
        </section>

        <footer style={{
          borderTop: '1px solid var(--border)', padding: '1.5rem 2rem',
          textAlign: 'center', color: 'var(--slate)', fontSize: '0.82rem',
        }}>
          IELTS Quest - learn English, collect glory.
        </footer>

      </div>
    </>
  );
}
