import React, { useState } from "react";
import { Activity, Wind, Zap } from "lucide-react";

import { DATA } from "../data/smartCityMockData";
import CitySidebar from "../components/CitySidebar";
import StatCard from "../components/StatCard";
import CityMapPanel from "../components/CityMapPanel";
import AIAnalysisPanel from "../components/AIAnalysisPanel";
import TrafficFlowChart from "../components/TrafficFlowChart";

export default function UrbanIntelligenceDashboard() {
  const [mode, setMode] = useState("Morning");
  const [loading, setLoading] = useState(false);

  // Simulates a short "simulation" loading state.
  const runSim = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      <CitySidebar />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Urban Intelligence Dashboard</h1>
            <p className="text-slate-500 text-sm flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              Live simulation: {mode} Cycle
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-white p-1 rounded-xl shadow-sm border border-slate-100">
            {["Morning", "Afternoon", "Evening"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  mode === m
                    ? "bg-slate-100 text-blue-600 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Traffic Velocity"
            value={`${DATA[mode].traffic} mph`}
            icon={Activity}
            color="bg-blue-500"
            trend={DATA[mode].trend}
          />
          <StatCard
            title="Air Quality Index"
            value={DATA[mode].pollution}
            icon={Wind}
            color="bg-emerald-500"
            trend="-2.4%"
          />
          <StatCard
            title="Grid Load"
            value={DATA[mode].energy}
            icon={Zap}
            color="bg-amber-500"
            trend="+0.8%"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <CityMapPanel />
          <AIAnalysisPanel insights={DATA[mode].insights} loading={loading} onRun={runSim} />
        </div>

        <TrafficFlowChart data={DATA[mode].chart} />
      </main>
    </div>
  );
}

