import React from "react";
import { Zap, LayoutDashboard, Map as MapIcon, Activity, Bell, Settings } from "lucide-react";

import SidebarItem from "./SidebarItem";

export default function CitySidebar() {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 p-6 hidden lg:flex flex-col">
      <div className="flex items-center space-x-2 mb-10 px-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Zap size={18} className="text-white" fill="currentColor" />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-800">SmartCity</span>
      </div>

      <nav className="space-y-2 flex-1">
        <SidebarItem icon={LayoutDashboard} label="Overview" active />
        <SidebarItem icon={MapIcon} label="Urban Map" />
        <SidebarItem icon={Activity} label="Sensor Grid" />
        <SidebarItem icon={Bell} label="Alerts" />
        <SidebarItem icon={Settings} label="Configuration" />
      </nav>

      <div className="bg-slate-900 rounded-2xl p-4 mt-auto">
        <p className="text-slate-400 text-xs mb-2">System Status</p>
        <div className="flex items-center space-x-2 text-white">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium">All Nodes Online</span>
        </div>
      </div>
    </aside>
  );
}

