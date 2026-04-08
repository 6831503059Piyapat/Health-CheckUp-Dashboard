"use client";

import React, { useState,useEffect,useMemo } from 'react';
import { X, Check, CircleQuestionMark, TrendingUp, TrendingDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { data } from 'framer-motion/client';

interface Props{
    ui:(value:boolean)=>void;
}

export default function Result({ui}:Props) {
  const [dataFetch,setDataFetch] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const token = localStorage.getItem("token");
  const router = useRouter();


  function RateofChange(key: string, currentVal?: any): string {
    if (!dataFetch || dataFetch.length === 0) return 'N/A';

    // If caller provided currentVal, prefer it as the latest value
    let latestValue: number | null = undefined as any;
    if (currentVal !== undefined && currentVal !== null && !isNaN(Number(currentVal))) {
      latestValue = Number(currentVal);
    }

    // Find the latest index that has the requested key
    let latestIndex = -1;
    for (let i = dataFetch.length - 1; i >= 0; i--) {
      if (dataFetch[i] && dataFetch[i][key] != null) {
        latestIndex = i;
        if (latestValue == null) latestValue = Number(dataFetch[i][key]);
        break;
      }
    }

    if (latestIndex === -1 || latestValue == null || isNaN(latestValue)) return 'N/A';

    // Try to find a matching entry from the previous year by date field
    const dateFields = ['dateFile', 'date', 'createdAt', 'timestamp'];
    const dateField = dateFields.find(f => dataFetch[latestIndex] && dataFetch[latestIndex][f]);

    let prevValue: number | null = null;
    if (dateField) {
      const latestDate = new Date(String(dataFetch[latestIndex][dateField]));
      if (!isNaN(latestDate.getTime())) {
        const targetYear = latestDate.getFullYear() - 1;
        const targetMonth = latestDate.getMonth();
        for (let i = dataFetch.length - 1; i >= 0; i--) {
          const d = dataFetch[i];
          if (!d || !d[dateField]) continue;
          const dt = new Date(String(d[dateField]));
          if (isNaN(dt.getTime())) continue;
          if (dt.getFullYear() === targetYear && dt.getMonth() === targetMonth && d[key] != null) {
            prevValue = Number(d[key]);
            break;
          }
        }
      }
    }

    // Fallback: use the item 12 entries before the latest if available
    if (prevValue == null) {
      const fallbackIdx = latestIndex - 12;
      if (fallbackIdx >= 0 && dataFetch[fallbackIdx] && dataFetch[fallbackIdx][key] != null) {
        prevValue = Number(dataFetch[fallbackIdx][key]);
      }
    }

    if (prevValue == null || isNaN(prevValue) || prevValue === 0) return 'N/A';

    const percent = ((latestValue - prevValue) * 100) / Math.abs(prevValue);
    const sign = percent > 0 ? '+' : '';
    return `${sign}${percent.toFixed(1)}%`;
  }
  
  useEffect(()=>{
    const handlefetch = async ()=>{
    try{
    setIsLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_PORT}/users/me`,{
      headers:{
        'Content-Type':'application/json',
        'Authorization':`Bearer ${token}`
      }

    })
    const data = await res.json();
    if(res.ok){
      setDataFetch(Array.isArray(data.Data) ? data.Data : Array.isArray(data.data) ? data.data : []);
    }
    if(res.status === 401){
      localStorage.removeItem("token");
      router.push('/auth/login');
    }
    }finally{
      setIsLoading(false);
    }
    }
    handlefetch();
  },[])
  type SuggestionValue =
    | string
    | {
        suggestion?: string;
        Risk_of_disease?: string | null;
        Prevention_Reduction?: string;
        [k: string]: any;
      };

  type ParsedSuggestion = { key: string; suggestion?: string; risk?: string | null };

  const extractRiskSuggestions = (suggestionData?: Record<string, SuggestionValue>): ParsedSuggestion[] => {
    if (!suggestionData || typeof suggestionData !== 'object') return [];

    return Object.entries(suggestionData)
      .filter(([key, val]) => {
        if (val == null) return false;
        if (typeof val === 'string') {
          return val.trim() !== 'Data not provided' && /_suggestion$/i.test(key);
        }
        if (typeof val === 'object') {
          const risk = (val as any).Risk_of_disease;
          return risk !== undefined && String(risk).trim() !== 'Data not provided';
        }
        return false;
      })
      .map(([key, val]) => {
        const baseKey = key.replace(/_suggestion$/i, '');
        if (typeof val === 'string') {
          return { key: baseKey, suggestion: val, risk: undefined };
        }
        const suggestionText = (val as any).Prevention_Reduction !== undefined ? String((val as any).Prevention_Reduction) : undefined;
        const riskText = (val as any).Risk_of_disease !== undefined ? String((val as any).Risk_of_disease) : undefined;
        return { key: baseKey, suggestion: suggestionText, risk: riskText };
      });
  };

  const riskFiltered = dataFetch
    .map(item => ({ ...item, suggestions: extractRiskSuggestions(item?.suggestionData) }))
    .filter(item => item.suggestions && item.suggestions.length > 0);

  // Utility: determine color based on medical ranges
  function parseNum(v: any): number | null {
    if (v == null) return null;
    if (typeof v === 'number') return v;
    if (typeof v === 'string') {
      const cleaned = v.replace(/,/g, '').trim();
      const n = Number(cleaned);
      return Number.isFinite(n) ? n : null;
    }
    return null;
  }

  function getStatusColor(key: string, rawValue: any, extra?: any): 'green' | 'yellow' | 'red' {
    const k = String(key || '').toLowerCase();
    // special handling for blood pressure values like "120/80"
    if (/pressure|blood pressure/.test(k) && typeof rawValue === 'string') {
      const parts = rawValue.split('/').map((p: string) => Number(p.trim()));
      if (parts.length === 2 && parts.every(Number.isFinite)) {
        const [sys, dia] = parts;
        if (sys >= 130 || dia >= 80) return 'red';
        if (sys >= 120 && sys <= 129 && dia < 80) return 'yellow';
        return 'green';
      }
    }

    const v = parseNum(rawValue);
    // if no numeric value, mark as red to surface missing/invalid data
    if (v == null) return 'red';

    // Ranges
    if (/pulse|heart rate/.test(k)) {
      const age = extra?.age ?? 30;
      if (age >= 18) return v < 60 || v > 100 ? 'red' : 'green';
      if (age >= 6 && age <= 15) return v < 70 || v > 100 ? 'red' : 'green';
      if (age >= 1 && age <= 2) return v < 90 || v > 140 ? 'red' : 'green';
      return 'green';
    }
    if (/triglyceride|triglycerides/.test(k)) {
      if (v >= 200) return 'red';
      if (v >= 150) return 'yellow';
      return 'green';
    }
    if (/fasting blood sugar|fbs|fasting/.test(k)) {
      if (v >= 126) return 'red';
      if (v >= 100) return 'yellow';
      return 'green';
    }
    if (/creatinine/.test(k)) return v < 0.6 || v > 1.3 ? 'red' : 'green';
    if (/total cholesterol|cholesterol(?!.*hdl|.*ldl)/.test(k)) {
      if (v >= 240) return 'red';
      if (v >= 200) return 'yellow';
      return 'green';
    }
    if (/alanine|alt/.test(k)) return v < 7 || v > 56 ? 'red' : 'green';
    if (/hdl(?!.*l)/.test(k)) {
      if (v < 40) return 'red';
      if (v >= 60) return 'green';
      return 'yellow';
    }
    if (/ldl/.test(k)) {
      if (v >= 160) return 'red';
      if (v >= 100) return 'yellow';
      return 'green';
    }
    if (/white blood cell|wbc/.test(k)) return v < 4000 || v > 11000 ? 'red' : 'green';
    if (/hemoglobin|hgb/.test(k)) {
      const sex = (extra?.sex as string) || 'male';
      if (sex === 'male') return v < 13.8 || v > 17.2 ? 'red' : 'green';
      return v < 12.1 || v > 15.1 ? 'red' : 'green';
    }
    if (/bmi/.test(k)) {
      if (v >= 30) return 'red';
      if (v >= 25) return 'yellow';
      if (v >= 18.5) return 'green';
      return 'red';
    }
    if (/platelet/.test(k)) return v < 150000 || v > 450000 ? 'red' : 'green';

    // default: treat values inside a reasonable positive range as green
    if (v >= 0) return 'green';
    return 'red';
  }

  const colorClasses = (c: 'green' | 'yellow' | 'red') => {
    if (c === 'green') return { border: 'border-[#23a7b0]', text: 'text-green-500', bg: 'bg-green-50', shadow: 'shadow-green-500/10',label:'bg-[#23a7b0]' };
    if (c === 'yellow') return { border: 'border-yellow-500', text: 'text-yellow-500', bg: 'bg-yellow-50', shadow: 'shadow-yellow-500/10',label:'bg-yellow-300' };
                         return { border: 'border-red-500', text: 'text-red-500', bg: 'bg-red-50', shadow: 'shadow-red-500/10',label:'bg-red-300' };
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className=" h-[90vh] mx-auto p-6 bg-white w-[200vh]  rounded-md shadow-sm">
      {/* Header */}
      <div className='rounded-xl h-[70vh]'>
      <div className="flex justify-between items-center mb-4 p-4 rounded-lg">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">Overview</h2>
        <button onClick={()=>ui(false)} className="flex items-center text-gray-500 hover:text-red-500 cursor-pointer transition-colors">
          <span  className="mr-1 text-sm">close</span>
          <X size={18} />
        </button>
      </div>
      

      {/* List Items */}
      <div className="space-y-3 h-[70vh] overflow-y-auto [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:display-none">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">Loading…</div>
        ) : (
              riskFiltered.slice(-1).map((value, i) => (
                <div key={i} className='px-10'>
                  <div className='flex w-full grid  gap-5'>
                    {value.suggestions.map((s: any, idx: number) => {
                      const raw = (value as any)[s.key] ?? (value as any).bmi ?? null;
                      const clr = getStatusColor(s.key, raw, value);
                      const cls = colorClasses(clr);
                      return (
                      <div key={idx} className={`gap-5 border ${cls.border} shadow ${cls.shadow} shadow-lg ${cls.bg} p-5 rounded-lg flex`}>
                        <div className={`items-cente`}>
                            <div className={`${cls.label} w-0.5 h-full rounded-md`}>

                            </div>
                             </div>
                          <div>
                        <h1 className={`text-lg flex gap-2 ${cls.text}`}>
                          {s.key.toUpperCase()} : <span className={`${cls.text} `}>{(value as any)[s.key] ?? 'N/A'}</span>
                        </h1>
                        <p className='text-sm text-slate-600'>Risk: {s.risk ?? 'N/A'}</p>
                        <p className='text-sm text-slate-600'>Suggest: {s.suggestion || 'N/A'}</p>
                     </div>
                      </div>
                    )})}
                  </div>
                </div>
              ))
         
        // dataFetch.map((value,i)=>(
        //     <div 
        //       key={i}
        //       className="group  flex items-center justify-between p-4 bg-gray-100 rounded-xl cursor-pointer hover:bg-gray-200 transition-all"
        //     >
        //       <h1 className='relative w-full'>{value.dateFile}</h1>
        //       <span className="text-slate-600 font-medium">{value.suggest}</span>
              
             
        //     </div>
        // ))
        
        )}
     
     
      </div>
</div>
      {/* Footer Action */}
      
    </div>
</div>
  );
}