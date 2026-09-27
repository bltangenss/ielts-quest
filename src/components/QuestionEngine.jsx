import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../hooks/useUser';
import { useToast } from './ToastNotification';
import { Icon } from './Icon';

export function QuestionEngine({
  questions,
  moduleKey,
  onComplete,
  passage,
  transcript,
  timeLimit = 480,
}) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [xpFloats, setXpFloats] = useState([]);
  const { addXP, recordAnswer } = useUser();
  const toast = useToast();
  const timerRef = useRef(null);

  useEffect(() => {
    if (!timeLimit) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleComplete(score, answers);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const question = questions[current];

  const handleAnswer = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);

    const correct = idx === question.correct;
    recordAnswer(correct);

    if (correct) {
      addXP(10);
      setScore(s => s + 1);
      // float XP
      const id = Date.now();
      setXpFloats(prev => [...prev, id]);
      setTimeout(() => setXpFloats(prev => prev.filter(x => x !== id)), 1200);
      if (current === 0) toast('Correct! +10 XP', 'success', 1500);
    }

    setAnswers(prev => [...prev, { question, selected: idx, correct }]);
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      clearInterval(timerRef.current);
      handleComplete(score + (selected === question.correct ? 0 : 0), answers);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const handleComplete = (finalScore, finalAnswers) => {
    const total = questions.length;
    const correct = finalAnswers.filter(a => a.correct).length;
    const isPerfect = correct === total;
    const xpEarned = 30 + (isPerfect ? 50 : 0) + correct * 10;
    addXP(xpEarned);
    onComplete({ correct, total, xpEarned, isPerfect });
  };

  const progressPct = ((current) / questions.length) * 100;
  const timePct = (timeLeft / timeLimit) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div style={{ position: 'relative' }}>
      {/* XP floats */}
      {xpFloats.map(id => (
        <div key={id} className="xp-float" style={{
          position: 'fixed', top: '40%', right: 80,
          color: '#3FB950', fontFamily: 'JetBrains Mono', fontWeight: 700,
          fontSize: '1.2rem', zIndex: 9999, pointerEvents: 'none',
        }}>
          +10 XP
        </div>
      ))}

      {/* Progress bar */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'center' }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.75rem', color: '#6A6F9C' }}>
            Question {current + 1} / {questions.length}
          </span>
          {timeLimit > 0 && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              fontFamily: 'JetBrains Mono', fontSize: '0.75rem',
              color: timeLeft < 60 ? '#F85149' : '#6A6F9C',
            }}>
              <Icon name="clock" size={13} /> {minutes}:{seconds.toString().padStart(2, '0')}
            </span>
          )}
        </div>
        <div style={{ background: '#1F2937', borderRadius: 4, height: 6, overflow: 'hidden' }}>
          <div style={{
            width: `${progressPct}%`, height: '100%',
            background: 'linear-gradient(90deg, #6D5EF6, #A855F7)',
            borderRadius: 4, transition: 'width 0.3s ease',
          }} />
        </div>
        {timeLimit > 0 && (
          <div style={{ background: '#1F2937', borderRadius: 4, height: 3, overflow: 'hidden', marginTop: 3 }}>
            <div style={{
              width: `${timePct}%`, height: '100%',
              background: timeLeft < 60 ? '#F85149' : '#3B82F6',
              transition: 'width 1s linear',
            }} />
          </div>
        )}
      </div>

      {/* Passage/transcript if provided */}
      {passage && (
        <div style={{
          background: '#FFFFFF', border: '1px solid rgba(34,26,91,0.06)',
          borderRadius: 10, padding: '1rem', marginBottom: 20,
          maxHeight: 220, overflowY: 'auto',
        }}>
          <div style={{ fontFamily: 'Bricolage Grotesque', fontSize: '0.75rem', color: '#6D5EF6', marginBottom: 8 }}>
            {passage.title}
          </div>
          <p style={{ color: '#221A5B', fontSize: '0.875rem', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>
            {passage.text}
          </p>
        </div>
      )}

      {transcript && (
        <div style={{
          background: '#FFFFFF', border: '1px solid rgba(34,26,91,0.06)',
          borderRadius: 10, padding: '1rem', marginBottom: 20,
          maxHeight: 220, overflowY: 'auto',
        }}>
          <div style={{ fontFamily: 'Bricolage Grotesque', fontSize: '0.75rem', color: '#3FB950', marginBottom: 8 }}>
            {transcript.title} - Transcript
          </div>
          <p style={{ color: '#221A5B', fontSize: '0.8rem', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>
            {transcript.transcript}
          </p>
        </div>
      )}

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          <div style={{
            background: '#FFFFFF', border: '1px solid rgba(34,26,91,0.06)',
            borderRadius: 12, padding: '1.25rem', marginBottom: 20,
          }}>
            <p style={{
              color: '#221A5B', fontSize: '1rem', fontWeight: 600,
              lineHeight: 1.6, margin: 0,
            }}>
              {question.question}
            </p>
          </div>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {question.options.map((opt, idx) => {
              let bg = '#FFFFFF';
              let border = 'rgba(34,26,91,0.06)';
              let color = '#221A5B';

              if (answered) {
                if (idx === question.correct) { bg = 'rgba(63,185,80,0.15)'; border = '#3FB950'; color = '#3FB950'; }
                else if (idx === selected && idx !== question.correct) { bg = 'rgba(248,81,73,0.15)'; border = '#F85149'; color = '#F85149'; }
              } else if (!answered) {
                // hover handled via CSS
              }

              return (
                <motion.button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={answered}
                  whileHover={!answered ? { x: 4, scale: 1.01 } : {}}
                  whileTap={!answered ? { scale: 0.99 } : {}}
                  style={{
                    background: bg,
                    border: `1px solid ${border}`,
                    borderRadius: 10,
                    padding: '0.875rem 1rem',
                    color,
                    fontSize: '0.9rem',
                    textAlign: 'left',
                    cursor: answered ? 'default' : 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', gap: 10,
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  <span style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: answered && idx === question.correct ? '#3FB950'
                      : answered && idx === selected ? '#F85149'
                      : 'rgba(34,26,91,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
                    color: answered && (idx === question.correct || idx === selected) ? 'white' : '#6A6F9C',
                  }}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {opt}
                </motion.button>
              );
            })}
          </div>

          {/* Explanation + Next */}
          {answered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: 16 }}
            >
              <div style={{
                background: selected === question.correct ? 'rgba(63,185,80,0.1)' : 'rgba(248,81,73,0.1)',
                border: `1px solid ${selected === question.correct ? '#3FB950' : '#F85149'}`,
                borderRadius: 8, padding: '0.875rem 1rem', marginBottom: 12,
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontWeight: 700, fontSize: '0.8rem', marginBottom: 4,
                  color: selected === question.correct ? '#3FB950' : '#F85149',
                }}>
                  {selected === question.correct ? <><Icon name="check" size={14} /> Correct!</> : <><Icon name="cross" size={14} /> Incorrect</>}
                </div>
                <p style={{ color: '#221A5B', fontSize: '0.8rem', margin: 0, lineHeight: 1.5 }}>
                  {question.explanation}
                </p>
              </div>

              <button
                onClick={handleNext}
                style={{
                  background: 'linear-gradient(135deg, #6D5EF6, #6D28D9)',
                  border: 'none', borderRadius: 8,
                  padding: '0.75rem 2rem', color: 'white',
                  fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem',
                  width: '100%',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                }}
              >
                {current + 1 >= questions.length ? 'See Results' : <>Next Question <Icon name="right" size={14} /></>}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
