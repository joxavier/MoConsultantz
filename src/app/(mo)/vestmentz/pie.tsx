'use client';

import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import Link from "next/link";
import { useReserveConfig } from "./useReserveConfig";

const CATEGORY_COLORS = ["#3ca5de", "#8743f7", "#f59e0b", "#10b981", "#ec4899", "#06b6d4"];

// Target allocation of the MoCoin Strategic Reserve by category, from the
// same holdings the Strategic Reserve dashboard uses. Targets are for MoCoin
// holders only.
export default function PieComponent() {
  const { config, failed } = useReserveConfig();
  if (failed) return <p className="text-sm text-gray-400">The reserve&apos;s allocation couldn&apos;t be loaded right now.</p>;
  if (!config) return <div className="mx-auto h-64 w-full max-w-xs animate-pulse rounded-full bg-white/5" />;
  if (!config.targetsVisible) {
    return (
      <p className="mx-auto max-w-sm text-sm text-gray-400">
        Target allocations are for MoCoin holders.{" "}
        <Link href="/vestmentz/mocoin/strategicReserve" className="font-semibold text-[#3ca5de]">
          Sign in on the Strategic Reserve
        </Link>{" "}
        with a wallet that holds MoCoin to see them.
      </p>
    );
  }

  const totals = new Map<string, number>();
  config.assets.forEach((asset) => {
    totals.set(asset.category, (totals.get(asset.category) || 0) + asset.targetAllocation);
  });
  const data = Array.from(totals, ([name, value]) => ({ name, value })).filter((entry) => entry.value > 0);

  return (
    <div className="w-full">
      <div className="mx-auto h-64 w-full max-w-xs">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius="60%" outerRadius="100%" paddingAngle={2} stroke="none">
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: any, name: any) => [`${Number(value).toFixed(2)}%`, name]} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="mx-auto mt-4 max-w-sm space-y-2 text-left text-sm">
        {data.map((entry, index) => (
          <li key={entry.name} className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }} />
            <span className="flex-1">{entry.name}</span>
            <span className="tabular-nums">{entry.value.toFixed(1)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
