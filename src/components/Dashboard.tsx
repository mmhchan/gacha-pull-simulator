import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label } from 'recharts';

export const Dashboard = ({ pdfData, cdfData, userSavings, softPity, hardPity }: { pdfData: any[], cdfData: any[], userSavings: number, softPity: number, hardPity: number }) => {
  const [view, setView] = useState<'PDF' | 'CDF'>('PDF');
  const activeData = view === 'PDF' ? pdfData : cdfData;
  const dataKey = view === 'PDF' ? 'count' : 'probability';
  const maxChartPull = pdfData[pdfData.length - 1]?.pullCount || 180;
  const clampedMarkerPos = Math.min(userSavings, maxChartPull);
  const savingsDataPoint = cdfData.find(d => d.pullCount === Math.floor(clampedMarkerPos));
  const currentProbability = savingsDataPoint ? savingsDataPoint.probability.toFixed(1) : "0.0";

  // Find the hard pity cap based on the simulation results
  const maxPull = activeData.length > 0 ? activeData[activeData.length - 1].pullCount : 0;

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
              className={`px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 ${view === type
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
            <AreaChart data={activeData} margin={{ top: 30, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f4f1" />
              <XAxis
                dataKey="pullCount"
                fontSize={11}
                tick={{ fill: '#8a9a8d' }}
                axisLine={{ stroke: '#dce3de' }}
                type="number"
                domain={[0, 'dataMax']}
                ticks={generateTicks()}
                height={50}
              >
                <Label
                  value="Number of Pulls"
                  position="insideBottom"
                  offset={0}
                  fill="#8a9a8d"
                  fontSize={11}
                  fontWeight="bold"
                />
              </XAxis>

              <YAxis
                fontSize={11}
                tick={{ fill: '#8a9a8d' }}
                axisLine={false}
                tickFormatter={(val) => (view === 'CDF' ? `${val}%` : val)}
                width={60}
              >
                <Label
                  value={view === 'PDF' ? "Number of Samples" : "Success Probability"}
                  position="top"
                  offset={15}
                  style={{ 
                    textAnchor: 'start', 
                    fill: '#8a9a8d', 
                    fontSize: '10px', 
                    fontWeight: 'bold',
                    letterSpacing: '0.05em' 
                  }}
                />
              </YAxis>

              {/* Savings Marker */}
              <ReferenceLine
                x={clampedMarkerPos}
                stroke={userSavings >= maxChartPull ? '#059669' : '#1a2a1e'}
                strokeDasharray="3 3"
                strokeOpacity={userSavings >= maxChartPull ? 0.3 : 0.5}
              >
                {/* Only show labels if the user is below the 100% guarantee threshold */}
                {userSavings < maxChartPull && (
                  <>
                    <Label
                      value={`SUCCESS = ${currentProbability}%`}
                      position="top"
                      offset={20}
                      fill="#1a2a1e"
                      fontSize={10}
                      fontWeight="600"
                      fillOpacity={0.9}
                      /* Keep the truncation fix logic here */
                      textAnchor={clampedMarkerPos < 40 ? "start" : "middle"}
                      dx={clampedMarkerPos < 40 ? 5 : 0}
                    />

                    <Label
                      value="▼"
                      position="top"
                      offset={5}
                      fill="#1a2a1e"
                      fillOpacity={0.7}
                      fontSize={12}
                      textAnchor="middle"
                    />
                  </>
                )}
              </ReferenceLine>

              {/* Soft Pity Marker */}
              <ReferenceLine
                x={softPity}
                stroke="#4a5d4e"
                strokeDasharray="3 3"
                strokeOpacity={0.3}
                strokeWidth={1}
              >
                <Label
                  value="SOFT PITY"
                  position="top"
                  fill="#4a5d4e"
                  fillOpacity={0.8}
                  fontSize={10}
                  fontWeight="bold"
                  offset={20}
                />
                <Label
                  value="▼"
                  position="top"
                  fill="#4a5d4e"
                  fillOpacity={0.6}
                  fontSize={12}
                  offset={5}
                />
              </ReferenceLine>

              {/* Hard Pity Marker */}
              <ReferenceLine
                x={hardPity}
                stroke="#4a5d4e"
                strokeDasharray="3 3"
                strokeOpacity={0.3}
                strokeWidth={1}
              >
                <Label
                  value="HARD PITY"
                  position="top"
                  fill="#4a5d4e"
                  fillOpacity={0.8}
                  fontSize={10}
                  fontWeight="bold"
                  offset={20}
                />
                <Label
                  value="▼"
                  position="top"
                  fill="#4a5d4e"
                  fillOpacity={0.6}
                  fontSize={12}
                  offset={5}
                />
              </ReferenceLine>

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