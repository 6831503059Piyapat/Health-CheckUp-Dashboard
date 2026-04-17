"use client"; 

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  Filler // Added Filler to make 'fill: true' work
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Toast } from "@heroui/react";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler 
);
import { useState,useEffect, useRef } from 'react';
import { color } from 'chart.js/helpers';
import { text } from 'stream/consumers';
interface Props {
  typeData?: string;
  isDanger?: boolean;
}
const ChartDashboard = ({typeData,isDanger}:any) => {
  
  const [dataFetch,setDataFetch] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timeRange, setTimeRange] = useState<'all'|'1y'|'3y'|'5y'>('all');
  
  useEffect(()=>{
    const token = localStorage.getItem("token");
    async function handleFetch(){
    try{
    setIsLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_PORT}/users/me`,
      {   
        headers:{
          'Content-Type':'application/json',
          'Authorization':`Bearer ${token}`
        }
      }
    );
    if(res.status === 401){ localStorage.removeItem('token'); return; }
    const data = await res.json();
    const records = Array.isArray(data.Data) ? data.Data : Array.isArray(data.data) ? data.data : [];
    if(res.ok && records.length > 0){
      const sortedData = [...records].sort((a, b) => {
        return new Date(a.dateFile).getTime() - new Date(b.dateFile).getTime();
      });
      setDataFetch(sortedData);
    }
    }finally{
      setIsLoading(false);
    }
  
  }
  handleFetch();
  
  },[]);
  const handleCategory = (select:string, records = dataFetch) =>{
    switch(select){
      case "Body Mass Index":   return records.map((item:any) => Number(item.bmi));
      case "Fasting blood sugar": return records.map((item:any) => Number(item.fbs));
      case "Cholesterol":       return records.map((item:any) => Number(item.cholesterol));
      case "HDL":               return records.map((item:any) => Number(item.hdl));
      case "LDL":               return records.map((item:any) => Number(item.ldl));
      case "Blood pressure":    return records.map((item:any) => Number(item.bloodPressure));
      case "Triglyceride":      return records.map((item:any) => Number(item.triglycerides));
      case "Creatinine":        return records.map((item:any) => Number(item.creatinine));
      case "ALT":               return records.map((item:any) => Number(item.sgpt));
      case "Hemoglobin":        return records.map((item:any) => Number(item.hemoglobin));
      case "White blood cell":  return records.map((item:any) => Number(item.wbc));
      case "Platelet":          return records.map((item:any) => Number(item.platelets));
      case "Oxygen level":      return records.map((item:any) => Number(item.spo2));
      case "Heart rate":        return records.map((item:any) => Number(item.heartRate));
    }
  }
  function getThresholdDate(range:'all'|'1y'|'3y'|'5y'){
    if(range === 'all') return null;
    const now = new Date();
    const d = new Date(now);
    switch(range){
      case '1y': d.setFullYear(now.getFullYear() - 1); break;
      case '3y': d.setFullYear(now.getFullYear() - 3); break;
      case '5y': d.setFullYear(now.getFullYear() - 5); break;
    }
    return d;
  }

  const threshold = getThresholdDate(timeRange);
  const filteredData = threshold ? dataFetch.filter((item:any) => new Date(item.dateFile) >= threshold) : dataFetch;

  const processedWeights = handleCategory(typeData, filteredData);
  const yearLabels = filteredData.map((item:any) => {
    const date = new Date(item.dateFile);
    return date.getFullYear(); 
  });
  const hasNumericData = Array.isArray(processedWeights) && processedWeights.some(v => typeof v === 'number' && !isNaN(v));

  // standard thresholds (max values). adjust as needed
  // ranges used to determine out-of-range points (min/max). values are illustrative.
  const ranges: Record<string, { min?: number; max?: number }> = {
    'Body Mass Index': { min: 18.5, max: 24.9 },
    'Fasting blood sugar': { min: 0.1, max: 99 },
    'Cholesterol': { min: 0.1, max: 199 },
    'LDL': { min: 0.1, max: 129 },
    'Triglyceride': { min: 0.1, max: 149 },
    'Creatinine': { min: 0.6, max: 1.3 },
    'ALT': { min: 0.1, max: 40 },
    'White blood cell': { min: 4500, max: 11000 },
    'Platelet': { min: 150000, max: 450000 },
    'Heart rate': { min: 60, max: 100 },
    'Blood pressure': { min: 90, max: 140 },
    'HDL' :{min:60 ,max:97},
    'Oxygen level': { min: 95, max: 100 },
    'Hemoglobin': { min: 12, max: 17 },
  };

  const range = ranges[typeData];
  const outOfRangeIndices: number[] = [];
  const thresholdMax = range?.max;
  const thresholdMin = range?.min;
  function parseNumberFromValue(v:any){
    if (v === null || v === undefined) return NaN;
    const s = String(v);
    // blood pressure like '120/80' -> take systolic
    const bp = s.match(/(\d{2,3})\s*\/\s*(\d{2,3})/);
    if (bp) return Number(bp[1]);
    const m = s.replace(/,/g, '').match(/-?\d+(?:\.\d+)?/);
    return m ? Number(m[0]) : NaN;
  }

  const pointBackgroundColor = Array.isArray(processedWeights) ? processedWeights.map((v:any, i:number) => {
    const num = parseNumberFromValue(v);
    if (isNaN(num) || !range) return '#fff';
    const isLow = range.min !== undefined && num < range.min;
    const isHigh = range.max !== undefined && num > range.max;
    if (isLow || isHigh) outOfRangeIndices.push(i);
    return '#fff';
  }) : [];
  const pointBorderColor = pointBackgroundColor.map((_, idx) => outOfRangeIndices.includes(idx) ? 'rgb(220 38 38)' : 'rgb(0, 108, 249)');
  const lastToastRef = useRef<string | null>(null);

  const data = {
    labels: yearLabels,
    datasets: [
      {
        label: typeData ,
        
        data: processedWeights,
        borderColor: isDanger ? 'rgb(220, 38, 38)' : 'rgb(0, 108, 249)', 
        segment: {
          borderColor: (ctx: any) => {
            const p1 = ctx.p1DataIndex;
            if (Array.isArray(pointBorderColor) && pointBorderColor[p1]) return pointBorderColor[p1];
            return isDanger ? 'rgb(220, 38, 38)' : 'rgb(0, 108, 249)';
          },
        },
        backgroundColor: isDanger ? 'rgba(220, 38, 38, 0.1)' : 'rgba(59, 130, 246, 0.1)', 
        tension: 0.2, 
        fill: true,   
        pointRadius: 6, 
        pointHoverRadius: 8,
        pointBackgroundColor: pointBackgroundColor,
        pointBorderColor: pointBorderColor,
        pointBorderWidth: 2,
        zIndex:1,
      },
      ...(thresholdMax !== undefined ? [{
        label: 'Upper Limit',
        data: yearLabels.map(() => thresholdMax), // สร้าง array ค่าคงที่เท่ากับจำนวนจุด x-axis
        borderColor: isDanger?'rgba(220, 38, 38, 0.4)':'rgba(0, 128, 56, 0.4)', // สีแดงจางๆ
        borderWidth: 2,
        borderDash: [5, 5], // เส้นประ
        pointRadius: 0, // ไม่แสดงจุด
        fill: false,
        tension: 0,
      }] : []),
      ...(thresholdMin !== undefined && thresholdMin > 0 ? [{
        label: 'Lower Limit',
        data: yearLabels.map(() => thresholdMin),
        borderColor: isDanger?'rgba(220, 38, 38, 0.4)':'rgba(0, 128, 56, 0.4)',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
        tension: 0,
      }] : []),
    ],

  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, 
    plugins: {
      legend: { display: false,
        
        align:'end' as const,
        color: isDanger ? 'rgb(220, 38, 38)' : 'rgb(0, 108, 249)',
        tooltip: {
        filter: (tooltipItem: any) => tooltipItem.datasetIndex === 0 // 
      }
      }, 
      title: { 
        display: false, 
        color:'rgb(0,0,0)',
        text: typeData, 
        align: 'center' as const,
        font: { size: 16 }
      },
    },
    scales: {
      y: {
        beginAtZero: false, // BMI usually doesn't start at 0
        grid: { display: false },
        suggestedMax: thresholdMax ? thresholdMax + (thresholdMax * 0.1) : undefined,
      },
      x: {
        grid: { display: false },
      }
    },
  };

  if (!dataFetch || dataFetch.length === 0) {
    return (
      <div className="h-[50vh] w-full bg-white p-6 rounded-xl flex items-center justify-center text-sm text-gray-500">
        No records available. Upload a result to see the chart.
      </div>
    );
  }

  if (!typeData) {
    return (
      <div className="h-[50vh] w-full bg-white p-6 rounded-xl flex items-center justify-center text-sm text-gray-500">
        Select a metric to view its trend.
      </div>
    );
  }

  if (!hasNumericData) {
    return (
      <div className="h-[50vh] w-full bg-white p-6 rounded-xl flex items-center justify-center text-sm text-gray-500">
        No numeric data available for "{typeData}".
      </div>
    );
  }

  const legendItems = [
    {
      key: 'range',
      label: isDanger ? 'Risk Range' : 'Good Range',
      markerClassName: isDanger
        ? 'bg-red-500/50 border border-red-500 border-2 border-dashed'
        : 'bg-[#008038]/20 border border-[#008038] border-2 border-dashed',
      labelClassName: isDanger ? 'text-red-700' : 'text-[#008038]',
    },
    {
      key: 'line',
      label: isDanger ? 'Danger Line' : 'Good Line',
      markerClassName: isDanger
        ? 'bg-red-500/50 border border-red-500 border-2'
        : 'bg-blue-500/20 border border-blue-700 border-2',
      labelClassName: isDanger ? 'text-red-700' : 'text-blue-700',
    },
    {
      key: 'normal',
      label: 'Normal',
      markerClassName: 'border border-blue-500 border-2 rounded-full bg-white',
      labelClassName: 'text-blue-700',
    },
    {
      key: 'abnormal',
      label: 'Higher or Lower than Normal',
      markerClassName: 'border border-red-500 border-2 rounded-full bg-white',
      labelClassName: 'text-red-700',
    },
  ];

  return (
    <div className="w-full rounded-lg p-3 sm:p-4 flex flex-col min-h-[58vh] sm:min-h-[50vh]">
      {isLoading ? (
        <div className="h-full flex items-center justify-center">Loading chart…</div>
      ) : (
        <>
      <div className='flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-5'>
        <div className='items-center'>
          <h2 className="text-lg sm:text-xl font-semibold mb-1 break-words">{typeData}</h2>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-2 sm:flex sm:flex-wrap sm:items-center sm:gap-4">
          {legendItems.map((item) => (
            <div key={item.key} className="flex items-center gap-2 sm:gap-3 min-w-0">
              <p className={`${item.markerClassName} px-4 py-1 shrink-0`} />
              <p className={`${item.labelClassName} text-[11px] sm:text-[12px] font-bold leading-tight truncate`}>
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
        <div className="relative flex-1 min-h-[320px] sm:min-h-[340px]">
          <Line options={options} data={data} />
        </div>
        </>
        
      )}
    </div>
  );
};

export default ChartDashboard;