import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useArenaRun } from '../../hooks/useArenaRun';
import { getRandomArenaEvent } from '../../data/arenaEvents';
import { Icon } from '../../components/Icon';

const CRIMSON = '#DC2626';

export default function ArenaMystery() {
  const navigate = useNavigate();
  const { run, completeNode, updateGold, updateTeam, addRelic } = useArenaRun();
  const [event] = useState(() => getRandomArenaEvent());
  const [outcome, setOutcome] = useState(null);

  if (!run?.active) { navigate('/game'); return null; }

  const healTeam = (amount) => {
    const team = run.team.map(c => c.isAlive ? { ...c, currentHP: Math.min(c.maxHP, c.currentHP + amount) } : c);
    updateTeam(team);
  };
  const damageActive = (amount) => {
    const team = run.team.map((c, i) => i === run.activeCreatureIndex && c.isAlive ? { ...c, currentHP: Math.max(1, c.currentHP - amount) } : c);
    updateTeam(team);
  };

  const handleChoice = (choice) => {
    let text = choice.outcome;
    let goldChange = 0, hpNote = '';

    if (choice.cost && choice.cost > 0) {
      if (run.gold < choice.cost) { setOutcome({ text: 'Not enough gold!', note: '' }); return; }
      updateGold(run.gold - choice.cost);
      goldChange -= choice.cost;
    }

    switch (choice.effect) {
      case 'team_heal': healTeam(choice.value); hpNote = `Team +${choice.value} HP`; break;
      case 'gold': updateGold(run.gold - (choice.cost || 0) + choice.value); goldChange += choice.value; break;
      case 'team_def_boost': addRelic(`⚒️|temp_def_${choice.value}`); hpNote = `Team +${choice.value} DEF`; break;
      case 'team_atk_boost': addRelic(`🗡️|temp_atk_${choice.value}`); hpNote = `Team +${choice.value} ATK`; break;
      case 'hp_for_atk': damageActive(choice.value); addRelic(`🩸|blood_atk`); hpNote = `-${choice.value} HP, +20 ATK this run`; break;
      case 'cursed_gold': {
        const cursed = Math.random() < 0.5;
        if (cursed) { damageActive(20); updateGold(run.gold + choice.value); text = `Gold claimed, but cursed! -20 HP, +${choice.value} gold`; goldChange += choice.value; hpNote = '-20 HP'; }
        else { updateGold(run.gold + choice.value); text = `Lucky! +${choice.value} gold, no curse.`; goldChange += choice.value; }
        break;
      }
      case 'mystery_potion': {
        const good = Math.random() < 0.6;
        if (good) { healTeam(choice.value); text = `The potion heals your team! +${choice.value} HP all.`; hpNote = `Team +${choice.value} HP`; }
        else { damageActive(15); text = `The potion was toxic! -15 HP.`; hpNote = '-15 HP'; }
        break;
      }
      case 'portal_gamble': {
        const good = Math.random() < 0.5;
        if (good) { updateGold(run.gold + choice.value); text = `The void rewards you! +${choice.value} gold.`; goldChange += choice.value; }
        else { damageActive(20); text = `The void bites back! -20 HP.`; hpNote = '-20 HP'; }
        break;
      }
      default: break;
    }

    setOutcome({ text, note: hpNote, goldChange });
  };

  const handleContinue = () => { completeNode(run.currentNodeId, {}); navigate('/game/arena-map'); };

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', background: '#0D0608' }}>
      <div style={{ maxWidth: 540, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: '#1C0A0A', border: `1px solid ${CRIMSON}25`, borderRadius: 16, padding: '2rem', textAlign: 'center' }}>
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }} style={{ marginBottom: 16, color: '#A78BFA', display: 'flex', justifyContent: 'center' }}><Icon glyph={event.emoji} size={56} /></motion.div>
          <h2 style={{ fontFamily: 'Cinzel', fontWeight: 700, fontSize: '1.4rem', color: '#F5F0F0', margin: '0 0 12px' }}>{event.title}</h2>
          <p style={{ color: '#D1C4C4', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 28 }}>{event.description}</p>

          <AnimatePresence mode="wait">
            {!outcome ? (
              <motion.div key="choices" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {event.choices.map((choice, idx) => (
                  <motion.button key={idx} onClick={() => handleChoice(choice)} whileHover={{ x: 4, scale: 1.01 }}
                    style={{ background: '#0D0608', border: `1px solid ${CRIMSON}33`, borderRadius: 10, padding: '0.875rem 1rem', color: '#F5F0F0', fontSize: '0.875rem', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 24, height: 24, borderRadius: '50%', background: `${CRIMSON}22`, border: `1px solid ${CRIMSON}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: '#F87171', flexShrink: 0 }}>{String.fromCharCode(65 + idx)}</span>
                    {choice.text}
                  </motion.button>
                ))}
              </motion.div>
            ) : (
              <motion.div key="outcome" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ background: '#0D0608', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '1.25rem', marginBottom: 20 }}>
                  <p style={{ color: '#D1C4C4', margin: '0 0 10px', fontSize: '0.875rem', lineHeight: 1.6 }}>{outcome.text}</p>
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {outcome.note && <span style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid #22C55E44', borderRadius: 100, padding: '3px 10px', color: '#4ADE80', fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '0.75rem' }}>{outcome.note}</span>}
                    {outcome.goldChange ? <span style={{ background: outcome.goldChange > 0 ? 'rgba(245,158,11,0.12)' : 'rgba(220,38,38,0.12)', border: `1px solid ${outcome.goldChange > 0 ? '#F59E0B44' : '#DC262644'}`, borderRadius: 100, padding: '3px 10px', color: outcome.goldChange > 0 ? '#F59E0B' : '#F87171', fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}>{outcome.goldChange > 0 ? '+' : ''}{outcome.goldChange} <Icon name="gold" size={12} /></span> : null}
                  </div>
                </div>
                <button onClick={handleContinue} style={{ width: '100%', background: `linear-gradient(135deg, ${CRIMSON}, #B45309)`, border: 'none', borderRadius: 10, padding: '0.875rem', color: 'white', fontWeight: 700, cursor: 'pointer', fontFamily: 'Cinzel', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>Continue <Icon name="right" size={15} /></button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
