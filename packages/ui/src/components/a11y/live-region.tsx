'use client';

import * as React from 'react';

/**
 * LiveRegion — coordinated aria-live announcer.
 * Use the hook to announce messages programmatically.
 * (TIER 12)
 */
const LiveRegionContext = React.createContext<
  ((msg: string, urgency?: 'polite' | 'assertive') => void) | null
>(null);

export function LiveRegionProvider({ children }: { children: React.ReactNode }) {
  const [polite, setPolite] = React.useState('');
  const [assertive, setAssertive] = React.useState('');

  const announce = React.useCallback((msg: string, urgency: 'polite' | 'assertive' = 'polite') => {
    if (urgency === 'assertive') {
      setAssertive(msg);
      setTimeout(() => setAssertive(''), 1000);
    } else {
      setPolite(msg);
      setTimeout(() => setPolite(''), 1000);
    }
  }, []);

  return (
    <LiveRegionContext.Provider value={announce}>
      {children}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {polite}
      </div>
      <div aria-live="assertive" aria-atomic="true" className="sr-only">
        {assertive}
      </div>
    </LiveRegionContext.Provider>
  );
}

export function useAnnounce(): (msg: string, urgency?: 'polite' | 'assertive') => void {
  const ctx = React.useContext(LiveRegionContext);
  if (!ctx) throw new Error('useAnnounce must be used within LiveRegionProvider');
  return ctx;
}
