'use client'
import { ArrowUp,ArrowDown,ArrowRight } from "lucide-react";
import { useState } from "react"
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
  
  function renderMetric(label: string, keyName: string, value: any, unit?: string, extra?: any) {
    const display = value === null || value === undefined || value === '' ? 'N/A' : `${value}${unit ? ` ${unit}` : ''}`;
    const status = getStatusColor(keyName, value, extra);
    const c = colorClasses(status);
    return (
      <p>
        <strong>{label}:</strong>
        <span className={`ml-2  ${c.text}  px-2 py-0.5 rounded`}>{display}</span>
      </p>
    );
  }
    return(
        <>
        <tr className="hover:bg-slate-50/50 " onClick={()=>handleViewbutton() }>
            
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <p className="font-bold text-slate-800">{data.dateupload}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-600 pl-10 font-bld">{data.dateFile}</td>
                  <td className="px-4 py-4 text-slate-600 pl-10 font-bld">{data.provide}</td>
                  <td className="px-4 py-4 text-slate-600 pl-10 font-bold w-[10px] text-center">
                    <h1 className=" rounded-full text-yellow-600 p-1">Pending</h1>
                  </td>
                  
                  <td className="px-6 py-4 text-right justify-end flex">
                    <p className=" text-slate-600 font-bold flex cursor-default items-center gap-3 pr-10">View {isShow?(<ArrowUp size={15}/>):(<ArrowDown size={15}/>)}</p>
                  </td>
                
                </tr>
                {isShow && (
                <tr className="bg-slate-100/30">

                    <td colSpan={5} className="px-6 py-4">
                        <div className="p-4 bg-white rounded-lg border border-slate-100 shadow-sm animate-in fade-in slide-in-from-top-2">
                            <h4 className="font-bold text-slate-700 mb-2">Doctor : {data.provide || 'N/A'}</h4>
                            <div className="grid grid-cols-3 gap-4 text-sm text-slate-600">
                               <p><strong>Patient name:</strong> {data.fullName || 'N/A'}</p>
                               {renderMetric('Pulse', 'pulse', data.pulse, 'time/min', { age: data.age })}
                               {renderMetric('Triglyceride (TG)', 'triglycerides', data.triglycerides, 'mg/dL')}
                               
                               <p><strong>Gender:</strong> {data.gender}</p>
                               {renderMetric('Fasting Blood Sugar (FBS)', 'fbs', data.fbs, 'mg/dL')}
                               {renderMetric('Creatinine (Cr)', 'creatinine', data.creatinine, 'mg/dL')}

                               <p><strong>Age:</strong> {data.age}</p>
                               {renderMetric('Total Cholesterol (TC)', 'cholesterol', data.cholesterol, 'mg/dL')}
                               {renderMetric('Alanine transaminase (ALT)', 'alanine', data.sgpt, 'U/L')}

                               <p><strong>Height:</strong> {data.height} cm</p>
                               {renderMetric('HDL', 'hdl', data.hdl, 'mg/dL')}
                               {renderMetric('Hemoglobin (Hb)', 'hemoglobin', data.hemoglobin, 'g/dL', { sex: data.gender?.toLowerCase() })}

                               <p><strong>Weight:</strong> {data.weight} Kg</p>
                               {renderMetric('LDL', 'ldl', data.ldl, 'mg/dL')}
                               {renderMetric('White Blood Cell (WBC)', 'wbc', data.wbc, 'cell/uL')}

                               {renderMetric('BMI', 'bmi', data.bmi)}
                               {renderMetric('Blood Pressure', 'blood pressure', data.bloodPressure)}
                               {renderMetric('Platelet', 'platelet', data.platelets, 'cell/uL')}

                               {renderMetric('Temperature', 'temperature', data.temperature, 'C')}
                               {renderMetric('Heart Rate', 'heart rate', data.heartRate, 'min', { age: data.age })}
                               {renderMetric('Respiratory Rate', 'respiratory rate', data.respiratoryRate, 'min')}

                               {renderMetric('SPO2', 'spo2', data.spo2, '%RA')}
                               {renderMetric('Red Blood Cell (RBC)', 'rbc', data.rbc, 'cell/uL')}
                               {renderMetric('Hematocrit', 'hematocrit', data.hematocrit, 'cell/uL')}

                               {renderMetric('MCV', 'mcv', data.mcv, 'cell/uL')}
                               {renderMetric('hba1c', 'hba1c', data.hba1c, '%')}
                               {renderMetric('SGOT', 'sgot', data.sgot)}

                               {renderMetric('ALP', 'alp', data.alp, 'cell/uL')}
                               {renderMetric('Total Bilirubin', 'total bilirubin', data.total_bilirubin)}
                               {renderMetric('Albumin', 'albumin', data.albumin)}

                               {renderMetric('GGT', 'ggt', data.ggt)}
                               {renderMetric('Direct Bilirubin', 'direct bilirubin', data.direct_bilirubin)}
                               
                            </div>
                            <h1 className="text-slate-600 text-sm mt-4"><strong>Historical</strong></h1>
                            <textarea className="w-full p-2 rounded-md border border-slate-200 focus:ring-2 focus:ring-[#137fec] outline-none" readOnly rows={3} value={data.history}/>
                            <div className="w-full justify-end flex mt-3">
                              <button
                                type="button"
                                onClick={openFull}
                                className="text-center px-4 py-2 rounded-md mr-3 bg-slate-100 hover:bg-slate-200 flex items-center gap-2"
                              >
                                Open Fullscreen
                              </button>
                            </div>
                        </div>
                    </td>
                </tr>
            )}
            {isFull && (
              <div className="fixed inset-0 z-50 flex items-stretch justify-center bg-black/60 p-6">
                <div className="relative bg-white rounded-lg w-full max-w-6xl h-[80vh] overflow-auto p-6">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold">Record Details</h2>
                    <div className="flex gap-2">
                      <button onClick={closeFull} className="px-3 py-1 rounded bg-slate-100 hover:bg-slate-200">Close</button>
                    </div>
                  </div>
                  <div className="mt-4 text-slate-700">
                    <h4 className="font-semibold">Doctor : {data.provide || 'N/A'}</h4>
                    <div className="grid grid-cols-2 gap-6 mt-4 text-sm text-slate-700">
                      <div className="">
                        <p><strong>Patient name:</strong> {data.fullName || 'N/A'}</p>
                        {renderMetric('Pulse', 'pulse', data.pulse, 'time/min', { age: data.age })}
                        {renderMetric('Triglyceride (TG)', 'triglycerides', data.triglycerides, 'mg/dL')}
                        {renderMetric('Fasting Blood Sugar (FBS)', 'fbs', data.fbs, 'mg/dL')}
                        {renderMetric('Creatinine (Cr)', 'creatinine', data.creatinine, 'mg/dL')}
                        {renderMetric('Total Cholesterol (TC)', 'cholesterol', data.cholesterol, 'mg/dL')}
                        {renderMetric('Alanine transaminase (ALT)', 'alanine', data.sgpt, 'U/L')}
                      </div>
                      <div>
                        {renderMetric('HDL', 'hdl', data.hdl, 'mg/dL')}
                        {renderMetric('Hemoglobin (Hb)', 'hemoglobin', data.hemoglobin, 'g/dL', { sex: data.gender?.toLowerCase() })}
                        {renderMetric('LDL', 'ldl', data.ldl, 'mg/dL')}
                        {renderMetric('WBC', 'wbc', data.wbc, 'cell/uL')}
                        {renderMetric('BMI', 'bmi', data.bmi)}
                        {renderMetric('Blood Pressure', 'blood pressure', data.bloodPressure)}
                      </div>
                    </div>
                    <h3 className="mt-6 font-semibold">AI Suggest</h3>
                    <textarea readOnly rows={6} value={data.suggestionData.suggestion} className="w-full mt-2 p-3 border rounded" />
                  </div>
                </div>
              </div>
            )}
                </>
    )
    
}