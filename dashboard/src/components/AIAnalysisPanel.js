import React from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

export default function AIAnalysisPanel({ insights, loading, onRun }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex-1">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">AI Analysis</h3>

        <div className="space-y-4">
          {insights.map((insight, i) => (
            <motion.div
              key={insight}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-3 items-start"
            >
              <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 shrink-0" />
              <p className="text-sm text-slate-600 font-medium leading-tight">{insight}</p>
            </motion.div>
          ))}
        </div>

        <button
          onClick={onRun}
          disabled={loading}
          className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Play size={18} fill="currentColor" /> Re-Run Simulation
            </>
          )}
        </button>
      </div>
    </div>
  );
}

