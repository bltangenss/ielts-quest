import { useState } from 'react';
import { motion } from 'framer-motion';
import { QuestionEngine } from '../../components/QuestionEngine';
import { ResultsScreen } from '../../components/ResultsScreen';
import { useUser } from '../../hooks/useUser';
import { useToast } from '../../components/ToastNotification';
import { GRAMMAR_QUESTIONS, GRAMMAR_TOPICS } from '../../data/grammarQuestions';
import { Icon } from '../../components/Icon';

export default function Grammar() {
  const [phase, setPhase] = useState('select');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [results, setResults] = useState(null);
  const { addChest, completeModuleLevel, addXP, unlockAchievement, profile } = useUser();
  const toast = useToast();

  const handleStart = (topicId) => {
    let pool;
    if (topicId === 'mixed') {
      // pick 2 from each topic, shuffle
      const allTopics = GRAMMAR_TOPICS.map(t => t.id);
      pool = allTopics.flatMap(tid => {
        const tqs = GRAMMAR_QUESTIONS.filter(q => q.topic === tid);
        return tqs.slice(0, 2);
      });
      pool = pool.sort(() => Math.random() - 0.5).slice(0, 10);
    } else {
      pool = GRAMMAR_QUESTIONS.filter(q => q.topic === topicId);
    }

    setSelectedTopic(topicId);
    setQuestions(pool);
    setPhase('playing');
  };

  const handleComplete = ({ correct, total, xpEarned, isPerfect }) => {
    addXP(xpEarned);
    completeModuleLevel('grammar', correct, total);
    if (correct / total >= 0.6) { addChest('bronze'); toast(' Bronze Chest earned!', 'chest'); }
    if (isPerfect) unlockAchievement('perfect_run');
    if (profile.totalQuestionsAnswered === 0) unlockAchievement('first_blood');
    setResults({ correct, total, xpEarned, isPerfect });
    setPhase('results');
  };

  if (phase === 'results') return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '0 1.5rem' }}>
      <ResultsScreen {...results} moduleKey="grammar" onContinue={() => { setPhase('select'); setResults(null); }} />
    </div>
  );

  const topicLabel = selectedTopic === 'mixed'
    ? 'Mixed Grammar Challenge'
    : GRAMMAR_TOPICS.find(t => t.id === selectedTopic)?.name || '';

  if (phase === 'playing') return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Bricolage Grotesque', fontSize: '1.25rem', fontWeight: 700, color: '#221A5B', margin: 0 }}>
            {topicLabel}
          </h1>
          <div style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: 2 }}>Grammar Module</div>
        </div>
      </div>
      <QuestionEngine
        questions={questions}
        moduleKey="grammar"
        onComplete={handleComplete}
        timeLimit={300}
      />
    </div>
  );

  // Topic select
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <h1 style={{ fontFamily: 'Bricolage Grotesque', fontSize: '1.75rem', fontWeight: 700, color: '#221A5B', margin: 0 }}>
            Grammar Module
          </h1>
        </div>
        <p style={{ color: '#6A6F9C', marginBottom: 32, fontSize: '0.875rem' }}>
          Master 12 core grammar topics tested in IELTS. Each topic has 5 questions of increasing difficulty.
        </p>

        {/* Mixed challenge card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -3 }}
          onClick={() => handleStart('mixed')}
          style={{
            background: 'linear-gradient(135deg, rgba(109,94,246,0.2), rgba(16,185,129,0.1))',
            border: '1px solid rgba(109,94,246,0.4)',
            borderRadius: 14, padding: '1.25rem',
            cursor: 'pointer', marginBottom: 20,
            display: 'flex', alignItems: 'center', gap: 14,
          }}
        >
          <span style={{ color: '#6D5EF6', display: 'grid', placeItems: 'center' }}><Icon name="sparkle" size={28} /></span>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, color: '#221A5B', margin: '0 0 3px' }}>
              Mixed Grammar Challenge
            </h3>
            <p style={{ color: '#6A6F9C', fontSize: '0.8rem', margin: 0 }}>
              Random questions from all 12 topics — the ultimate grammar test
            </p>
          </div>
          <button style={{
            background: 'linear-gradient(135deg, #6D5EF6, #5B21B6)',
            border: 'none', borderRadius: 8, padding: '0.5rem 1.25rem',
            color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem',
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            Start <Icon name="right" size={13} />
          </button>
        </motion.div>

        {/* Topic grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 }}>
          {GRAMMAR_TOPICS.map((topic, i) => {
            const topicQs = GRAMMAR_QUESTIONS.filter(q => q.topic === topic.id);
            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -2 }}
                onClick={() => handleStart(topic.id)}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: 12, padding: '1rem',
                  cursor: 'pointer', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 8,
                  background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.2rem', flexShrink: 0,
                }}>
                  {topic.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, color: '#221A5B', margin: '0 0 2px', fontSize: '0.8rem' }}>
                    {topic.name}
                  </h3>
                  <div style={{ fontSize: '0.65rem', color: '#6A6F9C' }}>
                    {topicQs.length} questions
                  </div>
                </div>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#EF4444',
                }}>
                  <Icon name="right" size={13} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
