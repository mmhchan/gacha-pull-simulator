import type { SimParams } from '../types';
import { GAME_PRESETS } from '../presets';
import { Play, Settings2, BarChart3, ShieldCheck, Info } from 'lucide-react';
import Tooltip from './Tooltip';

interface ControlsProps {
  params: SimParams;
  setParams: (p: SimParams) => void;
  onSimulate: () => void;
}

export const Controls = ({ params, setParams, onSimulate }: ControlsProps) => {
  
  // Force state to 'Custom' if user tweaks any preset values
  const updateParam = (key: keyof SimParams, value: any) => {
    setParams({
      ...params,
      [key]: value,
      name: 'Custom'
    });
  };

  // Logic check: Sequence must be Soft < Hard <= Guarantee
  const isPityInvalid = params.softPityStart >= params.hardPity || params.hardPity > params.featuredGuarantee;

  return (
    <div className="bg-[#ffffff] p-6 rounded-lg border border-[#dce3de] space-y-6 shadow-sm">
      
      {/* Game Defaults */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-[10px] font-bold text-[#8a9a8d] uppercase tracking-widest">
          <Settings2 size={12} /> Game Presets
        </label>
        <select 
          className="w-full bg-[#f8faf9] text-[#2c3e50] p-2 rounded border border-[#dce3de] text-sm focus:ring-2 focus:ring-[#4a5d4e]/10 outline-none transition-all cursor-pointer"
          value={GAME_PRESETS.some(g => g.name === params.name) ? params.name : 'Custom'}
          onChange={(e) => {
            const selected = GAME_PRESETS.find(p => p.name === e.target.value);
            if (selected) setParams({ ...params, ...selected });
          }}
        >
          {GAME_PRESETS.map(game => (
            <option key={game.name} value={game.name}>{game.name}</option>
          ))}
          {!GAME_PRESETS.some(g => g.name === params.name) && (
            <option value="Custom">Custom Configuration</option>
          )}
        </select>
      </div>

      <div className="h-px bg-[#f0f4f1]" />

        {/* Global Rates & 50/50 Toggle */}
        <div className="space-y-4">
        <label className="flex items-center gap-2 text-[10px] font-bold text-[#8a9a8d] uppercase tracking-widest">
            <BarChart3 size={12} /> Rates & 50/50
        </label>
        
        {/* Pull #1 Base Rate */}
        <div className="space-y-2 group/tip relative">
            <div className="flex justify-between items-end">
            <span className="text-[11px] text-[#6a7a6d] font-medium flex items-center gap-1">
                Base Rate <Info size={10} className="opacity-50" />
            </span>
            <Tooltip text="Starting probability for a 6★ unit on pull #1, before any pity mechanics kick in." />
            <span className="text-sm font-mono font-bold text-[#4a5d4e]">{(params.baseRate * 100).toFixed(1)}%</span>
            </div>
            <input type="range" min="0.001" max="0.1" step="0.001" value={params.baseRate} onChange={(e) => updateParam('baseRate', Number(e.target.value))} className="w-full h-1.5 bg-[#eef2ef] rounded-lg appearance-none cursor-pointer accent-[#4a5d4e]" />
        </div>

        {/* Binary toggle for "Pity Fail" mechanic */}
        <div className="group/tip relative flex items-center justify-between p-3 bg-[#f8faf9] rounded border border-[#dce3de]">
            <span className="text-xs font-bold text-[#4a5d4e] uppercase tracking-tighter flex items-center gap-1">
            50/50 Rule <Info size={10} className="opacity-50" />
            </span>
            <Tooltip text="Initial 6★ has a 50% chance to be the featured unit. If you fail this roll, the next 6★ is guaranteed to be the featured unit." />
            <input type="checkbox" checked={params.hasFiftyFifty} onChange={(e) => updateParam('hasFiftyFifty', e.target.checked)} className="w-4 h-4 rounded border-[#dce3de] text-[#4a5d4e]" />
        </div>
        </div>

        {/* Pity Chain Thresholds - Validation rules apply here */}
        <div className="space-y-4 pt-2">
        <label className="flex items-center gap-2 text-[10px] font-bold text-[#8a9a8d] uppercase tracking-widest">
            <ShieldCheck size={12} /> Pity Chain
        </label>

        {/* Point where rates start climbing */}
        <div className="space-y-2 group/tip relative">
            <div className="flex justify-between items-end">
            <span className={`text-[11px] font-medium flex items-center gap-1 ${params.softPityStart >= params.hardPity ? 'text-red-500' : 'text-[#6a7a6d]'}`}>
                Soft Pity Start <Info size={10} className="opacity-50" />
            </span>
            <Tooltip text="The specific pull count after which the probability of finding a 6★ begins to escalate." />
            <span className="text-sm font-mono font-bold text-[#4a5d4e]">At {params.softPityStart} Pulls</span>
            </div>
            <input type="range" min="1" max="400" value={params.softPityStart} onChange={(e) => updateParam('softPityStart', Number(e.target.value))} className="w-full h-1.5 bg-[#eef2ef] rounded-lg appearance-none cursor-pointer accent-[#4a5d4e]" />
        </div>

        {/* Escalation percentage per pull */}
        <div className="space-y-2 group/tip relative">
            <div className="flex justify-between items-end">
            <span className="text-[11px] text-[#6a7a6d] font-medium flex items-center gap-1">
                Increase Per Pull <Info size={10} className="opacity-50" />
            </span>
            <Tooltip text="The percentage chance added to the base rate for every pull conducted after reaching the Soft Pity threshold." />
            <span className="text-sm font-mono font-bold text-[#4a5d4e]">{(params.softPityIncrement * 100).toFixed(1)}%</span>
            </div>
            <input type="range" min="0.005" max="0.2" step="0.005" value={params.softPityIncrement} onChange={(e) => updateParam('softPityIncrement', Number(e.target.value))} className="w-full h-1.5 bg-[#eef2ef] rounded-lg appearance-none cursor-pointer accent-[#4a5d4e]" />
        </div>
        </div>

        {/* Hard Ceilings */}
        <div className="space-y-4 pt-2">
        <label className="flex items-center gap-2 text-[10px] font-bold text-[#8a9a8d] uppercase tracking-widest">
            <ShieldCheck size={12} /> Safety Nets
        </label>

        {/* Absolute cap for a generic 6-star */}
        <div className="space-y-2 group/tip relative">
            <div className="flex justify-between items-end">
            <span className={`text-[11px] font-medium flex items-center gap-1 ${isPityInvalid ? 'text-red-500' : 'text-[#6a7a6d]'}`}>
                Hard Pity <Info size={10} className="opacity-50" />
            </span>
            <Tooltip text="The absolute maximum pulls allowed before a 6★ is forced. Note: The 50/50 Rule still applies to this guaranteed unit." />
            <span className="text-sm font-mono font-bold text-[#4a5d4e]">At {params.hardPity} Pulls</span>
            </div>
            <input type="range" min="1" max="400" value={params.hardPity} onChange={(e) => updateParam('hardPity', Number(e.target.value))} className="w-full h-1.5 bg-[#eef2ef] rounded-lg appearance-none cursor-pointer accent-[#4a5d4e]" />
        </div>

        {/* Absolute cap for the specific banner unit */}
        <div className="space-y-2 group/tip relative">
            <div className="flex justify-between items-end">
            <span className={`text-[11px] font-medium flex items-center gap-1 ${params.hardPity > params.featuredGuarantee ? 'text-red-500' : 'text-[#6a7a6d]'}`}>
                Featured Guarantee <Info size={10} className="opacity-50" />
            </span>
            <Tooltip text="The total cumulative pulls required to guarantee the specific featured character, accounting for failed 50/50 results." />
            <span className="text-sm font-mono font-bold text-[#4a5d4e]">At {params.featuredGuarantee} Pulls</span>
            </div>
            <input type="range" min="1" max="400" value={params.featuredGuarantee} onChange={(e) => updateParam('featuredGuarantee', Number(e.target.value))} className="w-full h-1.5 bg-[#eef2ef] rounded-lg appearance-none cursor-pointer accent-[#4a5d4e]" />
        </div>
        </div>

      {/* Sim Scale */}
      <div className="space-y-3 border-t border-[#dce3de] pt-4">
        <label className="text-[10px] font-bold text-[#8a9a8d] uppercase tracking-widest">Sample Size</label>
        <div className="flex gap-2">
          {[1000, 10000, 50000].map(val => (
            <button
              key={val}
              onClick={() => updateParam('simCount', val)}
              className={`flex-1 py-1.5 text-[10px] font-bold rounded border transition-all ${
                params.simCount === val 
                ? 'bg-[#4a5d4e] border-[#4a5d4e] text-white' 
                : 'bg-white border-[#dce3de] text-[#8a9a8d] hover:border-[#4a5d4e]'
              }`}
            >
              {val / 1000}K
            </button>
          ))}
        </div>
      </div>

      <button 
        onClick={onSimulate}
        className="w-full bg-[#4a5d4e] hover:bg-[#3a4d3e] text-white font-bold py-3.5 rounded text-[11px] tracking-[0.2em] flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
      >
        <Play size={14} fill="white" /> SIMULATE
      </button>

    </div>
  );
};