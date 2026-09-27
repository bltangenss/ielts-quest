import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '../../hooks/useUser';
import { Icon } from '../../components/Icon';

const I = (d) => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{d}</svg>;

const MODULES = [
  {
    key: 'reading', name: 'Reading', color: '#3B82F6',
    icon: I(<><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z"/><path d="M20 18v3H6.5A2.5 2.5 0 0 1 4 18.5"/></>),
    desc: 'Academic passages with comprehension questions, True/False/Not Given, and sentence completion.',
    reward: 'Bronze chest per level',
  },
  {
    key: 'listening', name: 'Listening', color: '#10B981',
    icon: I(<><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="2" y="14" width="5" height="6" rx="1.5"/><rect x="17" y="14" width="5" height="6" rx="1.5"/></>),
    desc: 'Transcripts simulating listening exercises with note-taking and MCQ questions.',
    reward: 'Bronze chest per level',
  },
  {
    key: 'vocabulary', name: 'Vocabulary', color: '#F59E0B',
    icon: I(<><path d="M4 4h9a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5H4Z"/><path d="M20 4h-4a3 3 0 0 0-3 3v13a2.5 2.5 0 0 1 2.5-2.5H20Z"/></>),
    desc: 'IELTS Academic Word List with definition matching and contextual fill-in-the-blank.',
    reward: 'Bronze chest per level',
  },
  {
    key: 'grammar', name: 'Grammar', color: '#EF4444',
    icon: I(<><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></>),
    desc: 'All 12 core grammar topics with error identification and correct form selection.',
    reward: 'Bronze chest per level',
  },
];

export default function LearnSelector() {
  const { profile } = useUser();

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontFamily: 'Bricolage Grotesque', fontSize: '1.75rem', fontWeight: 700, color: '#221A5B', marginBottom: 8 }}>
          Learning Modules
        </h1>
        <p style={{ color: '#6A6F9C', marginBottom: 32, fontSize: '0.875rem' }}>
          Study across all four IELTS skills. Complete levels to earn chests and improve your band score.
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 20 }}>
        {MODULES.map((mod, i) => {
          const progress = profile.moduleProgress[mod.key];
          const acc = progress.completed > 0 ? Math.round((progress.correct / progress.completed) * 100) : 0;
          const accColor = acc >= 80 ? '#3FB950' : acc >= 60 ? '#F59E0B' : acc > 0 ? '#F85149' : '#6A6F9C';

          return (
            <motion.div
              key={mod.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: '#FFFFFF',
                border: `1px solid ${mod.color}33`,
                borderRadius: 14,
                overflow: 'hidden',
              }}
            >
              {/* Color bar */}
              <div style={{ height: 4, background: mod.color }} />

              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--mist)', color: mod.color, display: 'grid', placeItems: 'center' }}>{mod.icon}</span>
                    <div>
                      <h2 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, color: '#221A5B', margin: 0, fontSize: '1.1rem' }}>
                        {mod.name}
                      </h2>
                      <span style={{
                        background: `${mod.color}22`, border: `1px solid ${mod.color}44`,
                        borderRadius: 100, padding: '1px 8px',
                        fontSize: '0.65rem', color: mod.color,
                        fontFamily: 'JetBrains Mono',
                      }}>
                        Level {progress.level}
                      </span>
                    </div>
                  </div>

                  {/* Accuracy ring */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '1.25rem', color: accColor }}>
                      {acc}%
                    </div>
                    <div style={{ fontSize: '0.6rem', color: '#6A6F9C' }}>accuracy</div>
                  </div>
                </div>

                <p style={{ color: '#6A6F9C', fontSize: '0.8rem', lineHeight: 1.6, margin: '0 0 16px' }}>
                  {mod.desc}
                </p>

                {/* Progress bar */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.7rem', color: '#6A6F9C' }}>
                    <span>{progress.correct} correct answers</span>
                    <span>{progress.completed} total</span>
                  </div>
                  <div style={{ background: '#F5F7FE', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                    <div style={{
                      width: progress.completed > 0 ? `${(progress.correct / progress.completed) * 100}%` : '0%',
                      height: '100%',
                      background: `linear-gradient(90deg, ${mod.color}, ${mod.color}99)`,
                      transition: 'width 1s ease',
                    }} />
                  </div>
                </div>

                {/* Reward badge */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'rgba(205,127,50,0.1)', border: '1px solid rgba(205,127,50,0.2)',
                  borderRadius: 8, padding: '0.4rem 0.75rem', marginBottom: 16,
                }}>
                  <span style={{ color: '#CD7F32', display: 'grid', placeItems: 'center' }}><Icon name="gift" size={14} /></span>
                  <span style={{ fontSize: '0.7rem', color: '#CD7F32' }}>Reward: {mod.reward}</span>
                </div>

                <Link to={`/learn/${mod.key}`} style={{
                  display: 'block', textAlign: 'center',
                  background: `linear-gradient(135deg, ${mod.color}33, ${mod.color}22)`,
                  border: `1px solid ${mod.color}55`,
                  borderRadius: 8, padding: '0.75rem',
                  color: mod.color, textDecoration: 'none',
                  fontWeight: 700, fontSize: '0.875rem',
                  fontFamily: 'Bricolage Grotesque, sans-serif',
                  transition: 'all 0.2s',
                }}>
                  {progress.completed === 0 ? 'Begin Quest' : 'Continue'}
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
