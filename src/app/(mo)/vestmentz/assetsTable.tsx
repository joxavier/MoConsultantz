'use client';

import React from "react";
import Link from "next/link";
import { useReserveConfig } from "./useReserveConfig";

// Target weights for each Strategic Reserve asset (MoCoin holders), or the
// held assets without targets (everyone else). Live values and current
// weights are on the full Strategic Reserve dashboard.
export default function AssetsTable() {
  const { config } = useReserveConfig();
  const showTargets = Boolean(config?.targetsVisible);
  const assets = (config?.assets ?? []).filter((asset) => !showTargets || asset.targetAllocation > 0);

  return (
    <div className="mt-8 w-full text-left">
      <ul className="divide-y divide-white/10">
        {assets.map((asset) => (
          <li key={asset.symbol} className="flex items-center justify-between gap-4 py-3">
            <div className="min-w-0">
              <div className="truncate font-medium">{asset.symbol}</div>
              <div className="truncate text-sm text-gray-400">{asset.category}</div>
            </div>
            {showTargets && <div className="shrink-0 tabular-nums">{asset.targetAllocation.toFixed(2)}%</div>}
          </li>
        ))}
      </ul>
      <div className="mt-6 text-center">
        <Link
          href="/vestmentz/mocoin/strategicReserve"
          className="inline-block rounded-full bg-gradient-to-r from-[#3ca5de] to-[#8743f7] px-6 py-3 text-sm font-semibold text-white"
        >
          View live Strategic Reserve
        </Link>
      </div>
    </div>
  );
}
