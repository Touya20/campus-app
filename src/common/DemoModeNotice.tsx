import { useSyncExternalStore } from 'react';
import { DemoBanner } from './DemoBanner';
import { isDemoModeActive, subscribeDemoMode } from '../demo/data';

export function DemoModeNotice() {
  const active = useSyncExternalStore(subscribeDemoMode, isDemoModeActive, () => false);
  return active ? <DemoBanner /> : null;
}
