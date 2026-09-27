import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { QuestionEngine } from '../../components/QuestionEngine';
import { ResultsScreen } from '../../components/ResultsScreen';
import { useUser } from '../../hooks/useUser';
import { useToast } from '../../components/ToastNotification';
import { VOCABULARY_WORDS } from '../../data/vocabularyWords';
import { Icon } from '../../components/Icon';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const SETS = [
  { id: 'set1', name: 'Academic Core I',   desc: 'Foundation vocabulary for IELTS Academic', icon: '', color: '#F59E0B', indices: [0,1,2,3,4,5,6,7,8,9] },
  { id: 'set2', name: 'Academic Core II',  desc: 'Intermediate AWL words and collocations',  icon: '', color: '#F59E0B', indices: [10,11,12,13,14,15,16,17,18,19] },
  { id: 'set3', name: 'Advanced Lexis I',  desc: 'Complex vocabulary for band 7+ writing',   icon: '', color: '#EF4444', indices: [20,21,22,23,24,25,26,27,28,29] },
  { id: 'set4', name: 'Advanced Lexis II', desc: 'Nuanced academic and formal vocabulary',    icon: '', color: '#EF4444', indices: [30,31,32,33,34,35,36,37,38,39] },
  { id: 'set5', name: 'Collocations',      desc: 'Common IELTS collocations and phrases',     icon: '', color: '#6D5EF6', indices: [40,41,42,43,44,45,46,47,48,49] },
  { id: 'set6', name: 'Topic Vocabulary',  desc: 'Environment, technology, health topics',    icon: '', color: '#6D5EF6', indices: [50,51,52,53,54,55,56,57,58,59] },
  { id: 'set7', name: 'Mixed Challenge',   desc: 'Random selection from all vocabulary',      icon: '', color: '#10B981', indices: null }, // null = random
];

export default function Vocabulary() {
  const [phase, setPhase] = useState('select');
  const [currentSet, setCurrentSet] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [results, setResults] = useState(null);
  const { addChest, completeModuleLevel, addXP, unlockAchievement, profile } = useUser();
  const toast = useToast();

  const handleStart = (set) => {
    let words;
    if (set.indices === null) {
      words = shuffle(VOCABULARY_WORDS).slice(0, 10);
    } else {
      words = set.indices.map(i => VOCABULARY_WORDS[i]).filter(Boolean).slice(0, 10);
    }

    const qs = words.map(word => ({
      id: word.id,
      topic: 'vocabulary',
      difficulty: word.difficulty || 1,
      question: word.questionType === 'definition'
        ? `What is the best definition of "${word.word}"?`
        : `Choose the correct word to complete: "${word.example}"`,
      options: word.options,
      correct: word.correct,
      explanation: `"${word.word}" means: ${word.definition}. Example: ${word.example}`,
    }));

    setCurrentSet(set);
    setQuestions(qs);
    setPhase('playing');
  };

  const handleComplete = ({ correct, total, xpEarned, isPerfect }) => {
    addXP(xpEarned);
    completeModuleLevel('vocabulary', correct, total);
    if (correct / total >= 0.6) { addChest('bronze'); toast(' Bronze Chest earned!', 'chest'); }
    if (isPerfect) unlockAchievement('perfect_run');
    if (profile.totalQuestionsAnswered === 0) unlockAchievement('first_blood');
    setResults({ correct, total, xpEarned, isPerfect });
    setPhase('results');
  };

  if (phase === 'results') return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '0 1.5rem' }}>
      <ResultsScreen {...results} moduleKey="vocabulary" onContinue={() => { setPhase('select'); setResults(null); }} />
    </div>
  );

  if (phase === 'playing' && currentSet) return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <span style={{ fontSize: '1.5rem' }}>{currentSet.icon}</span>
        <div>
          <h1 style={{ fontFamily: 'Bricolage Grotesque', fontSize: '1.25rem', fontWeight: 700, color: '#221A5B', margin: 0 }}>
            {currentSet.name}
          </h1>
          <div style={{ fontSize: '0.75rem', color: '#F59E0B', marginTop: 2 }}>Vocabulary Module</div>
        </div>
      </div>
      <QuestionEngine
        questions={questions}
        moduleKey="vocabulary"
        onComplete={handleComplete}
        timeLimit={360}
      />
    </div>
  );

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <h1 style={{ fontFamily: 'Bricolage Grotesque', fontSize: '1.75rem', fontWeight: 700, color: '#221A5B', margin: 0 }}>
            Vocabulary Module
          </h1>
        </div>
        <p style={{ color: '#6A6F9C', marginBottom: 32, fontSize: '0.875rem' }}>
          Master the Academic Word List essential for IELTS success. Choose a vocabulary set to practice.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 14 }}>
          {SETS.map((set, i) => (
            <motion.div
              key={set.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -3 }}
              onClick={() => handleStart(set)}
              style={{
                background: '#FFFFFF',
                border: `1px solid ${set.color}33`,
                borderRadius: 12, padding: '1.25rem',
                cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: 14,
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 10,
                background: `${set.color}22`, border: `1px solid ${set.color}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', flexShrink: 0,
              }}>
                {set.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, color: '#221A5B', margin: '0 0 3px', fontSize: '0.875rem' }}>
                  {set.name}
                </h3>
                <p style={{ color: '#6A6F9C', fontSize: '0.72rem', margin: '0 0 6px', lineHeight: 1.4 }}>
                  {set.desc}
                </p>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={{
                    background: `${set.color}22`, border: `1px solid ${set.color}44`,
                    borderRadius: 100, padding: '1px 8px',
                    fontSize: '0.6rem', color: set.color,
                  }}>
                    10 words
                  </span>
                  <span style={{
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(34,26,91,0.06)',
                    borderRadius: 100, padding: '1px 8px',
                    fontSize: '0.6rem', color: '#6A6F9C',
                  }}>
                    6 min
                  </span>
                </div>
              </div>
              <button style={{
                background: `linear-gradient(135deg, ${set.color}33, ${set.color}22)`,
                border: `1px solid ${set.color}55`,
                borderRadius: 8, padding: '0.4rem 0.75rem',
                color: set.color, fontWeight: 700, cursor: 'pointer', fontSize: '0.75rem',
                whiteSpace: 'nowrap', flexShrink: 0,
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                Start <Icon name="right" size={12} />
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
