import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RunStats } from '../../components/dungeon/RunStats';
import { useDungeonRun } from '../../hooks/useDungeonRun';
import { getRandomEvent } from '../../data/dungeonEvents';
import { Icon } from '../../components/Icon';

export default function EventPage() {
  const navigate = useNavigate();
  const { run, completeNode, updateHP, updateGold } = useDungeonRun();
  const [event] = useState(() => getRandomEvent());
  const [outcome, setOutcome] = useState(null);
  const [choiceIndex, setChoiceIndex] = useState(null);

  if (!run?.active) { navigate('/dungeon'); return null; }

  const handleChoice = (choice, idx) => {
    setChoiceIndex(idx);
    let resultText = choice.outcome;
    let goldChange = 0;
    let hpChange = 0;

    switch (choice.effect) {
      case 'gold':
        goldChange = choice.value;
        updateGold(run.gold + goldChange);
        break;
      case 'heal':
        hpChange = choice.value;
        updateHP(Math.min(run.playerMaxHP, run.playerHP + hpChange));
        break;
      case 'damage':
        hpChange = -choice.value;
        updateHP(Math.max(1, run.playerHP - choice.value));
        break;
      case 'fountain_risk': {
        const lucky = Math.random() > 0.5;
        if (lucky) {
          hpChange = choice.value;
          updateHP(Math.min(run.playerMaxHP, run.playerHP + choice.value));
          resultText = `The water is refreshing! +${choice.value} HP`;
        } else {
          hpChange = -Math.floor(choice.value * 0.75);
          updateHP(Math.max(1, run.playerHP + hpChange));
          resultText = `The water burns! ${hpChange} HP`;
        }
        break;
      }
      case 'trap_gamble': {
        const lucky = Math.random() > 0.5;
        if (lucky) {
          goldChange = choice.value;
          updateGold(run.gold + goldChange);
          resultText = `No trap! You claim ${goldChange} gold!`;
        } else {
          hpChange = -15;
          updateHP(Math.max(1, run.playerHP - 15));
          resultText = `TRAP! You take 15 damage!`;
        }
        break;
      }
      case 'paid_heal': {
        const cost = choice.effect === 'paid_heal' ? 8 : 10;
        const actualCost = choice.text.includes('10') ? 10 : choice.text.includes('8') ? 8 : choice.text.includes('5') ? 5 : 10;
        if (run.gold >= actualCost) {
          updateGold(run.gold - actualCost);
          updateHP(Math.min(run.playerMaxHP, run.playerHP + choice.value));
          hpChange = choice.value;
          goldChange = -actualCost;
        } else {
          resultText = "Not enough gold!";
        }
        break;
      }
      case 'paid_gold': {
        const dmg = 20;
        updateHP(Math.max(1, run.playerHP - dmg));
        updateGold(run.gold + choice.value);
        hpChange = -dmg;
        goldChange = choice.value;
        break;
      }
      default:
        break;
    }

    setOutcome({
      text: resultText,
      goldChange,
      hpChange,
    });
  };

  const handleContinue = () => {
    completeNode(run.currentNodeId);
    navigate('/dungeon/map');
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', background: '#0D1117' }}>
      <RunStats run={run} />
      <div style={{ maxWidth: 540, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: '#161B22',
            border: '1px solid rgba(167,139,250,0.25)',
            borderRadius: 16, padding: '2rem',
            textAlign: 'center',
          }}
        >
          {/* Event emoji */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ marginBottom: 16, color: '#A78BFA', display: 'flex', justifyContent: 'center' }}
          >
            <Icon glyph={event.emoji} size={56} />
          </motion.div>

          <h2 style={{ fontFamily: 'Cinzel', fontWeight: 700, fontSize: '1.4rem', color: '#E6EDF3', margin: '0 0 12px' }}>
            {event.title}
          </h2>

          <p style={{ color: '#C9D1D9', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 28 }}>
            {event.description}
          </p>

          {/* Choices */}
          <AnimatePresence mode="wait">
            {!outcome ? (
              <motion.div
                key="choices"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
              >
                {event.choices.map((choice, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => handleChoice(choice, idx)}
                    whileHover={{ x: 4, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    style={{
                      background: '#0D1117',
                      border: '1px solid rgba(167,139,250,0.3)',
                      borderRadius: 10, padding: '0.875rem 1rem',
                      color: '#E6EDF3', fontSize: '0.875rem',
                      textAlign: 'left', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 10,
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    <span style={{
                      width: 24, height: 24, borderRadius: '50%',
                      background: 'rgba(124,58,237,0.2)',
                      border: '1px solid rgba(124,58,237,0.4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.7rem', fontWeight: 700, color: '#A78BFA', flexShrink: 0,
                    }}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {choice.text}
                  </motion.button>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="outcome"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div style={{
                  background: '#0D1117',
                  border: `1px solid ${outcome.hpChange > 0 || outcome.goldChange > 0 ? 'rgba(63,185,80,0.3)' : outcome.hpChange < 0 ? 'rgba(248,81,73,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 12, padding: '1.25rem', marginBottom: 20,
                }}>
                  <p style={{ color: '#C9D1D9', margin: '0 0 12px', fontSize: '0.875rem', lineHeight: 1.6 }}>
                    {outcome.text}
                  </p>
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {outcome.hpChange !== 0 && (
                      <span style={{
                        background: outcome.hpChange > 0 ? 'rgba(63,185,80,0.15)' : 'rgba(248,81,73,0.15)',
                        border: `1px solid ${outcome.hpChange > 0 ? '#3FB95044' : '#F8514944'}`,
                        borderRadius: 100, padding: '3px 10px',
                        color: outcome.hpChange > 0 ? '#3FB950' : '#F85149',
                        fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '0.8rem',
                      }}>
                        {outcome.hpChange > 0 ? '+' : ''}{outcome.hpChange} HP
                      </span>
                    )}
                    {outcome.goldChange !== 0 && (
                      <span style={{
                        background: outcome.goldChange > 0 ? 'rgba(245,158,11,0.15)' : 'rgba(248,81,73,0.15)',
                        border: `1px solid ${outcome.goldChange > 0 ? '#F59E0B44' : '#F8514944'}`,
                        borderRadius: 100, padding: '3px 10px',
                        color: outcome.goldChange > 0 ? '#F59E0B' : '#F85149',
                        fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '0.8rem',
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                      }}>
                        {outcome.goldChange > 0 ? '+' : ''}{outcome.goldChange} <Icon name="gold" size={12} />
                      </span>
                    )}
                    {outcome.hpChange === 0 && outcome.goldChange === 0 && (
                      <span style={{ color: '#8B949E', fontSize: '0.8rem' }}>No effect.</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleContinue}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
                    border: 'none', borderRadius: 10, padding: '0.875rem',
                    color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem',
                    fontFamily: 'Cinzel',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  }}
                >
                  Continue Journey <Icon name="right" size={15} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
