'use client'
import { ArrowUp,ArrowDown } from "lucide-react";
import { useState } from "react"
export default function Historyitem({data}:any){
    const [isShow,setIsShow] = useState(false);
    function handleViewbutton(){
      setIsShow(!isShow);
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
                               <p><strong>Pulse:</strong> {data.pulse} time/min</p>
                               <p><strong>Triglyceride(TG):</strong> {data.triglycerides} mg/dL</p>
                               
                               <p><strong>Gender:</strong> {data.gender}</p>
                               <p><strong>Fasting Blood Sugar(FBS):</strong> {data.fbs} mg/dL</p>
                               <p><strong>Creatinine(Cr):</strong> {data.creatinine} mg/dL</p>

                               <p><strong>Age:</strong> {data.age}</p>
                               <p><strong>Total Cholesterol(TC):</strong> {data.cholesterol} mg/dL</p>
                               <p><strong>Alanine transaminase(ALT):</strong> {data.sgpt} U/L</p>

                               <p><strong>Height:</strong> {data.height} cm</p>
                               <p><strong>HDL:</strong> {data.hdl} mg/dL</p>
                               <p><strong>Hemoglobin (Hb):</strong> {data.hemoglobin} g/dL</p>

                               <p><strong>Weight:</strong> {data.weight} Kg</p>
                               <p><strong>LDL:</strong> {data.ldl} mg/dL</p>
                               <p><strong>White Blood Cell (WBC):</strong> {data.wbc} cell/uL</p>

                               <p><strong>BMI:</strong> {data.bmi}</p>
                               <p><strong>Blood Pressure:</strong> {data.bloodPressure}</p>
                               <p><strong>Platelet:</strong> {data.platelets} cell/uL</p>

                               <p><strong>Temperature:</strong> {data.temperature || 'N/A'} C</p>
                               <p><strong>Heart Rate:</strong> {data.heartRate} min</p>
                               <p><strong>Respiratory Rate:</strong> {data.respiratoryRate} min</p>

                               <p><strong>SPO2:</strong> {data.spo2} %RA</p>
                               <p><strong>Red Blood Cell (RBC):</strong> {data.rbc} cell/uL</p>
                               <p><strong>Hematocrit:</strong> {data.hematocrit} cell/uL</p>

                               <p><strong>MCV:</strong> {data.mcv} cell/uL</p>
                               <p><strong>hba1c:</strong> {data.hba1c} %</p>
                               <p><strong>SGOT:</strong> {data.sgot} </p>

                               <p><strong>ALP:</strong> {data.alp} cell/uL</p>
                               <p><strong>Total Bilirubin:</strong> {data.total_bilirubin} </p>
                               <p><strong>Albumin:</strong> {data.albumin} </p>

                               <p><strong>GGT:</strong> {data.ggt} </p>
                               <p><strong>Direct Bilirubin:</strong> {data.direct_bilirubin} </p>
                               
                            </div>
                            <h1 className="text-slate-600 text-sm mt-4"><strong>Historical</strong></h1>
                            <textarea className="w-full p-2 rounded-md border border-slate-200 focus:ring-2 focus:ring-[#137fec] outline-none" readOnly rows={3} value={data.history}/>
                        </div>
                    </td>
                </tr>
            )}
                </>
    )
    
}