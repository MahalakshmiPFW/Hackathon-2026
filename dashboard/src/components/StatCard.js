import React from "react";
import { motion } from "framer-motion";

export default function StatCard({ title, value, icon: Icon, color, trend }) {
  const trendIsPositive = typeof trend === "string" && trend.includes("+");
  const trendClass = trendIsPositive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between group hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
          <Icon size={22} className={color.replace("bg-", "text-")} />
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${trendClass}`}>{trend}</span>
      </div>

      <div className="mt-4">
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      </div>
    </motion.div>
  );
}

