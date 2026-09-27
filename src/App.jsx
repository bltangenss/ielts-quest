import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ToastProvider } from './components/ToastNotification';
import { Navbar } from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import ChestPage from './pages/Chest';
import Collection from './pages/Collection';
import Evolution from './pages/Evolution';
import Profile from './pages/Profile';
import LearnSelector from './pages/learn/LearnSelector';
import Reading from './pages/learn/Reading';
import Listening from './pages/learn/Listening';
import Vocabulary from './pages/learn/Vocabulary';
import Grammar from './pages/learn/Grammar';
import DungeonHub from './pages/dungeon/index';
import DungeonMap from './pages/dungeon/map';
import Battle from './pages/dungeon/battle';
import EventPage from './pages/dungeon/event';
import RestPage from './pages/dungeon/rest';
import ShopPage from './pages/dungeon/shop';
import DungeonResult from './pages/dungeon/result';
// ADDED: Arena pages
import ArenaHub from './pages/game/index';
import ArenaMap from './pages/game/arena-map';
import Combat from './pages/game/combat';
import ArenaMerchant from './pages/game/merchant';
import ArenaMystery from './pages/game/mystery';
import ArenaResult from './pages/game/arena-result';
import Play from './pages/game/play';

function AppLayout({ children }) {
  const { pathname } = useLocation();
  // The dungeon and arena are the dark "game" sections; everything else is the light theme.
  const darkBg = pathname.startsWith('/dungeon') ? '#0D1117' : pathname.startsWith('/game') ? '#0D0608' : null;
  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 60px)', background: darkBg || 'transparent' }}>
        {children}
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <div style={{ background: 'var(--porcelain)', minHeight: '100vh', color: 'var(--ink)' }}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
            <Route path="/chest" element={<AppLayout><ChestPage /></AppLayout>} />
            <Route path="/collection" element={<AppLayout><Collection /></AppLayout>} />
            <Route path="/evolution" element={<AppLayout><Evolution /></AppLayout>} />
            <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />
            <Route path="/learn" element={<AppLayout><LearnSelector /></AppLayout>} />
            <Route path="/learn/reading" element={<AppLayout><Reading /></AppLayout>} />
            <Route path="/learn/listening" element={<AppLayout><Listening /></AppLayout>} />
            <Route path="/learn/vocabulary" element={<AppLayout><Vocabulary /></AppLayout>} />
            <Route path="/learn/grammar" element={<AppLayout><Grammar /></AppLayout>} />
            <Route path="/dungeon" element={<AppLayout><DungeonHub /></AppLayout>} />
            <Route path="/dungeon/map" element={<AppLayout><DungeonMap /></AppLayout>} />
            <Route path="/dungeon/battle" element={<AppLayout><Battle /></AppLayout>} />
            <Route path="/dungeon/event" element={<AppLayout><EventPage /></AppLayout>} />
            <Route path="/dungeon/rest" element={<AppLayout><RestPage /></AppLayout>} />
            <Route path="/dungeon/shop" element={<AppLayout><ShopPage /></AppLayout>} />
            <Route path="/dungeon/result" element={<DungeonResult />} />
            {/* ADDED: Arena routes */}
            <Route path="/game" element={<AppLayout><ArenaHub /></AppLayout>} />
            <Route path="/game/arena-map" element={<AppLayout><ArenaMap /></AppLayout>} />
            <Route path="/game/combat" element={<AppLayout><Combat /></AppLayout>} />
            <Route path="/game/merchant" element={<AppLayout><ArenaMerchant /></AppLayout>} />
            <Route path="/game/mystery" element={<AppLayout><ArenaMystery /></AppLayout>} />
            <Route path="/game/arena-result" element={<ArenaResult />} />
            <Route path="/game/play" element={<AppLayout><Play /></AppLayout>} />
          </Routes>
        </div>
      </ToastProvider>
    </BrowserRouter>
  );
}
