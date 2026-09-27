import { useRef, useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DungeonWorld } from '../../components/game/DungeonWorld';
import { BiomeWorld } from '../../components/game/BiomeWorld';
import { BIOME_ORDER, BIOMES } from '../../components/game/biomes';
import { CardArt } from '../../components/CardArt';
import { rollUpgrades } from '../../data/rogueUpgrades';
import { useCards } from '../../hooks/useCards';
import { useUser } from '../../hooks/useUser';
import { getCardById } from '../../data/cards';
import { ARENA_ENEMIES } from '../../data/arenaEnemies';
import { DOMAIN_TO_TYPE, TYPE_COLORS } from '../../data/arenaAbilities';
import { Icon } from '../../components/Icon';

const NINJA = '#A78BFA';

// Enemy pool the wave generator draws from (flattened from arena enemies)
const ENEMY_POOL = ARENA_ENEMIES.map(e => ({ tier: e.tier, creatures: e.creatures }));

export default function Play() {
  const navigate = useNavigate();
  const gameRef = useRef(null);
  const { collection, ensureCard } = useCards();
  const { addChest, addXP } = useUser();

  const [stage, setStage] = useState('select'); // select | playing | result
  const [mode, setMode] = useState('expedition'); // dungeon | expedition
  const [hero, setHero] = useState(null);
  const [popup, setPopup] = useState(null);     // { choices, wave, boss }
  const [result, setResult] = useState(null);   // { stat }
  const [runKey, setRunKey] = useState(0);

  // Grant the signature hero cards to the collection once
  useEffect(() => { ensureCard('kage_severed'); ensureCard('raiden_ronin'); }, [ensureCard]);

  // Owned creatures (deck of 1 — pick which card is your hero). Ninjas shown first.
  const owned = useMemo(() => {
    if (!collection?.cards) return [];
    const NINJAS = ['kage_severed', 'raiden_ronin'];
    const list = collection.cards.map(c => {
      const m = getCardById(c.cardId); if (!m) return null;
      const st = c.evolutionLevel === 0 ? m.baseStats : c.evolutionLevel === 1 ? m.evolvedStats : m.maxStats;
      return {
        id: m.id, name: m.name, emoji: m.artEmoji, rarity: m.rarity,
        ieltsDomain: m.ieltsDomain, type: DOMAIN_TO_TYPE[m.ieltsDomain] || 'Void',
        maxHP: Math.round(st.hp * 1.6), attack: Math.round(st.attack * 1.0), defense: st.defense, speed: st.speed,
      };
    }).filter(Boolean);
    list.sort((a, b) => {
      const ai = NINJAS.indexOf(a.id), bi = NINJAS.indexOf(b.id);
      if (ai !== -1 || bi !== -1) return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
      return 0;
    });
    return list;
  }, [collection]);

  const startRun = () => {
    if (!hero) return;
    setStage('playing');
    setPopup(null);
    setResult(null);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
  };

  const handleRoomClear = (room, boss, offerUpgrade) => {
    if (!offerUpgrade) return;                  // normal rooms just open the door
    setPopup({ choices: rollUpgrades(3), wave: room, boss });
  };
  const pickUpgrade = (u) => { setPopup(null); gameRef.current?.applyUpgrade(u); };

  const handleRunEnd = (stat) => {
    const w = stat?.room || 1;
    if (w >= 20) { addChest('gold'); addXP(200); }
    else if (w >= 10) { addChest('silver'); addXP(100); }
    else if (w >= 5) { addChest('bronze'); addXP(50); }
    else { addXP(15); }
    setResult({ stat });
    setStage('result');
  };

  const retry = () => { setRunKey(k => k + 1); setStage('select'); setHero(null); setResult(null); setPopup(null); };

  // ─── HERO SELECT ───
  if (stage === 'select') {
    return (
      <div style={{ background: 'radial-gradient(circle at 50% 0%, rgba(124,58,237,0.22), transparent 38%), radial-gradient(circle at 85% 12%, rgba(220,38,38,0.16), transparent 32%), #07030A', minHeight: 'calc(100vh - 60px)' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '2.2rem 1.25rem 2.8rem' }}>
          <button onClick={() => navigate('/game')} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '0.35rem 0.75rem', color: '#9CA3AF', cursor: 'pointer', fontSize: '0.8rem', marginBottom: 16 }}><Icon name="left" size={14} /> Hub</button>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'Cinzel', fontWeight: 900, fontSize: '2.35rem', color: NINJA, margin: '0 0 6px', textShadow: `0 0 34px ${NINJA}66` }}><Icon name="speed" size={30} /> Endless Arena</h1>
          <p style={{ color: '#C7BDD8', margin: '0 0 18px', maxWidth: 720 }}>Pick a hero, grab weapons, clear rooms, take boss upgrades, and keep the run going until you drop.</p>

          {/* MODE PICKER */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
            <button aria-pressed={mode === 'expedition'} onClick={() => setMode('expedition')} style={{ flex: 1, minWidth: 280, textAlign: 'left', background: mode === 'expedition' ? 'linear-gradient(135deg,#16A34A24,#120B17)' : 'rgba(16,9,14,0.88)', border: `2px solid ${mode === 'expedition' ? '#16A34A' : 'rgba(255,255,255,0.08)'}`, borderRadius: 8, padding: '1rem 1.1rem', cursor: 'pointer', color: '#F5F0F0', boxShadow: mode === 'expedition' ? '0 18px 36px rgba(22,163,74,0.12)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'Cinzel', fontWeight: 800, fontSize: '0.95rem' }}><Icon name="globe" size={17} /> Biome Expedition <span style={{ fontSize: '0.6rem', background: '#16A34A', color: '#04120a', borderRadius: 4, padding: '1px 5px', verticalAlign: 'middle', marginLeft: 4 }}>NEW</span></div>
              <div style={{ fontSize: '0.7rem', color: '#9CA3AF', marginTop: 4 }}>Forest, caves, frost, lava, abyss. Unique enemies, weather, rest stops.</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8, color: '#9CA3AF' }}>{BIOME_ORDER.map(b => <Icon key={b} glyph={BIOMES[b].emoji} size={16} title={BIOMES[b].name} />)}</div>
            </button>
            <button aria-pressed={mode === 'dungeon'} onClick={() => setMode('dungeon')} style={{ flex: 1, minWidth: 280, textAlign: 'left', background: mode === 'dungeon' ? 'linear-gradient(135deg,#A78BFA24,#120B17)' : 'rgba(16,9,14,0.88)', border: `2px solid ${mode === 'dungeon' ? NINJA : 'rgba(255,255,255,0.08)'}`, borderRadius: 8, padding: '1rem 1.1rem', cursor: 'pointer', color: '#F5F0F0', boxShadow: mode === 'dungeon' ? '0 18px 36px rgba(167,139,250,0.12)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'Cinzel', fontWeight: 800, fontSize: '0.95rem' }}><Icon name="castle" size={17} /> Dungeon</div>
              <div style={{ fontSize: '0.7rem', color: '#9CA3AF', marginTop: 4 }}>Classic fortress rooms, boss every 5. One dark biome.</div>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px,1fr))', gap: 16 }}>
            {owned.map(h => {
              const ninja = h.id === 'raiden_ronin';
              const col = ninja ? NINJA : TYPE_COLORS[h.type];
              return (
                <motion.button key={h.id} aria-pressed={hero?.id === h.id} whileHover={{ y: -5 }} onClick={() => setHero(h)}
                  style={{ position: 'relative', background: ninja ? 'linear-gradient(160deg,#1E1B4B,#0D0608)' : '#1C0A0A', border: `${hero?.id === h.id ? 3 : ninja ? 2 : 1}px solid ${hero?.id === h.id ? '#F59E0B' : col}${ninja ? '' : '55'}`, borderRadius: 8, padding: '0.75rem 0.65rem 1.05rem', cursor: 'pointer', boxShadow: hero?.id === h.id ? '0 0 34px rgba(245,158,11,0.58)' : `0 0 ${ninja ? 24 : 16}px ${col}${ninja ? '66' : '22'}` }}>
                  {ninja && <div style={{ position: 'absolute', top: 6, right: 6, background: NINJA, color: '#1E1B4B', fontSize: '0.5rem', fontWeight: 900, borderRadius: 4, padding: '1px 5px', letterSpacing: 1 }}>NEW</div>}
                  <div style={{ height: 156, margin: '-0.75rem -0.65rem 10px', borderRadius: '7px 7px 0 0', overflow: 'hidden' }}>
                    <CardArt card={h} />
                  </div>
                  <div style={{ fontFamily: 'Cinzel', fontWeight: 700, color: '#F5F0F0', fontSize: '0.88rem', margin: '6px 0', lineHeight: 1.15 }}>{h.name}</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 3, background: `${col}22`, color: col, borderRadius: 100, padding: '1px 8px', fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>{ninja ? <><Icon name="speed" size={10} /> Lightning</> : h.type}</div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 6, fontSize: '0.58rem', fontFamily: 'JetBrains Mono' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, color: '#4ADE80' }}><Icon name="hp" size={11} />{h.maxHP}</span><span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, color: '#F87171' }}><Icon name="attack" size={11} />{h.attack}</span><span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, color: '#FBBF24' }}><Icon name="speed" size={11} />{h.speed}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          <motion.button
            whileHover={hero ? { scale: 1.02 } : {}}
            whileTap={hero ? { scale: 0.98 } : {}}
            onClick={startRun}
            disabled={!hero}
            style={{
              width: '100%', marginTop: 18, border: 'none', borderRadius: 12, padding: '0.95rem 1rem',
              background: hero ? 'linear-gradient(135deg,#7C3AED,#DC2626)' : 'rgba(255,255,255,0.06)',
              color: hero ? '#fff' : '#6B7280', fontFamily: 'Cinzel', fontWeight: 900,
              cursor: hero ? 'pointer' : 'not-allowed', boxShadow: hero ? '0 0 28px rgba(124,58,237,0.35)' : 'none',
            }}
          >
            {hero ? `Start ${mode === 'expedition' ? 'Expedition' : 'Dungeon'} with ${hero.name}` : 'Choose a hero to begin'}
          </motion.button>
        </div>
      </div>
    );
  }

  // ─── RESULT ───
  if (stage === 'result' && result) {
    const w = result.stat?.room || 1;
    return (
      <div style={{ minHeight: 'calc(100vh - 60px)', background: 'radial-gradient(ellipse at center,rgba(167,139,250,0.14),#0D0608 70%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <motion.div initial={{ scale: .9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          style={{ background: '#1C0A0A', border: `2px solid ${NINJA}66`, borderRadius: 20, padding: '2.5rem', textAlign: 'center', maxWidth: 420, width: '100%' }}>
          <div style={{ color: NINJA, marginBottom: 10, display: 'flex', justifyContent: 'center' }}><Icon name="skull" size={64} /></div>
          <h1 style={{ fontFamily: 'Cinzel', fontWeight: 900, fontSize: '2rem', color: NINJA, margin: '0 0 6px' }}>Run Over</h1>
          <p style={{ color: '#9CA3AF', margin: '0 0 20px', fontSize: '0.95rem' }}>You reached <b style={{ color: '#F59E0B' }}>room {w}</b></p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            <Stat icon="globe" color="#38BDF8" label="Room" val={w} />
            <Stat icon="attack" color="#F87171" label="Kills" val={result.stat?.kills || 0} />
            <Stat icon="gold" color="#FBBF24" label="Gold" val={result.stat?.gold || 0} />
            <Stat icon="up" color="#A78BFA" label="Upgrades" val={result.stat?.upg || 0} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'rgba(167,139,250,0.1)', border: `1px solid ${NINJA}33`, borderRadius: 12, padding: '0.75rem', marginBottom: 20, fontSize: '0.85rem', color: NINJA }}>
            <Icon name={w >= 5 ? 'trophy' : 'spark'} size={16} />
            {w >= 20 ? 'Gold chest + 200 XP' : w >= 10 ? 'Silver chest + 100 XP' : w >= 5 ? 'Bronze chest + 50 XP' : '+15 XP for the attempt'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <motion.button whileHover={{ scale: 1.04 }} onClick={retry} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: `linear-gradient(135deg,${NINJA},#6D28D9)`, border: 'none', borderRadius: 12, padding: '0.85rem', color: '#fff', fontWeight: 800, cursor: 'pointer', fontFamily: 'Cinzel' }}><Icon name="refresh" size={16} /> Again</motion.button>
            <button onClick={() => navigate('/game')} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '0.7rem', color: '#F5F0F0', fontWeight: 600, cursor: 'pointer' }}>To hub</button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── PLAYING ───
  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', background: 'radial-gradient(circle at 50% -20%, rgba(124,58,237,0.16), transparent 42%), #07030A' }}>
      <div style={{ maxWidth: 'min(1220px, calc(100vw - 24px))', margin: '0 auto', padding: '0.9rem 0.5rem 2rem' }}>
        {mode === 'expedition' ? (
          <BiomeWorld
            key={`bw_${hero?.id}_${runKey}`}
            ref={gameRef}
            hero={hero}
            enemyPool={ENEMY_POOL}
            onRoomClear={handleRoomClear}
            onRunEnd={handleRunEnd}
          />
        ) : (
          <DungeonWorld
            key={`dw_${hero?.id}_${runKey}`}
            ref={gameRef}
            hero={hero}
            enemyPool={ENEMY_POOL}
            onRoomClear={handleRoomClear}
            onRunEnd={handleRunEnd}
          />
        )}
      </div>

      {/* UPGRADE POPUP */}
      <AnimatePresence>
        {popup && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(5,2,3,0.86)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1.5rem' }}>
            <motion.div initial={{ scale: .9, y: 20 }} animate={{ scale: 1, y: 0 }} style={{ maxWidth: 540, width: '100%', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: '#9CA3AF', fontSize: '0.8rem', marginBottom: 4 }}>{popup.boss ? <><Icon name="skull" size={14} /> Boss defeated!</> : `Room ${popup.wave} cleared`}</div>
              <h2 style={{ fontFamily: 'Cinzel', fontWeight: 900, fontSize: '1.5rem', color: '#F59E0B', margin: '0 0 4px', textShadow: '0 0 24px rgba(245,158,11,0.5)' }}>Choose a power</h2>
              <p style={{ color: '#6B7280', fontSize: '0.78rem', margin: '0 0 20px' }}>One upgrade, stacks for the whole run</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                {popup.choices.map((u, i) => (
                  <motion.button key={u.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                    whileHover={{ y: -6, scale: 1.03 }} onClick={() => pickUpgrade(u)}
                    style={{ background: 'linear-gradient(160deg,#1C0A0A,#0D0608)', border: `2px solid ${u.color}66`, borderRadius: 16, padding: '1.25rem 0.5rem', cursor: 'pointer', boxShadow: `0 0 24px ${u.color}22` }}>
                    <div style={{ marginBottom: 8, color: u.color, display: 'flex', justifyContent: 'center' }}><Icon name={u.icon} size={34} /></div>
                    <div style={{ fontFamily: 'Cinzel', fontWeight: 700, color: u.color, fontSize: '0.85rem', marginBottom: 6 }}>{u.name}</div>
                    <div style={{ color: '#D1C4C4', fontSize: '0.68rem', lineHeight: 1.4 }}>{u.desc}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Stat({ icon, label, val, color }) {
  return (
    <div style={{ background: '#0D0608', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '0.6rem' }}>
      <div style={{ color: color || '#9CA3AF', display: 'flex', justifyContent: 'center' }}><Icon name={icon} size={18} /></div>
      <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '1.1rem', color: '#F5F0F0' }}>{val}</div>
      <div style={{ fontSize: '0.55rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
    </div>
  );
}
