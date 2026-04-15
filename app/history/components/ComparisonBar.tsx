"use client";
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export type StandardRange = { min: number | null; max: number | null };
export type MetricPoint = { label: string; current: number | null; standard: number | null | StandardRange };

interface Props { metrics: MetricPoint[]; height?: number | string }

const ComparisonBar: React.FC<Props> = ({ metrics, height = 220 }) => {

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false},
      
    },
    scales: {
      x: { beginAtZero: true, grid: { display: false }, ticks: { precision: 0 } },
      y: { display: false },
    },
  };

  const fmtVal = (v: number | null) => (v == null || Number.isNaN(Number(v)) ? NaN : v);
  const fmtRange = (r: number | null | StandardRange) => {
    if (r == null) return { min: NaN, max: NaN, single: NaN };
    if (typeof r === 'number') return { min: fmtVal(r), max: fmtVal(r), single: fmtVal(r) };
    return { min: fmtVal((r as StandardRange).min), max: fmtVal((r as StandardRange).max), single: NaN };
  };

  return (
    <div style={{ height }}>
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(140px, 1fr))` }}>
        {metrics
          .map((m) => ({ m, range: fmtRange(m.standard), current: fmtVal(m.current) }))
          .filter(({ range, current }) => !(Number.isNaN(range.min) && Number.isNaN(range.max) && Number.isNaN(current)) && current !== 0)
          .map(({ m, range, current }, i) => {
            const hasRange = !(Number.isNaN(range.min) && Number.isNaN(range.max));
            const datasets: any[] = [];

            if (hasRange) {
              // show min as semi-transparent, max as filled, to indicate range
              //low high current
              if(current > range.max! && current > range.min!){
                if(range.min! <= 0){
              datasets.push({ label: 'Std Max', data: [Number.isNaN(range.max as number) ? null : range.max], backgroundColor: 'rgba(0, 51, 255, 0.7)', borderColor: 'rgba(96,165,250,0.9)', borderWidth: 1 });
              datasets.push({ label: 'Current', data: [Number.isNaN(current as number) ? null : current], backgroundColor: 'rgba(255, 0, 17, 0.9)', borderColor: 'rgba(6,182,212,1)', borderWidth: 1 });

                }
                else{
              datasets.push({ label: 'Std Min', data: [Number.isNaN(range.min as number) ? null : range.min], backgroundColor: 'rgba(0, 55, 255, 0.5)', borderColor: 'rgba(96,165,250,0.28)', borderWidth: 0 });
              datasets.push({ label: 'Std Max', data: [Number.isNaN(range.max as number) ? null : range.max], backgroundColor: 'rgba(0, 51, 255, 0.7)', borderColor: 'rgba(96,165,250,0.9)', borderWidth: 1 });
              datasets.push({ label: 'Current', data: [Number.isNaN(current as number) ? null : current], backgroundColor: 'rgba(255, 0, 17, 0.9)', borderColor: 'rgba(6,182,212,1)', borderWidth: 1 });
             
                }
              }
              //current low high
              else if(current < range.min! && current < range.max!){
                
              datasets.push({ label: 'Current', data: [Number.isNaN(current as number) ? null : current], backgroundColor: 'rgba(255, 0, 17, 0.9)', borderColor: 'rgba(6,182,212,1)', borderWidth: 1 });
              datasets.push({ label: 'Std Min', data: [Number.isNaN(range.min as number) ? null : range.min], backgroundColor: 'rgba(0, 55, 255, 0.5)', borderColor: 'rgba(96,165,250,0.28)', borderWidth: 0 });
              datasets.push({ label: 'Std Max', data: [Number.isNaN(range.max as number) ? null : range.max], backgroundColor: 'rgba(0, 51, 255, 0.7)', borderColor: 'rgba(96,165,250,0.9)', borderWidth: 1 });

              }
              //low current high
              else{
                if(range.min! <= 0){
               datasets.push({ label: 'Current', data: [Number.isNaN(current as number) ? null : current], backgroundColor: '#008A29', borderColor: 'rgba(6,182,212,1)', borderWidth: 1 });
              datasets.push({ label: 'Std Max', data: [Number.isNaN(range.max as number) ? null : range.max], backgroundColor: 'rgba(0, 51, 255, 0.7)', borderColor: 'rgba(96,165,250,0.9)', borderWidth: 1 });

                }
              else {
                
              datasets.push({ label: 'Std Min', data: [Number.isNaN(range.min as number) ? null : range.min], backgroundColor: 'rgba(0, 55, 255, 0.5)', borderColor: 'rgba(96,165,250,0.28)', borderWidth: 0 });
              datasets.push({ label: 'Current', data: [Number.isNaN(current as number) ? null : current], backgroundColor: '#008A29', borderColor: 'rgba(6,182,212,1)', borderWidth: 1 });              
              datasets.push({ label: 'Std Max', data: [Number.isNaN(range.max as number) ? null : range.max], backgroundColor: 'rgba(0, 51, 255, 0.7)', borderColor: 'rgba(96,165,250,0.9)', borderWidth: 1 });
                     } 
                          }
            } else if (!Number.isNaN(range.single as number)) {
              datasets.push({ label: 'Standard', data: [range.single], backgroundColor: 'rgba(0, 108, 250, 0.9)', borderColor: 'rgba(96,165,250,0.9)', borderWidth: 1 });
            }


            const data = { labels: [m.label], datasets };

            const stdLabel = hasRange
              ? (Number.isNaN(range.min as number) ? (Number.isNaN(range.max as number) ? '-' : `<=${range.max}`) : (Number.isNaN(range.max as number) ? `>=${range.min}` : `${range.min}-${range.max}`))
              : (Number.isNaN(range.single as number) ? '-' : String(range.single));

            return (
              <div key={i} className="bg-white p-2 rounded shadow-sm">
                <div style={{ height: 120 }}>
                  <Bar options={barOptions} data={data} />
                </div>
                <div className="mt-2 text-xs text-center text-slate-700">
                  <div className="flex justify-center gap-3 text-[11px] mt-1">
                    <div>Std: {stdLabel}</div>
                    <div>Cur: {Number.isNaN(current as number) ? '-' : String(current)}</div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ComparisonBar;
