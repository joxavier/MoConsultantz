"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const organizations = ["Metaparlour", "RedCross", "ABC Bank"];

export default function DemoPage() {
  const router = useRouter();
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);

  const handleProceed = () => {
    if (selectedOrg) {
      // Navigate to org-specific dashboard
      router.push(`/demo/${selectedOrg.toLowerCase()}`);
    }
  };

  return (
    <div className="p-10 max-w-lg mx-auto">
      <h1 className="text-4xl font-bold mb-6">Select Your Organization</h1>
      <p className="mb-4">Choose the organization you want to demo:</p>

      <ul className="space-y-2">
        {organizations.map((org) => (
          <li key={org}>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="organization"
                value={org}
                checked={selectedOrg === org}
                onChange={() => setSelectedOrg(org)}
                className="accent-blue-600"
              />
              <span>{org}</span>
            </label>
          </li>
        ))}
      </ul>

      <button
        disabled={!selectedOrg}
        onClick={handleProceed}
        className={`mt-6 px-6 py-3 rounded-lg text-white ${
          selectedOrg ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Proceed
      </button>
    </div>
  );
}
