"use client";

import { useState } from "react";
import SecurityTab from "./SecurityTab";
//import SalesTab from "./SalesTab";
//import OperationsTab from "./OperationsTab";
//import MarketingTab from "./MarketingTab";

//const tabs = ["Security", "Sales", "Operations", "Marketing"];

const tabs = ["Security"];

export default function OrgDashboard({ params }: { params: { org: string } }) {
  const { org } = params;
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case "Security":
        return <SecurityTab />;
      /*case "Sales":
        return <SalesTab org={org} />;
      case "Operations":
        return <OperationsTab org={org} />;
      case "Marketing":
        return <MarketingTab org={org} />;
      default:
        return null;*/
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-4">
        {org.charAt(0).toUpperCase() + org.slice(1)} Dashboard
      </h1>

      <div className="flex space-x-4 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md ${
              activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-6 border rounded-lg bg-gray-50">
        {renderActiveTab()}
      </div>
    </div>
  );
}
