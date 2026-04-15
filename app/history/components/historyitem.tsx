"use client"
import { ArrowUp,ArrowDown,ArrowRight,FileDown,Eye,X  } from "lucide-react";
import { useState } from "react"
import { parseISO, format } from 'date-fns';
import ComparisonBar from './ComparisonBar';
export default function Historyitem({data}:any){
    const [isShow,setIsShow] = useState(false);
    const [isFull,setIsFull] = useState(false);
    function handleViewbutton(){
      setIsShow(!isShow);
    }

    function openFull() {
      setIsFull(true);
    }
    function closeFull() {
      setIsFull(false);
    }

    function formatDate(d: any) {
      if (!d) return 'N/A';
      try {
        const dt = typeof d === 'string' ? parseISO(d) : (d instanceof Date ? d : new Date(d));
        return format(dt, 'dd MMM yyyy');
      } catch (e) {
        return String(d);
      }
    }
    
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
  function hasValue(v: any) {
    if (v === null || v === undefined) return false;
    if (typeof v === 'string') return v.trim().length > 0;
    return true;
  }
  function getStandard(metric: string, dataObj: any) {
    const m = metric.toLowerCase();
    switch(m) {
      case 'bmi': return { min: 18.5, max: 23 };
      case 'fbs': return { min: 70, max: 99 };
      case 'cholesterol': return { min: 0, max: 199 };
      case 'hdl': return { min: 40, max: 60 };
      case 'ldl': return { min: 0, max: 99 };
      case 'triglycerides': return { min: 0, max: 149 };
      case 'creatinine': return { min: 0.6, max: 1.3 };
      case 'sgpt': return { min: 7, max: 56 };
      case 'hemoglobin':
        return (dataObj?.gender && String(dataObj.gender).toLowerCase().startsWith('f'))
          ? { min: 12.1, max: 15.1 }
          : { min: 13.8, max: 17.2 };
      case 'wbc': return { min: 4000, max: 11000 };
      case 'platelets': return { min: 150000, max: 450000 };
      case 'heartrate': return { min: 60, max: 100 };
      case 'spo2': return { min: 95, max: 100 };
      default: return NaN;
    }
  }

  function toMetricPoints(dataObj:any){
    const list = [
      { key:'bmi', label:'BMI' },
      { key:'fbs', label:'FBS' },
      { key:'cholesterol', label:'Cholesterol' },
      { key:'hdl', label:'HDL' },
      { key:'ldl', label:'LDL' },
      { key:'triglycerides', label:'TG' },
      { key:'creatinine', label:'Creatinine' },
      { key:'sgpt', label:'ALT' },
      { key:'hemoglobin', label:'Hemoglobin' },
      { key:'wbc', label:'WBC' },
      { key:'platelets', label:'Platelets' },
      { key:'heartRate', label:'Heart Rate' },
      { key:'spo2', label:'SPO2' },
    ];
    return list.map(item => ({ label: item.label, current: parseNum(dataObj[item.key] ?? dataObj[item.key.toLowerCase()]), standard: getStandard(item.key, dataObj) }));
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
      if (v >= 24.9) return 'red';
      if (v >= 23) return 'yellow';
      if (v >= 18.5) return 'green';
      return 'red';
    }
    if (/platelet/.test(k)) return v < 150000 || v > 450000 ? 'red' : 'green';

    // default: treat values inside a reasonable positive range as green
    if (v >= 0) return 'green';
    return 'red';
  }

  const colorClasses = (c: 'green' | 'yellow' | 'red') => {
    if (c === 'green') return { border: 'border-[#23a7b0]', text: 'text-[rgb(0,133,57)]', bg: 'bg-green-50', shadow: 'shadow-green-500/10',label:'bg-[#23a7b0]' };
    if (c === 'yellow') return { border: 'border-yellow-500', text: 'text-[#AD6500]', bg: 'bg-yellow-50', shadow: 'shadow-yellow-500/10',label:'bg-yellow-300' };
                         return { border: 'border-red-500', text: 'text-[#D10000]', bg: 'bg-red-50', shadow: 'shadow-red-500/10',label:'bg-red-300' };
  };
  
  function renderMetric(label: string, keyName: string, value: any, unit?: string, extra?: any) {
    const display = value === null || value === undefined || value === '' ? 'N/A' : `${value}${unit ? ` ${unit}` : ''}`;
    const status = getStatusColor(keyName, value, extra);
    const c = colorClasses(status);
    return (
      <div className="flex items-center  justify-between" key={keyName}>
        <strong className="font-semibold">{label}:</strong>
        <span className={`ml-2 flex items-end gap-1 ${display === "N/A" ? 'text-slate-500 ' : c.text}  px-2 py-0.5 rounded font-bold`}>{value} <p className="text-[12px] font-bold">{unit}</p></span>
      </div>
    );
  }
  
   const handleDownload = async (data:any) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PORT}/pdf`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data:data}),
      });
  
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
  
      const a = document.createElement("a");
      a.href = url;
      a.download = "report.pdf";
      a.click();
  
      window.URL.revokeObjectURL(url);
    };
    return(
        <>
        <tr className="hover:bg-slate-50/50 " onClick={()=>handleViewbutton() }>
            
                  <td className="px-6 py-4 border-r border-slate-200 text-center justify-center flex">
                    <div className="flex items-center gap-3">
                        <p className="font-bold text-slate-800">{formatDate(data.dateFile)}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 pl-10 font-bold justufy-center border-r border-slate-200 text-center">
                    <div className="flex items-center gap-3 justify-center">
                        <p className="font-bold text-slate-800"> {formatDate(data.dateupload)}</p>
                    </div>
                    </td>
                  <td className="px-4 py-4 text-slate-600 pl-10 font-bold justify-center text-center">
                     <div className="flex items-center gap-3">
                        <p className="font-bold text-slate-800"> {data.provide}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-600  font-bold text-center justify-center">
                     <div className="flex items-center gap-3 text-center justify-start ">
                        <p className="font-bold text-slate-800 text-center "> {isShow?(<ArrowUp className="" size={15}/>):(<ArrowDown className="" size={15}/>)}</p>
                    </div>
                  </td>
                  
                  
                
                </tr>
                {isShow && (
                <tr className="bg-slate-100/30">

                    <td colSpan={5} className="px-6 py-4">
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 shadow-sm animate-in fade-in slide-in-from-top-2">
                         
                          <div className="mb-5 justify-start border-b border-slate-200 pb-5">
                            <div className="justify-between flex">
                              <div className="">
                             <h4 className="font-bold text-slate-700 mb-2">Doctor : {data.provide || 'N/A'}</h4>
                             <p className="font-bold text-slate-700 mb-2">Patient name: {data.fullName || 'N/A'}</p>
                            <div className="flex gap-5 mt-5">
                            <span className="font-bold flex gap-1 text-slate-600 items-end">Gender: {data.gender}</span>
                           <span className="font-bold flex gap-1 text-slate-600 items-end">Age: {data.age}</span>
                           <span className="flex gap-1 font-bold text-slate-600 items-end">Height: {data.height} <p className="text-[11px]">cm</p></span>
                            <span className="font-bold flex gap-1 text-slate-600 items-end">Weight: {data.weight} <p className="text-[11px]">kg</p></span>
                          </div>
                              </div>
                            <div className="flex gap-5 justify-end items-center mb-2 px-5 ">
                              <div className="flex gap-5 p-1 ">
                                <div className="p-1 border rounded-full shadow-sm cursor-pointer hover:bg-slate-100" onClick={()=>closeFull()}>
                              <FileDown onClick={()=>handleDownload(data)} className="text-slate-800 cursor-pointer hover:text-slate-600  "/>
                                </div>
                                <div className="p-1 border rounded-full shadow-sm cursor-pointer hover:bg-slate-100">
                              <Eye onClick={()=> openFull()} className="text-slate-800 cursor-pointer hover:text-slate-600" />

                                </div>
                            </div>
                            </div>
                            </div>
                            
                            
                          </div> 
                          <div className="flex gap-2 justify-end mb-5 items-center">

                              <p className="bg-[rgb(0,133,57)] p-1.5 rounded-full"></p>
                              <p className="text-[rgb(0,133,57)] font-bold text-[14px]">Normal</p>
                              <p className="bg-[#AD6500] p-1.5 rounded-full"></p>
                              <p className="text-[#AD6500] font-bold text-[14px]">Warning</p>
                              <p className="bg-[#D10000] p-1.5 rounded-full"></p>
                              <p className="text-[#D10000] font-bold text-[14px]">Risk</p>
                            </div>
                             <div className="grid grid-cols-3  gap-4 text-sm text-slate-600">
                               {hasValue(data.pulse) && renderMetric('Pulse', 'pulse', data.pulse, 'time/min', { age: data.age })}
                               {hasValue(data.triglycerides) && renderMetric('Triglyceride (TG)', 'triglycerides', data.triglycerides, 'mg/dL')}
                               {hasValue(data.fbs) && renderMetric('Fasting Blood Sugar (FBS)', 'fbs', data.fbs, 'mg/dL')}
                               {hasValue(data.creatinine) && renderMetric('Creatinine (Cr)', 'creatinine', data.creatinine, 'mg/dL')}
                               {hasValue(data.cholesterol) && renderMetric('Total Cholesterol (TC)', 'cholesterol', data.cholesterol, 'mg/dL')}
                               {hasValue(data.sgpt) && renderMetric('Alanine transaminase (ALT)', 'alanine', data.sgpt, 'U/L')}
                               {hasValue(data.hdl) && renderMetric('HDL', 'hdl', data.hdl, 'mg/dL')}
                               {hasValue(data.hemoglobin) && renderMetric('Hemoglobin (Hb)', 'hemoglobin', data.hemoglobin, 'g/dL', { sex: data.gender?.toLowerCase() })}
                               {hasValue(data.ldl) && renderMetric('LDL', 'ldl', data.ldl, 'mg/dL')}
                               {hasValue(data.wbc) && renderMetric('White Blood Cell (WBC)', 'wbc', data.wbc, 'cell/uL')}
                               {hasValue(data.bmi) && renderMetric('BMI', 'bmi', data.bmi)}
                               {hasValue(data.bloodPressure) && renderMetric('Blood Pressure', 'blood pressure', data.bloodPressure,'mmHg')}
                               {hasValue(data.platelets) && renderMetric('Platelet', 'platelet', data.platelets, 'cell/uL')}
                               {hasValue(data.temperature) && renderMetric('Temperature', 'temperature', data.temperature, 'C')}
                               {hasValue(data.heartRate) && renderMetric('Heart Rate', 'heart rate', data.heartRate, 'bpm', { age: data.age })}
                               {hasValue(data.respiratoryRate) && renderMetric('Respiratory Rate', 'respiratory rate', data.respiratoryRate, 'min')}
                               {hasValue(data.spo2) && renderMetric('SPO2', 'spo2', data.spo2, '%RA')}
                               {hasValue(data.rbc) && renderMetric('Red Blood Cell (RBC)', 'rbc', data.rbc, 'cell/uL')}
                               {hasValue(data.hematocrit) && renderMetric('Hematocrit', 'hematocrit', data.hematocrit, 'cell/uL')}
                               {hasValue(data.mcv) && renderMetric('MCV', 'mcv', data.mcv, 'cell/uL')}
                               {hasValue(data.hba1c) && renderMetric('hba1c', 'hba1c', data.hba1c, '%')}
                               {hasValue(data.sgot) && renderMetric('SGOT', 'sgot', data.sgot)}
                               {hasValue(data.alp) && renderMetric('ALP', 'alp', data.alp, 'cell/uL')}
                               {hasValue(data.total_bilirubin) && renderMetric('Total Bilirubin', 'total bilirubin', data.total_bilirubin)}
                               {hasValue(data.albumin) && renderMetric('Albumin', 'albumin', data.albumin)}
                               {hasValue(data.ggt) && renderMetric('GGT', 'ggt', data.ggt)}
                               {hasValue(data.direct_bilirubin) && renderMetric('Direct Bilirubin', 'direct bilirubin', data.direct_bilirubin)}
                             </div>
                            <h1 className="text-slate-600 text-sm mt-4"><strong>Historical</strong></h1>
                            <textarea className="resize-none italic without-ring w-full p-2 text-slate-500 rounded-md border border-slate-200 cursor-default outline-none" readOnly rows={3} value={data.history || 'No historical data available.'}/>
                            
                        </div>
                    </td>
                </tr>
            )}
            {isFull && (
              <tr className="">
                <td className="fixed inset-0 z-50 flex items-stretch justify-center bg-black/60 p-6">
                <div className="relative bg-white rounded-lg w-full max-w-10xl h-[90vh] overflow-y-auto [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:display-none p-6">
                  <div className=" flex px-4 py-1.5 bg-white justify-between items-start border-b ">
                    <h2 className="text-xl font-bold">Record Details, {data.dateFile ? formatDate(data.dateFile) : 'N/A'}</h2>
                    <div className="flex gap-5 justify-end px-10 py-1 items-center mb-2 ">
                     <div className="rounded-full p-1 hover:bg-slate-100 cursor-pointer"> 
                      <FileDown onClick={()=>handleDownload(data)} className="text-slate-800 cursor-pointer"/>                            </div>
                     </div>
                    <div className="flex gap-2 cursor-pointer  items-center justify-center">
                      <button onClick={closeFull} className="px-3 py-1 rounded  text-red-500 items-center flex cursor-pointer gap-2"><X className="text-red-500" size={20}/>Close</button>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-slate-700">
                    
                    <h4 className="font-semibold">Doctor : {data.provide || 'N/A'}</h4>
                    <p><strong>Patient name:</strong> {data.fullName || 'N/A'}</p>
                    <div className="grid grid-cols-2 gap-6 mt-4 text-sm text-slate-700">
                      <div className="">
                        
                        {hasValue(data.pulse) && renderMetric('Pulse', 'pulse', data.pulse, 'time/min', { age: data.age })}
                        {hasValue(data.triglycerides) && renderMetric('Triglyceride (TG)', 'triglycerides', data.triglycerides, 'mg/dL')}
                        {hasValue(data.fbs) && renderMetric('Fasting Blood Sugar (FBS)', 'fbs', data.fbs, 'mg/dL')}
                        {hasValue(data.creatinine) && renderMetric('Creatinine (Cr)', 'creatinine', data.creatinine, 'mg/dL')}
                        {hasValue(data.cholesterol) && renderMetric('Total Cholesterol (TC)', 'cholesterol', data.cholesterol, 'mg/dL')}
                        {hasValue(data.sgpt) && renderMetric('Alanine transaminase (ALT)', 'alanine', data.sgpt, 'U/L')}
                      </div>
                      <div>
                        {hasValue(data.hdl) && renderMetric('HDL', 'hdl', data.hdl, 'mg/dL')}
                        {hasValue(data.hemoglobin) && renderMetric('Hemoglobin (Hb)', 'hemoglobin', data.hemoglobin, 'g/dL', { sex: data.gender?.toLowerCase() })}
                        {hasValue(data.ldl) && renderMetric('LDL', 'ldl', data.ldl, 'mg/dL')}
                        {hasValue(data.wbc) && renderMetric('WBC', 'wbc', data.wbc, 'cell/uL')}
                        {hasValue(data.bmi) && renderMetric('BMI', 'bmi', data.bmi)}
                        {hasValue(data.bloodPressure) && renderMetric('Blood Pressure', 'blood pressure', data.bloodPressure,'mmHg')}
                      </div>
                    </div>
                      <div className="mt-6">
                        <h3 className="font-semibold mb-2">Comparison</h3>
                        <div className="flex justify-end mb-2 gap-2 ">

                          <div className="flex items-center justify-start">
                            <p className="bg-[#0037ff]/50 p-2 rounded border "></p>
                            <p className="ml-2">Standard Min</p>
                          </div>
                          <div className="flex items-center justify-start">
                              <p className="bg-[#ff0011]/90 p-2 rounded border"></p>
                              <p className="ml-2">High Value</p>
                          </div>
                          <div className="flex items-center justify-start">
                              <p className="bg-[#008A29]/90 p-2 rounded border"></p>
                              <p className="ml-2">Normal Value</p>
                          </div>
                          <div className="flex items-center justify-start">
                              <p className="bg-[#0033ff]/70 p-2 rounded border"></p>
                              <p className="ml-2">Standard Max</p>
                          </div>
                        </div>
                        <div className="w-full h-48">
                          <ComparisonBar metrics={toMetricPoints(data)} height={180} />
                        </div>
                      </div>
                      {/* <h3 className="mt-6 font-semibold">AI Suggest</h3>
                      <textarea readOnly rows={6} value={data.suggestionData?.suggestion || ''} className="w-full mt-2 p-3 border rounded" /> */}
                  </div>
                </div>
                </td>
              </tr>
            )}
                </>
    )
    
}