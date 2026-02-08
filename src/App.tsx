import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Linkedin, Github } from 'lucide-react';
import { runMonteCarlo, formatDataForChart } from './simulationLogic';
import { Dashboard } from './components/Dashboard';
import { Controls } from './components/Controls';
import { StatCard } from './components/StatCard';
import { GAME_PRESETS } from './presets';
import type { SimParams } from './types';
import Tooltip from './components/Tooltip';

interface AppStats {
  avg: number;
  max: number;
  min: number;
  guaranteeRate: number; // % of runs hitting the absolute floor
  currentConfidence: number; // Probability based on user's current stash
  avgCost: number; 
  maxCost: number; 
}

function App() {
  const [params, setParams] = useState<SimParams>({
    ...GAME_PRESETS[0],
    simCount: 10000
  });

  const [costPerPull, setCostPerPull] = useState<number>(1.11);
  const [chartData, setChartData] = useState<{ pullCount: number; count: number }[]>([]);
  const [cumulativeData, setCumulativeData] = useState<any[]>([]); 
  const [stats, setStats] = useState<AppStats | null>(null);
  const [rawResults, setRawResults] = useState<number[]>([]);
  const [userSavings, setUserSavings] = useState<number>(120);
  const [isRulesOpen, setIsRulesOpen] = useState(false); 
  
  // Recalculate stats whenever stash or pull costs change
  useEffect(() => {
    if (rawResults.length > 0 && stats) {
      const successCount = rawResults.filter(p => p <= userSavings).length;
      const probability = Number(((successCount / rawResults.length) * 100).toFixed(1));
      
      setStats(prev => prev ? { 
        ...prev, 
        currentConfidence: probability,
        avgCost: Number((prev.avg * costPerPull).toFixed(2)),
        maxCost: Number((prev.max * costPerPull).toFixed(2))
      } : null);
    }
  }, [userSavings, costPerPull, rawResults]);

  const handleSimulate = () => {
    const simData = runMonteCarlo(params);
    const pullCounts = simData.map(r => r.pulls);
    
    // Check hit rate for the absolute hard ceiling
    const guaranteeCount = simData.filter(r => r.wonAtGuarantee).length;
    const guaranteeRate = Number(((guaranteeCount / params.simCount) * 100).toFixed(1));
    const pdfData = formatDataForChart(pullCounts);

    // Build Success Probability (CDF) curve
    let runningTotal = 0;
    const cdfData = pdfData.map(point => {
      runningTotal += point.count;
      return {
        pullCount: point.pullCount,
        probability: Number(((runningTotal / params.simCount) * 100).toFixed(2))
      };
    });

    const avgPulls = pullCounts.reduce((a, b) => a + b, 0) / pullCounts.length;
    const maxPulls = Math.max(...pullCounts);

    setRawResults(pullCounts);
    setChartData(pdfData);
    setCumulativeData(cdfData);
    setStats({
      avg: Number(avgPulls.toFixed(1)),
      max: maxPulls,
      min: Math.min(...pullCounts),
      guaranteeRate,
      currentConfidence: Number(((pullCounts.filter(p => p <= userSavings).length / params.simCount) * 100).toFixed(1)),
      avgCost: Number((avgPulls * costPerPull).toFixed(2)),
      maxCost: Number((maxPulls * costPerPull).toFixed(2))
    });
  };

  return (
    <div className="min-h-screen bg-[#f3f7f4] text-[#2c3e50] p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6 border-b-2 border-[#dce3de] pb-4">
          <h1 className="text-2xl font-bold text-[#1a2a1e] flex items-center gap-2">
            🔮 Gacha Pull Simulator
          </h1>
          <p className="text-sm text-[#6a7a6d] mt-1 italic">Probability and cost analysis for obtaining a single copy of a featured banner character</p>
        </header>

        {/* Top-Level Instruction Expander */}
        <div className="mb-8 overflow-hidden rounded-lg border border-[#dce3de] bg-white shadow-sm transition-all">
          <button 
            onClick={() => setIsRulesOpen(!isRulesOpen)}
            className="flex w-full items-center justify-between p-4 hover:bg-[#f8faf9] transition-colors"
          >
            <div className="flex items-center gap-2 text-[#4a5d4e]">
              <BookOpen size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">How to configure the Pity Logic</span>
            </div>
            {isRulesOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          
          {isRulesOpen && (
            <div className="p-6 border-t border-[#f0f4f1] bg-[#fcfdfc] animate-in slide-in-from-top-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-[#8a9a8d] uppercase tracking-tighter">The Golden Rule</h4>
                  <p className="text-xs text-[#4a5d4e] leading-relaxed">
                    Values must follow this sequence for a valid simulation:
                  </p>
                  <div className="mt-2 font-mono font-bold text-xs bg-white p-2 rounded border border-[#dce3de] text-[#1a2a1e]">
                    Soft &lt; Hard ≤ Featured Guarantee
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-[#8a9a8d] uppercase tracking-tighter">Definitions</h4>
                  <div className="text-xs text-[#6a7a6d] space-y-2 leading-relaxed">
                  <p>
                    <span className="font-bold text-[#4a5d4e]">Soft Pity: </span> 
                    The pull count where the 6★ rate begins to increase.
                  </p>
                  <p>
                    <span className="font-bold text-[#4a5d4e]">Hard Pity: </span> 
                    The pull count that guarantees a 6★ character.
                  </p>
                  <p>
                    <span className="font-bold text-[#4a5d4e] not-italic">Featured Guarantee: </span> 
                    The absolute worst-case fallback that guarantees the featured unit.
                  </p>
                  <p>
                    <span className="font-bold text-[#4a5d4e]">50/50 Rule: </span> 
                    If enabled, 50% chance that the Hard Pity does not give the featured character.
                  </p>
                </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-[#8a9a8d] uppercase tracking-tighter">Visual Cues</h4>
                  <p className="text-xs text-[#6a7a6d] leading-relaxed">
                    Labels in the sidebar turn <span className="text-red-500 font-bold underline decoration-red-200">red</span> if configuration breaks logical order.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Controls params={params} setParams={setParams} onSimulate={handleSimulate} />
            <CostAdjuster value={costPerPull} onChange={setCostPerPull} />
          </div>

          <div className="lg:col-span-3 space-y-6">
            {stats ? (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <StatCard label="Average Pulls" value={stats.avg} tooltip="Mean pulls across all iterations." />
                  <StatCard label="Luckiest" value={stats.min} color="text-emerald-600" tooltip="Best result in this batch." />
                  <StatCard label="Worst Case" value={stats.max} color="text-orange-700" tooltip="Maximum pulls recorded." />
                  <StatCard label="Guarantee Rate" value={`${stats.guaranteeRate}%`} color="text-amber-600" tooltip="Runs hitting the guarantee." />
                  <StatCard label="Market Value" value={`$${stats.avgCost}`} subValue={`Max: $${stats.maxCost}`} tooltip="Calculated USD cost based on pull volume." />
                </div>

                <div className="w-full">
                  <Dashboard pdfData={chartData} cdfData={cumulativeData} userSavings={userSavings} softPity={params.softPityStart} hardPity={params.hardPity} />
                </div>

                <SavingsConfidence results={rawResults} savings={userSavings} setSavings={setUserSavings} />

                <div className="w-full">
                  <PercentileTable results={rawResults} />
                </div>

                {/* Branding Footer: Centered under results */}
                <div className="pt-8 pb-4 flex flex-col items-center gap-3 border-t border-[#dce3de]/50">
                  <span className="text-[#6a7a6d] text-[11px] font-medium uppercase tracking-[0.1em]">Built by Michael Chan</span>
                  <div className="flex gap-6">
                    <a href="https://linkedin.com/in/mmhchan" target="_blank" rel="noopener noreferrer" className="text-[#0077b5] hover:opacity-70 transition-opacity">
                      <Linkedin size={20} fill="#0077b5" className="text-white" />
                    </a>
                    <a href="https://github.com/mmhchan" target="_blank" rel="noopener noreferrer" className="text-[#1a2a1e] hover:opacity-70 transition-opacity">
                      <Github size={20} />
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-96 flex flex-col items-center justify-center border-2 border-dashed border-[#dce3de] rounded-xl text-[#8a9a8d]">
                <p className="font-medium">Execute simulation to view probability density</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** * --- Local Sub-Components --- 
 */

// Live USD cost calculator
const CostAdjuster = ({ value, onChange }: { value: number, onChange: (v: number) => void }) => (
  <div className="bg-white p-4 rounded border border-[#dce3de] shadow-sm space-y-3 group/tip relative">
    <div className="flex justify-between items-center">
      <label className="text-[10px] font-bold text-[#8a9a8d] uppercase tracking-wider">
        Cost Per Pull (USD)
      </label>
      <Tooltip text="Cost of a single pull for market value calculation." />
      <span className="text-xs font-mono font-bold text-[#4a5d4e]">${value.toFixed(2)}</span>
    </div>
    <input 
      type="range" min="0.5" max="3.0" step="0.01"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1.5 bg-[#eef2ef] rounded-lg appearance-none cursor-pointer accent-[#4a5d4e]"
    />
  </div>
);

// Luck brackets (Top 10% vs Cursed)
const PercentileTable = ({ results }: { results: number[] }) => {
  const sorted = [...results].sort((a, b) => a - b);
  const getPercentile = (p: number) => sorted[Math.floor((sorted.length - 1) * p)];
  
  const percentiles = [
    { label: 'Top 10% (Insane Luck)', value: getPercentile(0.1) },
    { label: 'Top 25% (Lucky)', value: getPercentile(0.25) },
    { label: '50% (Average)', value: getPercentile(0.5) },
    { label: 'Bottom 25% (Unlucky)', value: getPercentile(0.75) },
    { label: 'Bottom 10% (Cursed)', value: getPercentile(0.9) },
  ];

  return (
    <div className="bg-white rounded border border-[#dce3de] shadow-sm overflow-hidden">
      <div className="bg-[#f8faf9] px-4 py-2 border-b border-[#dce3de]">
        <h3 className="text-[10px] font-bold text-[#4a5d4e] uppercase tracking-widest">Luck Distribution Table</h3>
      </div>
      <table className="w-full text-xs text-left">
        <tbody>
          {percentiles.map((p, i) => (
            <tr key={i} className="border-b border-[#f0f4f1] last:border-0 hover:bg-[#f8faf9] transition-colors">
              <td className="px-4 py-3 text-[#6a7a6d] font-medium">{p.label}</td>
              <td className="px-4 py-3 text-right font-mono font-bold text-[#4a5d4e]">{p.value} pulls</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Check success odds against available stash
const SavingsConfidence = ({ results, savings, setSavings }: { 
  results: number[], 
  savings: number, 
  setSavings: (v: number) => void 
}) => {
  const successCount = results.filter(r => r <= savings).length;
  const probability = results.length > 0 
    ? ((successCount / results.length) * 100).toFixed(1) 
    : "0.0";

  return (
    <div className="bg-white p-6 rounded-lg border border-[#dce3de] shadow-sm space-y-4">
      <div className="border-b border-[#f0f4f1] pb-3">
        <h3 className="text-[10px] font-bold text-[#4a5d4e] uppercase tracking-widest">Success Rate Based On Available Pulls</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <label className="text-[11px] font-bold text-[#8a9a8d] uppercase">Currently Available Pulls</label>
            <span className="text-sm font-mono font-bold text-[#4a5d4e]">{savings} Pulls</span>
          </div>
          <input 
            type="range" min="1" max="400" step="1"
            value={savings}
            onChange={(e) => setSavings(Number(e.target.value))}
            className="w-full h-1.5 bg-[#eef2ef] rounded-lg appearance-none cursor-pointer accent-[#4a5d4e]"
          />
        </div>
        <div className="flex flex-col items-center justify-center p-4 bg-[#f8faf9] rounded border border-[#dce3de]">
          <span className="text-[10px] font-bold text-[#8a9a8d] uppercase mb-1">Success Rate</span>
          <span className={`text-4xl font-semibold ${Number(probability) > 80 ? 'text-emerald-600' : 'text-[#4a5d4e]'}`}>
            {probability}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default App;