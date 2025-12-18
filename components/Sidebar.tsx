
import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  // Fixed: Ensure all referenced AppView members exist on the enum type
  const items = [
    { id: AppView.DASHBOARD, label: 'Studio Home', icon: '🏠' },
    { id: AppView.IMAGE, label: 'Image Creator', icon: '🎨' },
    { id: AppView.VIDEO, label: 'Veo Video Lab', icon: '🎬' },
    { id: AppView.VOICE, label: 'Live Assistant', icon: '🎙️' },
    { id: AppView.SEARCH, label: 'Grounding Search', icon: '🔍' },
  ];

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-screen fixed left-0 top-0 z-20">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
          Aetheris Studio
        </h1>
        <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-semibold">Gemini Powered</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
              currentView === item.id
                ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
            }`}
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800 text-center">
        <p className="text-[10px] text-gray-600">v2.5 Gemini Engine</p>
      </div>
    </aside>
  );
};

export default Sidebar;
