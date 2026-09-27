import { useState } from 'react';
import { motion } from 'framer-motion';
import { QuestionEngine } from '../../components/QuestionEngine';
import { ResultsScreen } from '../../components/ResultsScreen';
import { useUser } from '../../hooks/useUser';
import { useToast } from '../../components/ToastNotification';
import { LISTENING_TRANSCRIPTS } from '../../data/listeningTranscripts';
import { Icon } from '../../components/Icon';

export default function Listening() {
  const [phase, setPhase] = useState('select');
  const [currentTranscript, setCurrentTranscript] = useState(null);
  const [results, setResults] = useState(null);
  const { addChest, completeModuleLevel, addXP, unlockAchievement, profile } = useUser();
  const toast = useToast();

  const handleStart = (transcript) => {
    setCurrentTranscript(transcript);
    setPhase('playing');
  };

  const handleComplete = ({ correct, total, xpEarned, isPerfect }) => {
    addXP(xpEarned);
    completeModuleLevel('listening', correct, total);
    if (correct / total >= 0.6) { addChest('bronze'); toast(' Bronze Chest earned!', 'chest'); }
    if (isPerfect) unlockAchievement('perfect_run');
    if (profile.totalQuestionsAnswered === 0) unlockAchievement('first_blood');
    setResults({ correct, total, xpEarned, isPerfect });
    setPhase('results');
  };

  if (phase === 'results') return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '0 1.5rem' }}>
      <ResultsScreen {...results} moduleKey="listening" onContinue={() => { setPhase('select'); setResults(null); }} />
    </div>
  );

  if (phase === 'playing' && currentTranscript) return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Bricolage Grotesque', fontSize: '1.25rem', fontWeight: 700, color: '#221A5B', margin: 0 }}>
            {currentTranscript.title}
          </h1>
          <div style={{ fontSize: '0.75rem', color: '#10B981', marginTop: 2 }}>Listening Module</div>
        </div>
      </div>
      <QuestionEngine
        questions={currentTranscript.questions}
        moduleKey="listening"
        onComplete={handleComplete}
        transcript={currentTranscript}
        timeLimit={480}
      />
    </div>
  );

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <h1 style={{ fontFamily: 'Bricolage Grotesque', fontSize: '1.75rem', fontWeight: 700, color: '#221A5B', margin: 0 }}>Listening Module</h1>
        </div>
        <p style={{ color: '#6A6F9C', marginBottom: 32, fontSize: '0.875rem' }}>
          Read transcripts that simulate IELTS listening material and answer comprehension questions.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {LISTENING_TRANSCRIPTS.map((t, i) => (
            <motion.div key={t.id}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
              style={{ background: '#FFFFFF', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', flexWrap: 'wrap', gap: 12 }}
              whileHover={{ borderColor: 'rgba(16,185,129,0.5)', x: 4 }}
              onClick={() => handleStart(t)}
            >
              <div>
                <h3 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, color: '#221A5B', margin: '0 0 4px' }}>{t.title}</h3>
                <p style={{ color: '#6A6F9C', fontSize: '0.75rem', margin: '0 0 4px' }}>{t.description}</p>
                <span style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 100, padding: '1px 8px', fontSize: '0.65rem', color: '#10B981', textTransform: 'capitalize' }}>{t.topic}</span>
              </div>
              <button style={{ background: 'linear-gradient(135deg, #10B981, #059669)', border: 'none', borderRadius: 8, padding: '0.5rem 1rem', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                Start <Icon name="right" size={13} />
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
