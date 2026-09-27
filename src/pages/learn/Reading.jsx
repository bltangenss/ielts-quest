import { useState } from 'react';
import { motion } from 'framer-motion';
import { QuestionEngine } from '../../components/QuestionEngine';
import { ResultsScreen } from '../../components/ResultsScreen';
import { useUser } from '../../hooks/useUser';
import { useToast } from '../../components/ToastNotification';
import { READING_PASSAGES } from '../../data/readingPassages';
import { Icon } from '../../components/Icon';

export default function Reading() {
  const [phase, setPhase] = useState('select'); // select | playing | results
  const [currentPassage, setCurrentPassage] = useState(null);
  const [results, setResults] = useState(null);
  const { addChest, completeModuleLevel, addXP, unlockAchievement, profile } = useUser();
  const toast = useToast();

  const handleStartPassage = (passage) => {
    setCurrentPassage(passage);
    setPhase('playing');
  };

  const handleComplete = ({ correct, total, xpEarned, isPerfect }) => {
    addXP(xpEarned);
    completeModuleLevel('reading', correct, total);
    if (correct / total >= 0.6) {
      addChest('bronze');
      toast('Bronze Chest earned!', 'chest');
    }
    if (isPerfect) unlockAchievement('perfect_run');
    if (profile.totalQuestionsAnswered === 0) unlockAchievement('first_blood');
    setResults({ correct, total, xpEarned, isPerfect });
    setPhase('results');
  };

  const handleContinue = () => {
    setPhase('select');
    setCurrentPassage(null);
    setResults(null);
  };

  if (phase === 'results') {
    return (
      <div style={{ maxWidth: 600, margin: '2rem auto', padding: '0 1.5rem' }}>
        <ResultsScreen {...results} moduleKey="reading" onContinue={handleContinue} />
      </div>
    );
  }

  if (phase === 'playing' && currentPassage) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div>
            <h1 style={{ fontFamily: 'Bricolage Grotesque', fontSize: '1.25rem', fontWeight: 700, color: '#221A5B', margin: 0 }}>
              {currentPassage.title}
            </h1>
            <div style={{ fontSize: '0.75rem', color: '#3B82F6', marginTop: 2 }}>Reading Module</div>
          </div>
        </div>
        <QuestionEngine
          questions={currentPassage.questions}
          moduleKey="reading"
          onComplete={handleComplete}
          passage={currentPassage}
          timeLimit={480}
        />
      </div>
    );
  }

  // Passage select
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <h1 style={{ fontFamily: 'Bricolage Grotesque', fontSize: '1.75rem', fontWeight: 700, color: '#221A5B', margin: 0 }}>
            Reading Module
          </h1>
        </div>
        <p style={{ color: '#6A6F9C', marginBottom: 32, fontSize: '0.875rem' }}>
          Read academic passages and answer comprehension questions. Earn a Bronze Chest for each level completed with 60%+ accuracy.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {READING_PASSAGES.map((passage, i) => (
            <motion.div
              key={passage.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              style={{
                background: '#FFFFFF',
                border: '1px solid rgba(59,130,246,0.2)',
                borderRadius: 12,
                padding: '1.25rem',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                cursor: 'pointer', flexWrap: 'wrap', gap: 12,
              }}
              whileHover={{ borderColor: 'rgba(59,130,246,0.5)', x: 4 }}
              onClick={() => handleStartPassage(passage)}
            >
              <div>
                <h3 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, color: '#221A5B', margin: '0 0 4px' }}>
                  {passage.title}
                </h3>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{
                    background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)',
                    borderRadius: 100, padding: '1px 8px', fontSize: '0.65rem', color: '#3B82F6',
                    textTransform: 'capitalize',
                  }}>
                    {passage.topic}
                  </span>
                  <span style={{
                    background: passage.difficulty === 1 ? 'rgba(63,185,80,0.15)' : passage.difficulty === 2 ? 'rgba(245,158,11,0.15)' : 'rgba(248,81,73,0.15)',
                    border: `1px solid ${passage.difficulty === 1 ? 'rgba(63,185,80,0.3)' : passage.difficulty === 2 ? 'rgba(245,158,11,0.3)' : 'rgba(248,81,73,0.3)'}`,
                    borderRadius: 100, padding: '1px 8px', fontSize: '0.65rem',
                    color: passage.difficulty === 1 ? '#3FB950' : passage.difficulty === 2 ? '#F59E0B' : '#F85149',
                  }}>
                    {passage.difficulty === 1 ? 'Easy' : passage.difficulty === 2 ? 'Medium' : 'Hard'}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.75rem', color: '#6A6F9C' }}>
                    {passage.questions.length} questions
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#6A6F9C' }}>8 min</div>
                </div>
                <button style={{
                  background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                  border: 'none', borderRadius: 8, padding: '0.5rem 1rem',
                  color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}>
                  Start <Icon name="right" size={13} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
