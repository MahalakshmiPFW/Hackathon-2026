import React from "react";
import { motion } from "framer-motion";
import { Map as MapIcon } from "lucide-react";

export default function CityMapPanel() {
  return (
    <div className="lg:col-span-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 min-h-[400px] relative overflow-hidden">
      <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full border border-slate-200 flex items-center gap-2 text-xs font-bold">
        <MapIcon size={14} className="text-blue-500" /> LIVE SPATIAL VIEW
      </div>

      <div className="w-full h-full bg-[#E2E8F0] rounded-xl relative overflow-hidden flex items-center justify-center border border-slate-200">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute top-1/4 left-1/3 w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-lg"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-rose-500 rounded-full border-4 border-white shadow-lg"
        />

        <div className="text-slate-400 text-sm font-mono uppercase tracking-widest italic opacity-50">
          Rendering GeoJSON Layer...
        </div>
      </div>
    </div>
  );
}

