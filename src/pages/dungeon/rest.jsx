import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RunStats } from '../../components/dungeon/RunStats';
import { useDungeonRun } from '../../hooks/useDungeonRun';
import { GRAMMAR_QUESTIONS } from '../../data/grammarQuestions';
import { VOCABULARY_WORDS } from '../../data/vocabularyWords';
import { Icon } from '../../components/Icon';

function QuickQuestion({ question, onAnswer }) {
  const [selected, setSelected] = useState(null);

  const handlePick = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    setTimeout(() => onAnswer(idx === question.correct), 900);
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <p style={{ color: '#E6EDF3', fontWeight: 600, marginBottom: 12, lineHeight: 1.6, fontSize: '0.875rem' }}>
        {question.question}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {question.options.map((opt, idx) => {
          let bg = '#0D1117', border = 'rgba(255,255,255,0.08)', color = '#E6EDF3';
          if (selected !== null) {
            if (idx === question.correct) { bg = 'rgba(63,185,80,0.15)'; border = '#3FB950'; color = '#3FB950'; }
            else if (idx === selected) { bg = 'rgba(248,81,73,0.15)'; border = '#F85149'; color = '#F85149'; }
          }
          return (
            <button key={idx} onClick={() => handlePick(idx)} disabled={selected !== null}
              style={{
                background: bg, border: `1px solid ${border}`,
                borderRadius: 8, padding: '0.55rem 0.875rem',
                color, fontSize: '0.82rem', textAlign: 'left', cursor: selected === null ? 'pointer' : 'default',
              }}
            >
              <span style={{ fontWeight: 700, marginRight: 8 }}>{String.fromCharCode(65 + idx)}.</span>{opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function getRandomQuestion() {
  const useGrammar = Math.random() < 0.5;
  if (useGrammar) {
    return GRAMMAR_QUESTIONS[Math.floor(Math.random() * GRAMMAR_QUESTIONS.length)];
  }
  const w = VOCABULARY_WORDS[Math.floor(Math.random() * VOCABULARY_WORDS.length)];
  return {
    id: w.id,
    question: `What is the best definition of "${w.word}"?`,
    options: w.options,
    correct: w.correct,
    explanation: `"${w.word}": ${w.definition}`,
  };
}

export default function RestPage() {
  const navigate = useNavigate();
  const { run, completeNode, updateHP, setRun } = useDungeonRun();
  const [choice, setChoice] = useState(null); // null | 'rest' | 'study'
  const [studyPhase, setStudyPhase] = useState(0); // 0,1,2 = question index
  const [studyResults, setStudyResults] = useState([]);
  const [questions] = useState(() => [getRandomQuestion(), getRandomQuestion(), getRandomQuestion()]);
  const [done, setDone] = useState(false);
  const [healAmount, setHealAmount] = useState(0);

  if (!run?.active) { navigate('/dungeon'); return null; }

  const handleRest = () => {
    setChoice('rest');
    const heal = Math.round(run.playerMaxHP * 0.3);
    updateHP(Math.min(run.playerMaxHP, run.playerHP + heal));
    setHealAmount(heal);
    setDone(true);
  };

  const handleStudyAnswer = (correct) => {
    const newResults = [...studyResults, correct];
    setStudyResults(newResults);

    if (correct) {
      const bonus = Math.round(run.playerMaxHP * 0.05);
      setRun(prev => prev ? { ...prev, playerMaxHP: prev.playerMaxHP + bonus, playerHP: Math.min(prev.playerHP + bonus, prev.playerMaxHP + bonus) } : prev);
    }

    if (studyPhase + 1 >= questions.length) {
      setDone(true);
    } else {
      setStudyPhase(p => p + 1);
    }
  };

  const handleContinue = () => {
    completeNode(run.currentNodeId);
    navigate('/dungeon/map');
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', background: '#0D1117' }}>
      <RunStats run={run} />
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              marginBottom: 12, color: '#F59E0B', display: 'flex', justifyContent: 'center',
              filter: 'drop-shadow(0 0 30px rgba(245,158,11,0.5))',
            }}
          >
            <Icon name="fire" size={72} />
          </motion.div>
          <h2 style={{ fontFamily: 'Cinzel', fontWeight: 700, fontSize: '1.5rem', color: '#E6EDF3', margin: '0 0 6px' }}>
            Rest Site
          </h2>
          <p style={{ color: '#8B949E', fontSize: '0.875rem', fontStyle: 'italic' }}>
            "You find a moment of peace in the dungeon's depths."
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!choice && (
            <motion.div key="choices" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {/* Rest option */}
                <motion.div
                  whileHover={{ y: -4 }}
                  onClick={handleRest}
                  style={{
                    background: '#161B22',
                    border: '1px solid rgba(63,185,80,0.3)',
                    borderRadius: 14, padding: '1.5rem',
                    textAlign: 'center', cursor: 'pointer',
                  }}
                >
                  <div style={{ marginBottom: 8, color: '#3FB950', display: 'flex', justifyContent: 'center' }}><Icon name="hp" size={36} /></div>
                  <h3 style={{ fontFamily: 'Cinzel', color: '#3FB950', margin: '0 0 6px', fontSize: '0.95rem' }}>Rest</h3>
                  <p style={{ color: '#8B949E', fontSize: '0.75rem', lineHeight: 1.5, margin: 0 }}>
                    Heal <strong style={{ color: '#3FB950' }}>30%</strong> of your max HP
                    <br />
                    <span style={{ color: '#3FB950' }}>+{Math.round(run.playerMaxHP * 0.3)} HP</span>
                  </p>
                </motion.div>

                {/* Study option */}
                <motion.div
                  whileHover={{ y: -4 }}
                  onClick={() => setChoice('study')}
                  style={{
                    background: '#161B22',
                    border: '1px solid rgba(124,58,237,0.3)',
                    borderRadius: 14, padding: '1.5rem',
                    textAlign: 'center', cursor: 'pointer',
                  }}
                >
                  <div style={{ marginBottom: 8, color: '#A78BFA', display: 'flex', justifyContent: 'center' }}><Icon name="book" size={36} /></div>
                  <h3 style={{ fontFamily: 'Cinzel', color: '#A78BFA', margin: '0 0 6px', fontSize: '0.95rem' }}>Study</h3>
                  <p style={{ color: '#8B949E', fontSize: '0.75rem', lineHeight: 1.5, margin: 0 }}>
                    Answer 3 IELTS questions
                    <br />
                    <span style={{ color: '#A78BFA' }}>+5% Max HP per correct</span>
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}

          {choice === 'rest' && done && (
            <motion.div key="rest-done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{
                background: 'rgba(63,185,80,0.1)', border: '1px solid rgba(63,185,80,0.3)',
                borderRadius: 12, padding: '1.5rem', textAlign: 'center', marginBottom: 20,
              }}>
                <div style={{ marginBottom: 8, color: '#3FB950', display: 'flex', justifyContent: 'center' }}><Icon name="check" size={30} /></div>
                <p style={{ color: '#3FB950', fontWeight: 700, margin: 0, fontSize: '1.1rem' }}>
                  +{healAmount} HP Restored
                </p>
                <p style={{ color: '#8B949E', fontSize: '0.8rem', margin: '6px 0 0' }}>
                  HP: {Math.min(run.playerMaxHP, run.playerHP)}/{run.playerMaxHP}
                </p>
              </div>
              <button onClick={handleContinue} style={{
                width: '100%', background: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
                border: 'none', borderRadius: 10, padding: '0.875rem',
                color: 'white', fontWeight: 700, cursor: 'pointer', fontFamily: 'Cinzel',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              }}>
                Continue Journey <Icon name="right" size={15} />
              </button>
            </motion.div>
          )}

          {choice === 'study' && !done && (
            <motion.div key="study" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ background: '#161B22', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 12, padding: '1.25rem', marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, fontSize: '0.75rem' }}>
                  <span style={{ color: '#A78BFA', fontFamily: 'Cinzel', fontWeight: 600 }}>
                    Question {studyPhase + 1}/3
                  </span>
                  <span style={{ color: '#8B949E' }}>
                    {studyResults.filter(Boolean).length} correct
                  </span>
                </div>
                <QuickQuestion
                  key={studyPhase}
                  question={questions[studyPhase]}
                  onAnswer={handleStudyAnswer}
                />
              </div>
              {/* Progress dots */}
              <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: i < studyResults.length
                      ? (studyResults[i] ? '#3FB950' : '#F85149')
                      : i === studyPhase ? '#7C3AED' : '#2D3748',
                    transition: 'background 0.3s',
                  }} />
                ))}
              </div>
            </motion.div>
          )}

          {choice === 'study' && done && (
            <motion.div key="study-done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{
                background: '#161B22', border: '1px solid rgba(124,58,237,0.25)',
                borderRadius: 12, padding: '1.5rem', textAlign: 'center', marginBottom: 20,
              }}>
                <div style={{ marginBottom: 8, color: '#A78BFA', display: 'flex', justifyContent: 'center' }}><Icon name="book" size={30} /></div>
                <p style={{ color: '#E6EDF3', fontWeight: 700, margin: '0 0 6px', fontSize: '1.1rem' }}>
                  Study Complete!
                </p>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', margin: '12px 0' }}>
                  {studyResults.map((r, i) => (
                    <span key={i} style={{ color: r ? '#3FB950' : '#F85149', display: 'grid', placeItems: 'center' }}><Icon name={r ? 'check' : 'cross'} size={18} /></span>
                  ))}
                </div>
                {studyResults.filter(Boolean).length > 0 && (
                  <p style={{ color: '#A78BFA', fontSize: '0.8rem', margin: 0 }}>
                    +{studyResults.filter(Boolean).length * 5}% Max HP bonus applied!
                  </p>
                )}
              </div>
              <button onClick={handleContinue} style={{
                width: '100%', background: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
                border: 'none', borderRadius: 10, padding: '0.875rem',
                color: 'white', fontWeight: 700, cursor: 'pointer', fontFamily: 'Cinzel',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              }}>
                Continue Journey <Icon name="right" size={15} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
