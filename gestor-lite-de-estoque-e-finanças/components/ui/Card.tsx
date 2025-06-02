
import React from 'react';

interface CardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
  valueClassName?: string;
}

const Card: React.FC<CardProps> = ({ title, value, icon, className = '', valueClassName = '' }) => {
  return (
    <div className={`bg-slate-800 p-6 rounded-xl shadow-lg flex flex-col justify-between ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">{title}</h3>
        {icon && <span className="text-slate-500">{icon}</span>}
      </div>
      <p className={`text-3xl font-semibold text-emerald-400 ${valueClassName}`}>{value}</p>
    </div>
  );
};

export default Card;
    