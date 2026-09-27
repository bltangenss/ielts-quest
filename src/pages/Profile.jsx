import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useUser } from '../hooks/useUser';
import { useCards } from '../hooks/useCards';
import { BandScoreRing } from '../components/BandScoreRing';
import { Icon } from '../components/Icon';

const ACHIEVEMENTS = [
  { id: 'first_blood', name: 'First Blood', icon: '', desc: 'Answer your first question' },
  { id: 'chest_hunter', name: 'Chest Hunter', icon: '', desc: 'Open 10 chests' },
  { id: 'collector', name: 'Collector', icon: '', desc: 'Collect 10 different cards' },
  { id: 'completionist', name: 'Completionist', icon: '', desc: 'Collect all 30 cards' },
  { id: 'on_fire', name: 'On Fire', icon: '', desc: 'Reach a 7-day streak' },
  { id: 'evolution', name: 'Evolution', icon: '', desc: 'Evolve your first card' },
  { id: 'legendary_pull', name: 'Legendary Pull', icon: '', desc: 'Obtain a Legendary card' },
  { id: 'band6', name: 'Band 6 Scholar', icon: '', desc: 'Reach estimated band 6.0' },
  { id: 'band7', name: 'Band 7 Expert', icon: '', desc: 'Reach estimated band 7.0' },
  { id: 'perfect_run', name: 'Perfect Run', icon: '', desc: 'Complete a level with 100% accuracy' },
];

export default function Profile() {
  const { profile, getBandScore } = useUser();
  const { collection, uniqueCardsOwned } = useCards();
  const band = getBandScore();
  const acc = profile.totalQuestionsAnswered > 0
    ? Math.round((profile.correctAnswers / profile.totalQuestionsAnswered) * 100)
    : 0;

  const chartData = profile.bandScoreHistory.length > 0
    ? profile.bandScoreHistory
    : [{ date: 'Start', score: 4.0 }];

  const stats = [
    { label: 'Total XP', value: profile.xp + (profile.level - 1) * 100, icon: '', color: '#F59E0B' },
    { label: 'Cards Collected', value: uniqueCardsOwned, icon: '', color: '#6D5EF6' },
    { label: 'Questions Answered', value: profile.totalQuestionsAnswered, icon: '', color: '#3B82F6' },
    { label: 'Current Streak', value: `${profile.streak} days`, icon: '', color: '#F97316' },
    { label: 'Accuracy', value: `${acc}%`, icon: '', color: '#3FB950' },
    { label: 'Dust', value: collection.dustAmount, icon: '', color: '#A78BFA' },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: '#FFFFFF',
          border: '1px solid rgba(109,94,246,0.2)',
          borderRadius: 16, padding: '2rem',
          display: 'flex', gap: 24, alignItems: 'center',
          marginBottom: 28, flexWrap: 'wrap',
        }}
      >
        {/* Avatar */}
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'linear-gradient(135deg, #6D5EF6, #5B21B6)',
          border: '3px solid rgba(109,94,246,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Bricolage Grotesque', fontWeight: 900, fontSize: '1.5rem', color: 'white',
          flexShrink: 0,
        }}>
          {profile.level}
        </div>

        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: 'Bricolage Grotesque', fontSize: '1.5rem', fontWeight: 700, color: '#221A5B', margin: '0 0 4px' }}>
            {profile.username}
          </h1>
          <div style={{ color: '#6A6F9C', fontSize: '0.875rem', marginBottom: 8 }}>
            Level {profile.level} Scholar
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 100, padding: '2px 10px', fontSize: '0.7rem', color: '#F59E0B' }}>
               {profile.streak} day streak
            </span>
            <span style={{ background: 'rgba(109,94,246,0.15)', border: '1px solid rgba(109,94,246,0.3)', borderRadius: 100, padding: '2px 10px', fontSize: '0.7rem', color: '#A78BFA' }}>
              {profile.xp} / {profile.xpToNext} XP
            </span>
          </div>
        </div>

        <BandScoreRing score={band} size={150} />
      </motion.div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 28 }}>
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{
              background: '#FFFFFF', border: '1px solid rgba(34,26,91,0.06)',
              borderRadius: 10, padding: '1rem', textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '1.1rem', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.65rem', color: '#6A6F9C', textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Band score chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          background: '#FFFFFF', border: '1px solid rgba(34,26,91,0.06)',
          borderRadius: 14, padding: '1.5rem', marginBottom: 28,
        }}
      >
        <h2 style={{ fontFamily: 'Bricolage Grotesque', fontSize: '0.875rem', fontWeight: 700, color: '#221A5B', margin: '0 0 20px', textTransform: 'uppercase', letterSpacing: 1 }}>
          Band Score History
        </h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,26,91,0.04)" />
            <XAxis dataKey="date" tick={{ fill: '#6A6F9C', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[4, 9]} tick={{ fill: '#6A6F9C', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#FFFFFF', border: '1px solid rgba(109,94,246,0.3)', borderRadius: 8 }}
              labelStyle={{ color: '#6A6F9C', fontSize: 11 }}
              itemStyle={{ color: '#6D5EF6', fontFamily: 'JetBrains Mono' }}
            />
            <Line
              type="monotone" dataKey="score"
              stroke="#6D5EF6" strokeWidth={2}
              dot={{ fill: '#6D5EF6', r: 4 }}
              activeDot={{ r: 6, fill: '#A78BFA' }}
            />
          </LineChart>
        </ResponsiveContainer>
        {profile.bandScoreHistory.length === 0 && (
          <div style={{ textAlign: 'center', color: '#4B5563', marginTop: -80, fontSize: '0.8rem' }}>
            Answer questions to track your band score progress
          </div>
        )}
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 style={{ fontFamily: 'Bricolage Grotesque', fontSize: '0.875rem', fontWeight: 700, color: '#221A5B', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: 1 }}>
          Achievements ({profile.achievements.length}/{ACHIEVEMENTS.length})
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
          {ACHIEVEMENTS.map((ach, i) => {
            const unlocked = profile.achievements.includes(ach.id);
            return (
              <motion.div
                key={ach.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.03 }}
                style={{
                  background: unlocked ? 'rgba(109,94,246,0.1)' : '#FFFFFF',
                  border: `1px solid ${unlocked ? 'rgba(109,94,246,0.4)' : 'rgba(34,26,91,0.05)'}`,
                  borderRadius: 10, padding: '1rem',
                  filter: unlocked ? 'none' : 'grayscale(100%) opacity(0.4)',
                  transition: 'all 0.3s',
                }}
              >
                <div style={{ marginBottom: 6, display: 'flex', justifyContent: 'center', color: unlocked ? '#F59E0B' : '#4B5563' }}>
                  <Icon name={unlocked ? 'trophy' : 'lock'} size={26} />
                </div>
                <div style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: '0.75rem', color: unlocked ? '#221A5B' : '#4B5563', marginBottom: 4 }}>
                  {ach.name}
                </div>
                <div style={{ fontSize: '0.65rem', color: '#6A6F9C', lineHeight: 1.4 }}>
                  {ach.desc}
                </div>
                {unlocked && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 6, fontSize: '0.6rem', color: '#3FB950' }}><Icon name="check" size={11} /> Unlocked</div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
