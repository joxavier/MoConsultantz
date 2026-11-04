'use client';

import { useEffect, useState } from 'react';
import type { AssetConfig } from '@/lib/treasury/types';

// The Strategic Reserve holdings from /api/treasury/config (the Google Sheet).
// Targets are only included for signed-in MoCoin holders.
export type ReserveConfig = { holdingsAsOf: string; assets: AssetConfig[]; targetsVisible: boolean };

export function useReserveConfig() {
  const [config, setConfig] = useState<ReserveConfig | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let cancelled = false;
    fetch('/api/treasury/config', { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: ReserveConfig) => !cancelled && setConfig(data))
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, []);
  return { config, failed };
}
