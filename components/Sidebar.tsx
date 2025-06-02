
import React from 'react';
import { AppView } from '../types.ts';
import { DashboardIcon, InventoryIcon, SalesIcon, ExpensesIcon } from '../constants.tsx';

interface SidebarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const navItems = [
    { view: AppView.DASHBOARD, label: 'Dashboard', icon: DashboardIcon },
    { view: AppView.INVENTORY, label: 'Estoque', icon: InventoryIcon },
    { view: AppView.SALES, label: 'Vendas', icon: SalesIcon },
    { view: AppView.EXPENSES, label: 'Despesas', icon: ExpensesIcon },
  ];

  return (
    <div className="w-64 bg-slate-800 p-4 space-y-4 flex flex-col h-full fixed top-0 left-0">
      <h1 className="text-3xl font-bold text-emerald-400 mb-6 text-center">Gestor<span className="text-slate-300">Lite</span></h1>
      <nav className="flex-grow">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setCurrentView(item.view)}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200
                        ${currentView === item.view
                          ? 'bg-emerald-500 text-white shadow-md'
                          : 'hover:bg-slate-700 text-slate-300'
                        }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="text-xs text-slate-500 text-center mt-auto">
        © {new Date().getFullYear()} GestorLite
      </div>
    </div>
  );
};

export default Sidebar;
