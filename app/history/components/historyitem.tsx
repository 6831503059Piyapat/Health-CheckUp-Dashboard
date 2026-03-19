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
                        <p className="font-bold text-slate-800">{data.lastVisit}</p>
                    </div>
                  </td>
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

                       {/* {provide:'Spider Man', name: 'Robert Chen',pulse: 86, lastVisit: 'Oct 15, 2023', triglyceride: 80,
                         gender:'Female',fasting_blood_sugar:76 ,creatinine:0.9 ,age:20 ,total_cholesterol: 120,alanine_transaminase:23,
                         height:180, hdl:72, hemoglobin:13, weight:60,ldl:60,white_blood_cell:9250,bmi:18.5 , blood_pressure:'118/80 mmHg',
                         platelet:400000 
                        */}

                    <td colSpan={4} className="px-6 py-4">
                        <div className="p-4 bg-white rounded-lg border border-slate-100 shadow-sm animate-in fade-in slide-in-from-top-2">
                            <h4 className="font-bold text-slate-700 mb-2">Doctor : {data.provide}</h4>
                            <div className="grid grid-cols-3 gap-4 text-sm text-slate-600">
                               <p><strong>User name:</strong> {data.name || 'N/A'}</p>
                               <p><strong>Pulse:</strong> {data.pulse} time/min</p>
                               <p><strong>Triglyceride(TG):</strong> {data.triglyceride} mg/dL</p>
                               
                               <p><strong>Gender:</strong> {data.gender}</p>
                               <p><strong>Fasting Blood Sugar(FBS):</strong> {data.fasting_blood_sugar} mg/dL</p>
                               <p><strong>Creatinine(Cr):</strong> {data.creatinine} mg/dL</p>

                               <p><strong>Age:</strong> {data.age}</p>
                               <p><strong>Total Cholesterol(TC):</strong> {data.total_cholesterol} mg/dL</p>
                               <p><strong>Alanine transaminase(ALT):</strong> {data.alanine_transaminase} U/L</p>

                               <p><strong>Height:</strong> {data.height} cm</p>
                               <p><strong>HDL:</strong> {data.hdl} mg/dL</p>
                               <p><strong>Hemoglobin (Hb):</strong> {data.hemoglobin} g/dL</p>

                               <p><strong>Weight:</strong> {data.weight} Kg</p>
                               <p><strong>LDL:</strong> {data.ldl} mg/dL</p>
                               <p><strong>White Blood Cell (WBC):</strong> {data.white_blood_cell} cell/uL</p>

                               <p><strong>BMI:</strong> {data.bmi}</p>
                               <p><strong>Blood Pressure:</strong> {data.blood_pressure}</p>
                               <p><strong>Platelet:</strong> {data.platelet} cell/uL</p>
                            </div>
                            <h1 className="text-slate-600 text-sm"><strong>Historical</strong></h1>
                            <textarea className="w-full p-2 rounded-md border border-slate-200 focus:ring-2 focus:ring-[#137fec] outline-none" rows={3} value={data.historical}/>
                        </div>
                    </td>
                </tr>
            )}
                </>
    )
    
}