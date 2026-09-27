import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DungeonCard } from '../../components/dungeon/DungeonCard';
import { EnemySprite } from '../../components/dungeon/EnemySprite';
import { BattleLog } from '../../components/dungeon/BattleLog';
import { RunStats } from '../../components/dungeon/RunStats';
import { useDungeonRun } from '../../hooks/useDungeonRun';
import { getEnemyById } from '../../data/enemies';
import { GRAMMAR_QUESTIONS } from '../../data/grammarQuestions';
import { VOCABULARY_WORDS } from '../../data/vocabularyWords';
import { Icon } from '../../components/Icon';

// ──────────────────────────────────────
// IELTS Challenge Modal
// ──────────────────────────────────────
function IELTSChallenge({ onComplete, hasHint }) {
  const [question] = useState(() => {
    const pool = Math.random() < 0.5 ? GRAMMAR_QUESTIONS : VOCABULARY_WORDS.map(w => ({
      id: w.id, question: `What is the best definition of "${w.word}"?`,
      options: w.options, correct: w.correct, explanation: `"${w.word}": ${w.definition}`,
    }));
    return pool[Math.floor(Math.random() * pool.length)];
  });
  const [timeLeft, setTimeLeft] = useState(30);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const timerRef = useRef(null);

  // Apply hint: eliminate one wrong option
  const [hiddenOption] = useState(() => {
    if (!hasHint) return null;
    const wrongs = question.options.map((_, i) => i).filter(i => i !== question.correct);
    return wrongs[Math.floor(Math.random() * wrongs.length)];
  });

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setAnswered(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const handleAnswer = (idx) => {
    if (answered) return;
    clearInterval(timerRef.current);
    setSelected(idx);
    setAnswered(true);
  };

  const isCorrect = selected === question.correct;
  const timerPct = (timeLeft / 30) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(4px)',
        zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        style={{
          background: '#161B22',
          border: '1px solid rgba(124,58,237,0.4)',
          borderRadius: 16, padding: '1.75rem',
          maxWidth: 500, width: '100%',
          boxShadow: '0 0 60px rgba(124,58,237,0.3)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'Cinzel', fontWeight: 700, color: '#A78BFA', fontSize: '0.75rem', letterSpacing: 2, textTransform: 'uppercase' }}>
            <Icon name="attack" size={13} /> Pre-Battle IELTS Challenge
          </div>
          <p style={{ color: '#8B949E', fontSize: '0.75rem', margin: '4px 0 0' }}>
            Answer correctly for +1 bonus energy this battle!
          </p>
        </div>

        {/* Timer */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: timeLeft <= 10 ? '#F85149' : '#8B949E', marginBottom: 4 }}>
            <span>Time remaining</span>
            <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700 }}>{timeLeft}s</span>
          </div>
          <div style={{ background: '#1F2937', borderRadius: 4, height: 5 }}>
            <div style={{
              width: `${timerPct}%`, height: '100%',
              background: timeLeft <= 10 ? '#F85149' : '#7C3AED',
              borderRadius: 4, transition: 'width 1s linear',
            }} />
          </div>
        </div>

        {/* Hint badge */}
        {hasHint && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 6, padding: '0.3rem 0.75rem', marginBottom: 12, fontSize: '0.7rem', color: '#F59E0B', textAlign: 'center' }}>
            <Icon name="search" size={13} /> Scholar's Lens: one wrong answer eliminated
          </div>
        )}

        {/* Question */}
        <div style={{ background: '#0D1117', borderRadius: 10, padding: '1rem', marginBottom: 16 }}>
          <p style={{ color: '#E6EDF3', fontSize: '0.9rem', fontWeight: 600, lineHeight: 1.6, margin: 0 }}>
            {question.question}
          </p>
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {question.options.map((opt, idx) => {
            if (hiddenOption === idx && !answered) return null;
            let bg = '#0D1117', border = 'rgba(255,255,255,0.08)', color = '#E6EDF3';
            if (answered) {
              if (idx === question.correct) { bg = 'rgba(63,185,80,0.15)'; border = '#3FB950'; color = '#3FB950'; }
              else if (idx === selected) { bg = 'rgba(248,81,73,0.15)'; border = '#F85149'; color = '#F85149'; }
            }
            return (
              <button key={idx} onClick={() => handleAnswer(idx)} disabled={answered}
                style={{
                  background: bg, border: `1px solid ${border}`,
                  borderRadius: 8, padding: '0.6rem 0.875rem',
                  color, fontSize: '0.85rem', textAlign: 'left',
                  cursor: answered ? 'default' : 'pointer',
                  display: 'flex', gap: 10, alignItems: 'center',
                }}
              >
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, flexShrink: 0 }}>
                  {String.fromCharCode(65 + idx)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {/* Result */}
        {answered && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            {timeLeft === 0 && selected === null ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'rgba(248,81,73,0.1)', border: '1px solid rgba(248,81,73,0.3)', borderRadius: 8, padding: '0.75rem', marginBottom: 12, fontSize: '0.8rem', color: '#F85149', textAlign: 'center' }}>
                <Icon name="clock" size={14} /> Time's up! No bonus energy.
              </div>
            ) : isCorrect ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'rgba(63,185,80,0.1)', border: '1px solid rgba(63,185,80,0.3)', borderRadius: 8, padding: '0.75rem', marginBottom: 12, fontSize: '0.8rem', color: '#3FB950', textAlign: 'center' }}>
                <Icon name="check" size={14} /> Correct! +1 Bonus Energy for this battle!
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, background: 'rgba(248,81,73,0.1)', border: '1px solid rgba(248,81,73,0.3)', borderRadius: 8, padding: '0.75rem', marginBottom: 12, fontSize: '0.8rem', color: '#F85149' }}>
                <Icon name="cross" size={14} /> <span>Incorrect. {question.explanation}</span>
              </div>
            )}
            <button
              onClick={() => onComplete(isCorrect && selected !== null)}
              style={{
                width: '100%', background: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
                border: 'none', borderRadius: 10, padding: '0.75rem',
                color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              }}
            >
              Continue to Battle <Icon name="right" size={15} />
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ──────────────────────────────────────
// MAIN BATTLE COMPONENT
// ──────────────────────────────────────
export default function Battle() {
  const navigate = useNavigate();
  const { run, updateHP, completeNode, addLog, endRun, incrementQuestionsCorrect, incrementQuestionsAnswered, setRun } = useDungeonRun();

  // Derive enemy from current node
  const currentNode = run?.mapNodes?.find(n => n.id === run.currentNodeId);
  const enemy = currentNode?.enemyId ? getEnemyById(currentNode.enemyId) : null;

  const hasHint = run?.relics?.some(r => r.startsWith('🔍'));
  const globalAttackBonus = run?.relics?.filter(r => r.startsWith('🪬')).length * 3 || 0;
  const hasThorns = run?.relics?.some(r => r.startsWith('🌵'));
  const hasLifesteal = run?.relics?.some(r => r.startsWith('🦷'));
  const bonusEnergyRelic = run?.relics?.filter(r => r.startsWith('💎')).length || 0;
  const battleStartShield = run?.relics?.filter(r => r.startsWith('💍')).length * 5 || 0;
  const costReduction = run?.relics?.filter(r => r.startsWith('📜')).length || 0;

  // Build battle cards from selected cards
  const battleCards = (run?.selectedCards || []).map(card => {
    const rawCost = card.rarity === 'legendary' ? 3 : card.rarity === 'rare' || card.rarity === 'epic' ? 2 : 1;
    const energyCost = Math.max(1, rawCost - costReduction);
    const attackVal = (card.attack || card.baseStats?.attack || 20) + globalAttackBonus;
    const shieldVal = Math.floor((card.defense || card.baseStats?.defense || 10) / 10);
    return { ...card, energyCost, battleAttack: attackVal, battleShield: shieldVal };
  });

  const [phase, setPhase] = useState('challenge'); // challenge | player | enemy | victory | defeat
  const [bonusEnergy, setBonusEnergy] = useState(0);
  const [energy, setEnergy] = useState(3);
  const [playerShield, setPlayerShield] = useState(battleStartShield);
  const [enemyHP, setEnemyHP] = useState(enemy?.maxHP || 100);
  const [enemyShield, setEnemyShield] = useState(0);
  const [buffCount, setBuffCount] = useState(0);
  const [intentStep, setIntentStep] = useState(0);
  const [log, setLog] = useState([]);
  const [playerShaking, setPlayerShaking] = useState(false);
  const [enemyShaking, setEnemyShaking] = useState(false);
  const [playingCardIdx, setPlayingCardIdx] = useState(null);
  const [weakStacks, setWeakStacks] = useState(0); // enemy weak debuff
  const [weakTurns, setWeakTurns] = useState(0);
  const [lastEnemyIntent, setLastEnemyIntent] = useState(null);
  const [revealedIntents, setRevealedIntents] = useState([]);

  const addToLog = (msg) => setLog(prev => [...prev, msg].slice(-50));

  useEffect(() => {
    if (!run?.active || !enemy) {
      navigate('/dungeon/map');
    }
  }, []);

  const handleChallengeComplete = (correct) => {
    if (correct) {
      setBonusEnergy(1);
      incrementQuestionsCorrect();
      addLog('setRun');
      setRun(prev => prev ? { ...prev, questionsCorrect: (prev.questionsCorrect || 0) + 1, questionsAnswered: (prev.questionsAnswered || 0) + 1 } : prev);
    } else {
      setRun(prev => prev ? { ...prev, questionsAnswered: (prev.questionsAnswered || 0) + 1 } : prev);
    }
    const startEnergy = 3 + (correct ? 1 : 0) + bonusEnergyRelic;
    setEnergy(startEnergy);
    addToLog(`Battle begins! You face ${enemy.name}`);
    if (correct) addToLog('IELTS correct! +1 bonus energy');
    setPhase('player');
  };

  const getCardAction = (card) => {
    const domain = card.ieltsDomain || 'universal';
    const atk = card.battleAttack || 20;
    const shld = card.battleShield || 0;
    switch (domain) {
      case 'reading': return { attack: atk, shield: 0, special: 'reveal' };
      case 'listening': return { attack: lastEnemyIntent === 'attack' ? Math.floor(atk * 1.5) : atk, shield: 0, special: 'echo' };
      case 'vocabulary': return { attack: atk, shield: 0, special: 'weak' };
      case 'grammar': return { attack: atk, shield: shld, special: 'shield' };
      case 'universal': return { attack: atk, shield: 0, special: 'energy' };
      default: return { attack: atk, shield: 0, special: null };
    }
  };

  const handlePlayCard = (card, idx) => {
    if (energy < card.energyCost || phase !== 'player') return;
    setPlayingCardIdx(idx);
    setTimeout(() => setPlayingCardIdx(null), 500);

    const action = getCardAction(card);
    let newEnemyHP = enemyHP;
    let newEnergy = energy - card.energyCost;
    let newPlayerShield = playerShield;
    let newWeakStacks = weakStacks;
    let newWeakTurns = weakTurns;

    // Deal damage
    const rawDmg = action.attack;
    const dmgAfterShield = Math.max(0, rawDmg - enemyShield);
    newEnemyHP = Math.max(0, newEnemyHP - dmgAfterShield);
    setEnemyShield(0);
    addToLog(`> ${card.name} attacks for ${dmgAfterShield} damage`);
    if (dmgAfterShield > 0) setEnemyShaking(true), setTimeout(() => setEnemyShaking(false), 400);

    if (hasLifesteal && dmgAfterShield > 0) {
      const heal = 2;
      updateHP(Math.min(run.playerMaxHP, run.playerHP + heal));
      addToLog(`> Vampiric Fang: healed ${heal} HP`);
    }

    // Shield
    if (action.shield > 0) {
      newPlayerShield = playerShield + action.shield;
      addToLog(`> You gain ${action.shield} shield`);
    }

    // Special effects
    if (action.special === 'weak') {
      newWeakStacks = Math.min(3, weakStacks + 1);
      newWeakTurns = 2;
      addToLog(`> Curse Word: enemy Weakened (${newWeakStacks} stack${newWeakStacks > 1 ? 's' : ''})`);
    } else if (action.special === 'energy') {
      newEnergy = newEnergy + 1;
      addToLog(`> Mastery: +1 energy`);
    } else if (action.special === 'reveal') {
      const revealed = enemy.intentPattern.slice(intentStep, intentStep + 2);
      setRevealedIntents(revealed);
      addToLog(`> Analyze: revealed next intents: ${revealed.join(', ')}`);
    } else if (action.special === 'echo' && lastEnemyIntent === 'attack') {
      addToLog(`> Echo: extra damage from countering attack!`);
    }

    setEnergy(newEnergy);
    setEnemyHP(newEnemyHP);
    setPlayerShield(newPlayerShield);
    setWeakStacks(newWeakStacks);
    setWeakTurns(newWeakTurns);

    addToLog(`> Enemy HP: ${enemyHP} → ${newEnemyHP}`);

    if (newEnemyHP <= 0) {
      setPhase('victory');
    }
  };

  const handleEndTurn = () => {
    if (phase !== 'player') return;
    setPhase('enemy');
    addToLog('─── Enemy Turn ───');

    // Enemy performs intent
    const pattern = enemy.intentPattern;
    const intent = pattern[intentStep % pattern.length];
    const attackVal = enemy.attackValues[intentStep % pattern.length] || 0;
    const nextStep = (intentStep + 1) % pattern.length;
    setIntentStep(nextStep);
    setLastEnemyIntent(intent);

    let newEnemyShield = enemyShield;
    let buffMultiplier = buffCount;

    if (intent === 'attack') {
      let dmg = attackVal * (buffMultiplier > 0 ? 1.5 : 1);
      if (weakStacks > 0) dmg = Math.floor(dmg * 0.75);
      dmg = Math.floor(dmg);
      const afterShield = Math.max(0, dmg - playerShield);
      const newHP = run.playerHP - afterShield;

      addToLog(`> ${enemy.name} attacks for ${afterShield} damage (${dmg} - ${Math.min(playerShield, dmg)} shield)`);
      if (afterShield > 0) setPlayerShaking(true), setTimeout(() => setPlayerShaking(false), 400);

      if (hasThorns && afterShield > 0) {
        setEnemyHP(prev => {
          const after = Math.max(0, prev - 5);
          addToLog(`> Thorn Armor: 5 reflected to enemy`);
          if (after <= 0) { setPhase('victory'); }
          return after;
        });
      }

      setPlayerShield(0);
      updateHP(Math.max(0, newHP));

      // Weak wears off
      if (weakTurns > 0) {
        const newWT = weakTurns - 1;
        setWeakTurns(newWT);
        if (newWT === 0) setWeakStacks(0);
      }

      if (newHP <= 0) {
        setTimeout(() => setPhase('defeat'), 600);
        return;
      }

    } else if (intent === 'defend') {
      newEnemyShield = (attackVal || 10);
      setEnemyShield(newEnemyShield);
      addToLog(`> ${enemy.name} gains ${newEnemyShield} shield`);
    } else if (intent === 'buff') {
      setBuffCount(b => b + 1);
      addToLog(`> ${enemy.name} buffs up! Next attacks deal +50% damage`);
    }

    // Player turn reset
    setTimeout(() => {
      const newEnergy = 3 + bonusEnergyRelic;
      setEnergy(newEnergy);
      setPlayerShield(prev => {
        // keep accumulated shield (don't reset after enemy turn, reset at turn start next time)
        return 0;
      });
      addToLog('─── Your Turn ───');
      setPhase('player');
    }, 800);
  };

  const handleVictory = () => {
    const goldMin = enemy.goldReward?.min || 5;
    const goldMax = enemy.goldReward?.max || 15;
    const goldMult = run.relics?.some(r => r.startsWith('🪙')) ? 1.5 : 1;
    const gold = Math.round((goldMin + Math.floor(Math.random() * (goldMax - goldMin + 1))) * goldMult);

    completeNode(run.currentNodeId, { gold, enemy: true });
    addLog(`${enemy.name} defeated! +${gold} gold`);

    // Check if boss and was last floor
    if (currentNode?.type === 'boss' && run.floor === 3) {
      navigate('/dungeon/result?outcome=win');
    } else if (currentNode?.type === 'boss') {
      navigate('/dungeon/map');
    } else {
      navigate('/dungeon/map');
    }
  };

  const handleDefeat = () => {
    endRun('lose');
    navigate('/dungeon/result?outcome=lose');
  };

  if (!run?.active || !enemy) return null;

  const currentIntent = enemy.intentPattern[intentStep % enemy.intentPattern.length];
  const currentIntentVal = enemy.attackValues[intentStep % enemy.intentPattern.length] || 0;

  const hpPct = (run.playerHP / run.playerMaxHP) * 100;
  const hpColor = hpPct > 60 ? '#3FB950' : hpPct > 30 ? '#F59E0B' : '#F85149';

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', background: '#0D1117' }}>
      <RunStats run={run} />

      {/* IELTS Challenge overlay */}
      {phase === 'challenge' && (
        <IELTSChallenge onComplete={handleChallengeComplete} hasHint={hasHint} />
      )}

      {/* Victory overlay */}
      <AnimatePresence>
        {phase === 'victory' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.85)',
              zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              style={{
                background: '#161B22', border: '1px solid rgba(63,185,80,0.4)',
                borderRadius: 16, padding: '2rem', textAlign: 'center', maxWidth: 340,
              }}
            >
              <div style={{ color: '#3FB950', marginBottom: 8, display: 'flex', justifyContent: 'center' }}><Icon name="trophy" size={44} /></div>
              <h2 style={{ fontFamily: 'Cinzel', color: '#3FB950', margin: '0 0 8px' }}>Victory!</h2>
              <p style={{ color: '#8B949E', fontSize: '0.875rem', marginBottom: 20 }}>
                {enemy.name} has been defeated!
              </p>
              <button onClick={handleVictory} style={{
                background: 'linear-gradient(135deg, #3FB950, #2D9139)',
                border: 'none', borderRadius: 10, padding: '0.75rem 2rem',
                color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem',
                fontFamily: 'Cinzel',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              }}>
                Continue <Icon name="right" size={15} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Defeat overlay */}
      <AnimatePresence>
        {phase === 'defeat' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.9)',
              zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              style={{
                background: '#161B22', border: '1px solid rgba(248,81,73,0.4)',
                borderRadius: 16, padding: '2rem', textAlign: 'center', maxWidth: 340,
              }}
            >
              <div style={{ color: '#F85149', marginBottom: 8, display: 'flex', justifyContent: 'center' }}><Icon name="skull" size={44} /></div>
              <h2 style={{ fontFamily: 'Cinzel', color: '#F85149', margin: '0 0 8px' }}>Defeated</h2>
              <p style={{ color: '#8B949E', fontSize: '0.875rem', marginBottom: 20 }}>
                Your journey ends here on Floor {run.floor}.
              </p>
              <button onClick={handleDefeat} style={{
                background: 'linear-gradient(135deg, #F85149, #C0392B)',
                border: 'none', borderRadius: 10, padding: '0.75rem 2rem',
                color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem',
              }}>
                See Results
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main battle layout */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '1rem 1rem' }}>
        {/* Top bars */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {/* Player HP */}
          <div style={{ background: '#161B22', border: '1px solid rgba(63,185,80,0.2)', borderRadius: 10, padding: '0.75rem' }}>
            <div style={{ fontSize: '0.65rem', color: '#8B949E', marginBottom: 4 }}>YOU</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'JetBrains Mono', color: hpColor, fontWeight: 700 }}>
                <Icon name="hp" size={14} /> {run.playerHP}/{run.playerMaxHP}
              </span>
              {playerShield > 0 && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'JetBrains Mono', color: '#3B82F6', fontWeight: 700, fontSize: '0.8rem' }}>
                  <Icon name="defense" size={13} /> {playerShield}
                </span>
              )}
            </div>
            <div style={{ background: '#0D1117', borderRadius: 3, height: 7 }}>
              <motion.div
                animate={{ width: `${hpPct}%` }}
                transition={{ duration: 0.4 }}
                style={{ height: '100%', background: hpColor, borderRadius: 3 }}
              />
            </div>
          </div>

          {/* Energy */}
          <div style={{ background: '#161B22', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 10, padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.65rem', color: '#8B949E', marginBottom: 4 }}>ENERGY</div>
              <div style={{ display: 'flex', gap: 5 }}>
                {[1, 2, 3].map(e => (
                  <div key={e} style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: energy >= e ? '#7C3AED' : '#1F2937',
                    border: `2px solid ${energy >= e ? '#A78BFA' : '#374151'}`,
                    transition: 'all 0.2s',
                  }} />
                ))}
                {bonusEnergyRelic > 0 && <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#F59E0B', border: '2px solid #F97316' }} />}
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.65rem', color: '#8B949E' }}>
              Turn {intentStep + 1}
            </div>
          </div>
        </div>

        {/* Battle arena */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, marginBottom: 16, alignItems: 'center' }}>
          {/* Player side indicator */}
          <motion.div
            animate={playerShaking ? { x: [-8, 8, -6, 6, 0] } : {}}
            style={{
              background: '#161B22',
              border: `1px solid ${phase === 'player' ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.06)'}`,
              borderRadius: 12, padding: '1rem',
              textAlign: 'center',
            }}
          >
            <div style={{ marginBottom: 8, color: '#A78BFA', display: 'flex', justifyContent: 'center' }}><Icon name="monster" size={36} /></div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontFamily: 'Cinzel', fontSize: '0.75rem', color: phase === 'player' ? '#A78BFA' : '#8B949E' }}>
              {phase === 'player' ? <><Icon name="play" size={12} /> YOUR TURN</> : phase === 'enemy' ? <><Icon name="clock" size={12} /> Waiting...</> : ''}
            </div>
            {weakStacks === 0 && playerShield > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, color: '#3B82F6', fontSize: '0.75rem', marginTop: 4 }}><Icon name="defense" size={13} /> {playerShield}</div>
            )}
          </motion.div>

          {/* VS */}
          <div style={{ fontFamily: 'Cinzel', fontWeight: 900, color: '#4B5563', fontSize: '1.25rem' }}>VS</div>

          {/* Enemy */}
          <EnemySprite
            enemy={enemy}
            currentHP={enemyHP}
            maxHP={enemy.maxHP}
            shaking={enemyShaking}
            intent={currentIntent}
            intentValue={currentIntentVal}
            buffCount={buffCount}
          />
        </div>

        {/* Hand */}
        <div style={{
          background: '#161B22', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 12, padding: '1rem', marginBottom: 12,
        }}>
          <div style={{ fontSize: '0.65rem', color: '#8B949E', marginBottom: 8 }}>HAND — Click a card to play it</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {battleCards.map((card, idx) => (
              <DungeonCard
                key={card.id || idx}
                card={card}
                energyCost={card.energyCost}
                canAfford={energy >= card.energyCost && phase === 'player'}
                onClick={() => handlePlayCard(card, idx)}
                isPlaying={playingCardIdx === idx}
              />
            ))}
          </div>
        </div>

        {/* End turn button */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <motion.button
            onClick={handleEndTurn}
            disabled={phase !== 'player'}
            whileHover={phase === 'player' ? { scale: 1.02 } : {}}
            whileTap={phase === 'player' ? { scale: 0.98 } : {}}
            style={{
              flex: 1,
              background: phase === 'player' ? 'linear-gradient(135deg, #7C3AED, #5B21B6)' : 'rgba(255,255,255,0.04)',
              border: 'none', borderRadius: 10, padding: '0.75rem',
              color: phase === 'player' ? 'white' : '#4B5563',
              fontWeight: 700, cursor: phase === 'player' ? 'pointer' : 'not-allowed',
              fontSize: '0.9rem', fontFamily: 'Cinzel',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            }}
          >
            {phase === 'enemy' ? <><Icon name="clock" size={14} /> Enemy Turn...</> : <>End Turn <Icon name="right" size={14} /></>}
          </motion.button>
        </div>

        {/* Battle log */}
        <BattleLog entries={log} />
      </div>
    </div>
  );
}
