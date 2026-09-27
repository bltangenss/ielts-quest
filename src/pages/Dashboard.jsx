import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BandScoreRing } from '../components/BandScoreRing';
import { Card } from '../components/Card';
import { useUser } from '../hooks/useUser';
import { useCards } from '../hooks/useCards';
import { CARDS, getCardById } from '../data/cards';
import { CHEST_INFO } from '../utils/cardDrop';
import { Icon } from '../components/Icon';

function StatCard({ label, value, icon, color = '#6D5EF6' }) {
  return (
    <div style={{
      background: '#FFFFFF', border: '1px solid var(--border)',
      borderRadius: 16, padding: '1rem',
      display: 'flex', flexDirection: 'column', gap: 6, boxShadow: 'var(--shadow-soft)',
    }}>
      <div style={{ width: 36, height: 36, borderRadius: 11, background: 'var(--mist)', color, display: 'grid', placeItems: 'center' }}>{icon}</div>
      <div className="font-mono" style={{ fontWeight: 700, fontSize: '1.35rem', color }}>
        {value}
      </div>
      <div style={{ color: 'var(--slate)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: 1 }}>
        {label}
      </div>
    </div>
  );
}

// shared drawn icons (no emoji)
const SVG = (p) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{p.d}</svg>;
const ICONS = {
  reading: <SVG d={<><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z"/><path d="M20 18v3H6.5A2.5 2.5 0 0 1 4 18.5"/></>} />,
  listening: <SVG d={<><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="2" y="14" width="5" height="6" rx="1.5"/><rect x="17" y="14" width="5" height="6" rx="1.5"/></>} />,
  vocabulary: <SVG d={<><path d="M4 4h9a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5H4Z"/><path d="M20 4h-4a3 3 0 0 0-3 3v13a2.5 2.5 0 0 1 2.5-2.5H20Z"/></>} />,
  grammar: <SVG d={<><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></>} />,
  questions: <SVG d={<><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 .9-1 1.7"/><path d="M12 17h.01"/></>} />,
  correct: <SVG d={<><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></>} />,
  cards: <SVG d={<><rect x="3" y="5" width="13" height="15" rx="2"/><path d="M8 3h11a2 2 0 0 1 2 2v12"/></>} />,
  dust: <SVG d={<><path d="M12 3v4M12 17v4M3 12h4M17 12h4"/><path d="m6 6 2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/></>} />,
  streak: <SVG d={<><path d="M12 2c1 3-1 4-1 6a3 3 0 0 0 6 0c0-1 0-2-.5-3 2 2 3.5 4.5 3.5 7a8 8 0 1 1-16 0c0-3 2-6 4-8 0 2 1 3 2 3-1-2 1-4 2-5Z"/></>} />,
  chest: <SVG d={<><path d="M3 8.5 12 4l9 4.5V17l-9 4-9-4V8.5Z"/><path d="M3 8.5 12 13l9-4.5M12 13v8"/></>} />,
};

function ModuleCard({ moduleKey, data }) {
  const icons = ICONS;
  const colors = { reading: '#3B82F6', listening: '#10B981', vocabulary: '#F59E0B', grammar: '#EF4444' };
  const acc = data.completed > 0 ? Math.round((data.correct / data.completed) * 100) : 0;
  const accColor = acc >= 80 ? '#3FB950' : acc >= 60 ? '#F59E0B' : '#F85149';

  return (
    <div style={{
      background: '#FFFFFF', border: '1px solid rgba(34,26,91,0.06)',
      borderRadius: 10, padding: '1rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: colors[moduleKey], display: "grid", placeItems: "center" }}>{icons[moduleKey]}</span>
          <span style={{ fontFamily: 'Bricolage Grotesque', fontSize: '0.75rem', fontWeight: 600, color: colors[moduleKey], textTransform: 'capitalize' }}>
            {moduleKey}
          </span>
        </div>
        <span style={{
          background: 'rgba(109,94,246,0.2)',
          border: '1px solid rgba(109,94,246,0.4)',
          borderRadius: 100, padding: '2px 8px',
          fontSize: '0.65rem', color: '#A78BFA', fontFamily: 'JetBrains Mono',
        }}>
          Lv.{data.level}
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.8rem', color: accColor, fontWeight: 700 }}>
          {acc}% accuracy
        </span>
        <span style={{ fontSize: '0.7rem', color: '#6A6F9C' }}>
          {data.correct}/{data.completed} correct
        </span>
      </div>
      <div style={{ background: '#F5F7FE', borderRadius: 4, height: 5, overflow: 'hidden', marginBottom: 10 }}>
        <div style={{
          width: `${acc}%`, height: '100%',
          background: `linear-gradient(90deg, ${accColor}, ${accColor}99)`,
          transition: 'width 1s ease',
        }} />
      </div>
      <Link to={`/learn/${moduleKey}`} style={{
        display: 'block', textAlign: 'center',
        background: 'rgba(109,94,246,0.15)',
        border: '1px solid rgba(109,94,246,0.3)',
        borderRadius: 6, padding: '0.4rem',
        color: '#A78BFA', textDecoration: 'none',
        fontSize: '0.75rem', fontWeight: 600,
      }}>
        Continue
      </Link>
    </div>
  );
}

export default function Dashboard() {
  const { profile, getBandScore, getTotalChests } = useUser();
  const { collection } = useCards();
  const band = getBandScore();
  const xpPct = Math.min(100, (profile.xp / profile.xpToNext) * 100);

  // Recent cards
  const recentCards = collection.cards.slice(-3).reverse().map(c => ({
    instance: c,
    master: getCardById(c.cardId),
  })).filter(x => x.master);

  // Daily goals
  const today = new Date().toDateString();
  const dailyQ = profile.dailyLastReset === today ? profile.dailyQuestionsToday : 0;
  const dailyModule = (profile.dailyLastReset === today ? profile.modulesCompletedToday || [] : []).length > 0;

  const chestTypes = ['bronze', 'silver', 'gold', 'legendary'];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 32 }}
      >
        <h1 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#221A5B', margin: 0 }}>
          Welcome back, {profile.username}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
          {/* Level */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6D5EF6, #5B21B6)',
              border: '2px solid rgba(109,94,246,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '0.875rem', color: 'white',
            }}>
              {profile.level}
            </div>
            <div>
              <div style={{ fontSize: '0.65rem', color: '#6A6F9C', textTransform: 'uppercase' }}>Level</div>
              <div style={{ width: 100 }}>
                <div style={{ background: '#1F2937', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                  <div style={{ width: `${xpPct}%`, height: '100%', background: 'linear-gradient(90deg, #6D5EF6, #A855F7)' }} />
                </div>
                <div style={{ fontSize: '0.6rem', color: '#6A6F9C', marginTop: 1, fontFamily: 'JetBrains Mono' }}>
                  {profile.xp} / {profile.xpToNext} XP
                </div>
              </div>
            </div>
          </div>
          {/* Streak */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: 'var(--sun)' }}>{ICONS.streak}</span>
            <div>
              <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, color: '#F59E0B' }}>{profile.streak}</div>
              <div style={{ fontSize: '0.65rem', color: '#6A6F9C' }}>Day Streak</div>
            </div>
          </div>
          {/* Total chests */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: 'var(--iris)' }}>{ICONS.chest}</span>
            <div>
              <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, color: '#221A5B' }}>{getTotalChests()}</div>
              <div style={{ fontSize: '0.65rem', color: '#6A6F9C' }}>Chests</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 24, alignItems: 'start', flexWrap: 'wrap' }}>
        {/* Band score ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            background: '#FFFFFF', border: '1px solid rgba(109,94,246,0.2)',
            borderRadius: 16, padding: '1.5rem',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
          }}
        >
          <div style={{ fontFamily: 'Bricolage Grotesque', fontSize: '0.75rem', color: '#6A6F9C', letterSpacing: 1, textTransform: 'uppercase' }}>
            Estimated Band
          </div>
          <BandScoreRing score={band} size={180} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: '#6A6F9C' }}>
              {profile.totalQuestionsAnswered} questions answered
            </div>
            <div style={{ fontSize: '0.7rem', color: '#4B5563', marginTop: 2 }}>
              {profile.totalQuestionsAnswered === 0 ? 'Answer questions to calculate score' : `${Math.round((profile.correctAnswers / profile.totalQuestionsAnswered) * 100)}% accuracy`}
            </div>
          </div>
        </motion.div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12 }}>
            <StatCard label="Questions" value={profile.totalQuestionsAnswered} icon={ICONS.questions} color="#3B82F6" />
            <StatCard label="Correct" value={profile.correctAnswers} icon={ICONS.correct} color="#3FB950" />
            <StatCard label="Cards" value={collection.cards.length} icon={ICONS.cards} color="#F59E0B" />
            <StatCard label="Dust" value={collection.dustAmount} icon={ICONS.dust} color="#A78BFA" />
          </div>

          {/* Chests */}
          <div style={{
            background: '#FFFFFF', border: '1px solid rgba(34,26,91,0.06)',
            borderRadius: 12, padding: '1rem',
          }}>
            <div style={{ fontFamily: 'Bricolage Grotesque', fontSize: '0.8rem', color: '#221A5B', marginBottom: 12, fontWeight: 600 }}>
              Available Chests
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {chestTypes.map(type => {
                const info = CHEST_INFO[type];
                const count = profile.chestsAvailable[type] || 0;
                return (
                  <Link key={type} to="/chest"
                    style={{ textDecoration: 'none' }}
                    state={{ chestType: type }}
                  >
                    <motion.div
                      animate={count > 0 ? { y: [0, -4, 0] } : {}}
                      transition={{ duration: 2, repeat: Infinity, delay: Math.random() }}
                      style={{
                        background: count > 0 ? info.bgColor : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${count > 0 ? info.borderColor : 'rgba(34,26,91,0.05)'}`,
                        borderRadius: 10, padding: '0.75rem',
                        textAlign: 'center', minWidth: 80, cursor: count > 0 ? 'pointer' : 'default',
                        opacity: count > 0 ? 1 : 0.4,
                      }}
                    >
                      <div style={{ color: info.color, display: 'flex', justifyContent: 'center' }}><Icon glyph={info.emoji} name={count > 0 ? undefined : 'box'} size={28} /></div>
                      <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '1rem', color: info.color }}>
                        {count}
                      </div>
                      <div style={{ fontSize: '0.6rem', color: '#6A6F9C', textTransform: 'capitalize' }}>
                        {type}
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modules */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{ marginTop: 28 }}
      >
        <h2 style={{ fontFamily: 'Bricolage Grotesque', fontSize: '1rem', fontWeight: 600, color: '#221A5B', marginBottom: 16 }}>
          Learning Modules
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {Object.entries(profile.moduleProgress).map(([key, data]) => (
            <ModuleCard key={key} moduleKey={key} data={data} />
          ))}
        </div>
      </motion.div>

      {/* Bottom grid: Recent cards + Daily goals */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 28 }}>
        {/* Recent cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            background: '#FFFFFF', border: '1px solid rgba(34,26,91,0.06)',
            borderRadius: 12, padding: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'Bricolage Grotesque', fontSize: '0.875rem', fontWeight: 600, color: '#221A5B', margin: 0 }}>
              Recent Cards
            </h3>
            <Link to="/collection" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', color: '#6D5EF6', textDecoration: 'none' }}>
              View All <Icon name="right" size={12} />
            </Link>
          </div>
          {recentCards.length === 0 ? (
            <p style={{ color: '#4B5563', fontSize: '0.8rem', textAlign: 'center', margin: '1rem 0' }}>
              Open chests to collect cards!
            </p>
          ) : (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {recentCards.map(({ instance, master }) => (
                <Card key={instance.instanceId} card={master} evolutionLevel={instance.evolutionLevel} size="sm" owned showStats={false} />
              ))}
            </div>
          )}
        </motion.div>

        {/* Daily goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            background: '#FFFFFF', border: '1px solid rgba(34,26,91,0.06)',
            borderRadius: 12, padding: '1.25rem',
          }}
        >
          <h3 style={{ fontFamily: 'Bricolage Grotesque', fontSize: '0.875rem', fontWeight: 600, color: '#221A5B', margin: '0 0 16px' }}>
            Daily Goals
          </h3>
          {[
            { label: 'Answer 20 questions', current: Math.min(20, dailyQ), max: 20, done: dailyQ >= 20 },
            { label: 'Maintain your streak', current: profile.streak > 0 ? 1 : 0, max: 1, done: profile.streak > 0 },
            { label: 'Open 1 chest', current: 0, max: 1, done: false },
          ].map((goal, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: goal.done ? '#3FB950' : '#221A5B' }}>
                  {goal.done
                    ? <span style={{ color: 'var(--mint)', display: 'grid', placeItems: 'center' }}><Icon name="check" size={13} /></span>
                    : <span style={{ display: 'inline-block', width: 11, height: 11, borderRadius: '50%', border: '1.5px solid var(--slate)' }} />} {goal.label}
                </span>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#6A6F9C' }}>
                  {goal.current}/{goal.max}
                </span>
              </div>
              <div style={{ background: '#F5F7FE', borderRadius: 4, height: 5, overflow: 'hidden' }}>
                <div style={{
                  width: `${(goal.current / goal.max) * 100}%`, height: '100%',
                  background: goal.done ? '#3FB950' : 'linear-gradient(90deg, #6D5EF6, #A855F7)',
                  transition: 'width 0.5s ease',
                }} />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
