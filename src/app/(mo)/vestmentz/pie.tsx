'use client';

import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import treasuryConfig from "@/data/treasuryConfig.json";

const CATEGORY_COLORS = ["#3ca5de", "#8743f7", "#f59e0b", "#10b981", "#ec4899", "#06b6d4"];

// Target allocation of the MoCoin Strategic Reserve by category, from the
// same config the Strategic Reserve dashboard uses.
export default function PieComponent() {
  const totals = new Map<string, number>();
  treasuryConfig.assets.forEach((asset) => {
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
