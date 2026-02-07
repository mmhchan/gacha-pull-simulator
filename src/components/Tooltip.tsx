import React from 'react';

interface TooltipProps {
  text: string;
  position?: 'right' | 'bottom' | 'top';
}

const Tooltip: React.FC<TooltipProps> = ({ text, position = 'right' }) => {
  const positions = {
    right: "left-[calc(100%+1rem)] top-0",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2"
  };

  return (
    <span className={`invisible group-hover/tip:visible absolute z-50 w-72 rounded border border-[#dce3de] bg-white px-3 py-2 text-xs font-medium leading-relaxed text-[#1a2a1e] shadow-xl opacity-0 transition-opacity duration-200 group-hover/tip:opacity-100 ${positions[position]}`}>
      {text}
    </span>
  );
};

export default Tooltip;