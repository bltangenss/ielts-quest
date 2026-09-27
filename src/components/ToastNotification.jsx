import { motion, AnimatePresence } from 'framer-motion';
import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const ICO = (d) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{d}</svg>;
  const COLORS = {
    info:    { bg: '#FFFFFF', border: '#6D5EF6', tint: '#6D5EF6', icon: ICO(<><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></>) },
    success: { bg: '#FFFFFF', border: '#16C79A', tint: '#16C79A', icon: ICO(<><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></>) },
    chest:   { bg: '#FFFFFF', border: '#FFB02E', tint: '#FFB02E', icon: ICO(<><path d="M3 8.5 12 4l9 4.5V17l-9 4-9-4V8.5Z"/><path d="M3 8.5 12 13l9-4.5M12 13v8"/></>) },
    levelup: { bg: '#FFFFFF', border: '#6D5EF6', tint: '#6D5EF6', icon: ICO(<><path d="M12 19V5M5 12l7-7 7 7"/></>) },
    error:   { bg: '#FFFFFF', border: '#FF6B6B', tint: '#FF6B6B', icon: ICO(<><circle cx="12" cy="12" r="9"/><path d="m15 9-6 6M9 9l6 6"/></>) },
  };

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div style={{
        position: 'fixed', top: 80, right: 20,
        zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8,
        pointerEvents: 'none',
      }}>
        <AnimatePresence>
          {toasts.map(toast => {
            const style = COLORS[toast.type] || COLORS.info;
            return (
              <motion.div
                key={toast.id}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                style={{
                  background: style.bg,
                  border: `1px solid ${style.border}`,
                  borderRadius: 10,
                  padding: '10px 16px',
                  display: 'flex', alignItems: 'center', gap: 8,
                  boxShadow: 'var(--shadow-soft)',
                  pointerEvents: 'auto',
                  maxWidth: 300,
                  backdropFilter: 'blur(8px)',
                }}
              >
                <span style={{ color: style.tint, display: 'grid', placeItems: 'center' }}>{style.icon}</span>
                <span style={{ color: '#221A5B', fontSize: '0.875rem', fontWeight: 500 }}>
                  {toast.message}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be inside ToastProvider');
  return ctx;
}
