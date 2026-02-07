import React from 'react';
import { Info } from 'lucide-react';
import Tooltip from './Tooltip';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  color?: string;
  tooltip: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, subValue, color = "text-[#4a5d4e]", tooltip }) => (
  <div className="bg-white p-4 border border-[#dce3de] rounded shadow-sm group/tip relative flex flex-col items-center">
    <p className="text-[10px] font-bold text-[#8a9a8d] uppercase tracking-wider mb-1 flex items-center justify-center gap-1 w-full text-center">
      {label} <Info size={10} className="opacity-50" />
    </p>
    
    <p className={`text-2xl font-medium tracking-tight ${color} text-center`}>
      {value}
    </p>
    
    {subValue && (
      <p className="text-[12px] mt-1 text-[#8a9a8d] font-mono text-center">
        {subValue}
      </p>
    )}

    <Tooltip text={tooltip} position="bottom" />
  </div>
);