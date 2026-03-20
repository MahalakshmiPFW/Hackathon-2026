import React from "react";

export default function SidebarItem({ icon: Icon, label, active = false }) {
  return (
    <div
      className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all ${
        active ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-slate-500 hover:bg-slate-50"
      }`}
    >
      <Icon size={20} />
      <span className="font-medium text-sm">{label}</span>
    </div>
  );
}

