import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export const Dashboard = ({ pdfData, cdfData, userSavings }: { pdfData: any[], cdfData: any[], userSavings: number }) => {
  const [view, setView] = useState<'PDF' | 'CDF'>('PDF');
  const activeData = view === 'PDF' ? pdfData : cdfData;
  const dataKey = view === 'PDF' ? 'count' : 'probability';

  // Find the hard pity cap based on the simulation results
  const maxPull = activeData.length > 0 ? activeData[activeData.length - 1].pullCount : 0;

  // Keep the reference line within chart boundaries
  const cappedSavingsPos = Math.min(userSavings, maxPull);

  // Dynamic grid ticks based on data scale
  const generateTicks = () => {
    if (activeData.length === 0) return [];
    const interval = maxPull <= 150 ? 10 : 20;
    const ticks = [];
    for (let i = 0; i <= maxPull; i += interval) {
      ticks.push(i);
    }
    if (ticks[ticks.length - 1] !== maxPull) {
      ticks.push(maxPull);
    }
    return ticks;
  };

  return (
    <div className="bg-white rounded-lg border border-[#dce3de] shadow-sm overflow-hidden">
      <div className="bg-[#f8faf9] px-4 border-b border-[#dce3de] flex justify-between items-center">
        <div className="flex">
          {['PDF', 'CDF'].map((type) => (
            <button
              key={type}
              onClick={() => setView(type as any)}
              className={`px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 ${
                view === type 
                ? 'border-[#4a5d4e] text-[#4a5d4e]' 
                : 'border-transparent text-[#8a9a8d] hover:text-[#4a5d4e]'
              }`}
            >
              {type === 'PDF' ? 'Probability Density' : 'Cumulative Success'}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activeData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f4f1" />
              <XAxis 
                dataKey="pullCount" 
                fontSize={11} 
                tick={{fill: '#8a9a8d'}} 
                axisLine={{stroke: '#dce3de'}} 
                type="number" 
                domain={[0, 'dataMax']} 
                ticks={generateTicks()}
              />
              <YAxis 
                fontSize={11} 
                tick={{fill: '#8a9a8d'}} 
                axisLine={false} 
                tickFormatter={(val) => view === 'CDF' ? `${val}%` : val}
              />
              <Tooltip 
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #dce3de', fontSize: '12px' }}
              labelFormatter={(label) => `Successful Pull: ${label}`}
              formatter={(value: any) => {
                if (value === undefined || value === null) return [0, ""];
                const formattedValue = view === 'CDF' ? `${Number(value).toFixed(1)}%` : value;
                const labelText = view === 'PDF' ? 'Frequency' : 'Probability';
                return [formattedValue, labelText];
              }}
            />
              
              {/* Savings Marker: Green if user is already at 100% success */}
              <ReferenceLine 
                x={cappedSavingsPos} 
                stroke={userSavings >= maxPull ? '#059669' : '#1a2a1e'} 
                strokeDasharray="3 3" 
                label={{ 
                  value: userSavings >= maxPull ? '100% GUARANTEED' : 'YOUR SAVINGS', 
                  position: 'top', 
                  fill: userSavings >= maxPull ? '#059669' : '#4a5d4e', 
                  fontSize: 10, 
                  fontWeight: 'bold' 
                }} 
              />

              <Area 
                type="linear" 
                dataKey={dataKey} 
                stroke="#4a5d4e" 
                fill="#4a5d4e" 
                fillOpacity={0.1} 
                strokeWidth={2}
                strokeLinejoin="round"
                animationDuration={500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};