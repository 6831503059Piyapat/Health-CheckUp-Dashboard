'use client';
import { Chart } from "chart.js";
import { useState,useEffect } from "react";
import { getRelativePosition } from "chart.js/helpers";
import Navbar from "./components/Navbar";
import { useRouter } from "next/navigation";
import ChartDashboard from "./components/ChartDashboard";
import { Skeleton } from "@heroui/react";
import Result from "./components/Result";
import DropDown from "./components/dropDown";
import HealthcareRec from "./components/HealthcareRec";
import {jwtDecode,JwtPayload} from "jwt-decode";
import { datalist } from "framer-motion/client";
import { CircleQuestionMark } from "lucide-react";
const metrics = [
  "Body Mass Index",
  "Fasting blood sugar", "Cholesterol", "HDL", "LDL", 
  "Blood pressure", "Triglyceride", "Creatinine", "ALT", 
  "Hemoglobin", "White blood cell", "Platelet", "Oxygen level", "Heart rate"
];

export default function Home() {
  const router = useRouter();
  const [dataFetch,setDataFetch] = useState<any>();
  const [dataFetchData,setDataFetchData] = useState<any>();
  // For graph
  const [lengthData,setLengthData] = useState<string>();
  const [typeData,setTypeData] = useState<string>();
  const [resulUi,setResultUi] = useState<boolean>();
const latest = (dataFetchData && dataFetchData.length > 0) 
  ? dataFetchData.reduce((prev: any, current: any) => {
      const prevDate = new Date(prev.dateFile).getTime();
      const currentDate = new Date(current.dateFile).getTime();
      return currentDate > prevDate ? current : prev;
    })
  : null;  
  
function typeDataRisk(typeDisease:string){
  switch (typeDisease){
  case "Body Mass Index":   return dataFetchData[0]?.suggestionData.bmi_suggestion.Risk_of_disease ||  'No data';
  case "Fasting blood sugar": return dataFetchData[0]?.suggestionData.fbs_suggestion.Risk_of_disease || 'No data';
  case "Cholesterol":       return dataFetchData[0]?.suggestionData.cholesterol_suggestion.Risk_of_disease || 'No data';
  case "HDL":               return dataFetchData[0]?.suggestionData.hdl_suggestion.Risk_of_disease || 'No data';
  case "LDL":               return dataFetchData[0]?.suggestionData.ldl_suggestion.Risk_of_disease || 'No data';
  case "Blood pressure":    return dataFetchData[0]?.suggestionData.bloodPressure_suggestion.Risk_of_disease || 'No data';
  case "Triglyceride":      return dataFetchData[0]?.suggestionData.triglycerides_suggestion.Risk_of_disease || 'No data';
  case "Creatinine":        return dataFetchData[0]?.suggestionData.creatinine_suggestion.Risk_of_disease || 'No data';
  case "ALT":               return dataFetchData[0]?.suggestionData.sgpt_suggestion.Risk_of_disease || 'No data';
  case "Hemoglobin":        return dataFetchData[0]?.suggestionData.hemoglobin_suggestion.Risk_of_disease || 'No data';
  case "White blood cell":  return dataFetchData[0]?.suggestionData.wbc_suggestion.Risk_of_disease || 'No data';
  case "Platelet":          return dataFetchData[0]?.suggestionData.platelets_suggestion.Risk_of_disease || 'No data';
  case "Oxygen level":      return dataFetchData[0]?.suggestionData.spo2_suggestion.Risk_of_disease || 'No data';
  case "Heart rate":        return dataFetchData[0]?.suggestionData.heartRate_suggestion.Risk_of_disease || 'No data';
}
}
  
  // Fetch data from backend

  useEffect(()=>{
    const token = localStorage.getItem("token");
    
    if (token) {
        try {
          const decoded = jwtDecode<JwtPayload>(token);
          const currentTime = Date.now() / 1000; 
    
          if (decoded.exp! < currentTime) {
            localStorage.removeItem("token");
            router.push('/auth/login');
          }
        } catch (error) {
          localStorage.removeItem("token");
          router.push('/auth/login');
        }
      }
      else{
        router.push('/auth/login');
      }
    const handleFetch = async()=>{
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_PORT}/users/me`,{
          headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
          }
        });
        if(res.status === 401){ localStorage.removeItem('token'); router.push('/auth/login'); return; }
        const data = await res.json();
        if(res.ok){
          setDataFetch(data);
          setDataFetchData(Array.isArray(data.Data) ? data.Data : Array.isArray(data.data) ? data.data : []);
        }
      } catch { /* network error — keep empty state */ }
    }
    handleFetch();
     
  },[]);
return(
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
 {/* <HealthcareRec/> */}
      {/* SIDEBAR */}
  
      {resulUi &&(<Result ui={setResultUi}/>)}
      
      <Navbar />
      {/* DASHBOARD PAGE */}

    <main className="ml-64 flex-1 ">
       
      <div className="min-h-screen bg-gray-100 p-6 font-sans text-gray-700">
  <header className="mb-6 rounded-2xl bg-white p-6 shadow-sm flex items-start justify-between">
    <div className="flex gap-6">
      <Skeleton className="h-24 w-24 rounded-xl bg-gray-200"  />
      <div>
        <h1 className="text-2xl font-bold text-black mb-2 uppercase">{dataFetch?.name || (<Skeleton className="w-20 h-[30px]"/>)}</h1>
        <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-sm text-gray-500">
          <span>Age : {latest?.age } years</span>
          <span>High : {latest?.height} cm</span>
          <span>Weight : {latest?.weight } kg</span>
          <span className="col-span-3">Gender : {latest?.gender }</span>
          <span className="col-span-3">Last Checkup : {latest?.dateFile || <Skeleton className="w-20 h-[20px]"/>}</span>
        </div>
      </div>
    </div>
    <div className="flex flex-col gap-2">
      {/* <button onClick={()=>router.push("/Recommend")} className="rounded-xl bg-blue-400 px-6 py-2 text-sm font-medium text-gray-100 hover:bg-blue-500">Book Appointment</button>
      <button className="rounded-xl bg-blue-400 px-6 py-2 text-sm font-medium text-gray-100 hover:bg-blue-500">Health Care Recommend</button> */}
    </div>
  </header>

  <div className="grid grid-cols-3 gap-6">
    <main className="col-span-2 rounded-2xl bg-white p-6 shadow-sm h-full flex flex-col">
     
<>
      <div className="mb-8 flex justify-between items-center">
        <div>

          <DropDown data={metrics} type={"Body Mass Index"} setData={setTypeData}/>
        
        </div>
       
      </div>

      <div className="relative flex-grow flex flex-col justify-end border-b border-gray-300 pb-2">

       <ChartDashboard typeData={typeData} lengthData={lengthData}/>

     
      </div>
   
    </>
    
    
     
    </main>

    <aside className="space-y-6">
      <section className="rounded-2xl bg-white shadow-sm overflow-hidden">
      
        <div className="p-6 pb-2 bg-">
          <h2 className="mb-4 font-semibold">Status Signals</h2>
     
        <div className="justify-between">
          {/* For Show what status mean */}
          <div className="justify-between ">
            <div className="flex gap-5 items-center mb-4">
              <p className="w-5 h-5 p-1 rounded-full border border-[#23a7b0] border-3"></p>
              <p className="text-sm">There are no problem</p>
            </div>
            <div className="flex gap-5 items-center mb-4">
              <p className="w-5 h-5 p-1 rounded-full border border-[#dc2626] border-3"></p>
              <p className="text-sm">Your {typeData} is Higher or Lower then standard</p>
            </div>
            <div className="text-warp">
             <div className="flex gap-5 items-center mb-4 bg-slate-50 p-2">
             <p className="w-1 h-5 rounded-full items-center bg-[#23a7b0] "></p>
             <p className="text-sm">Risk of Disease : {dataFetchData?.[dataFetchData.length - 1]?.suggestionData.list_disease?.map((disease: string) => <span key={disease}>{disease} </span>) || 'Data not provided'} </p>
             </div>
                {dataFetchData && dataFetchData.length > 0 ?(
                 <>
                 <div className="flex gap-5 p-2 bg-slate-50 rounded-sm items-center mb-4">
                    <p className="w-0.5 h-5 rounded-full items-center bg-[#23a7b0] "></p>
                   <span className="text-sm flex">Problematic Status : <p className="font-bold"> {typeData}</p></span>
                 </div>
                
                 <div className="flex gap-5 items-center mb-4 bg-slate-50 rounded-sm p-2">
                    
                    <p className="text-sm w-1 h-5 rounded-full items-center bg-[#23a7b0] "></p>
                    <p className="text-sm">Description : {typeDataRisk(typeData || 'Unknown')}</p>
                    
                  </div>
                  </>
                ):(
                  <p className="text-sm">No data available</p>
                )}
              
            </div>
          </div>

          <div></div>
        </div>
      {/* <div className="mb-4 flex items-center gap-4 rounded-xl bg-gray-200 p-4">
            {dataFetchData && dataFetchData.length > 0 ?(
              <>
                <div className="text-center leading-tight border-r border-gray-400 pr-4">
                  <p className="text-[32px] uppercase font-bold ">📅</p>
                </div>
                <div>
                  <p className="font-bold">{latest?.provide}</p>
                  <p className="text-xs text-gray-500">{latest?.dateFile}</p>
                </div>
              </>
            ):(
              <div className="flex h-full items-center justify-center text-gray-500 italic">
                <p>You do not have any upload result</p>
              </div>
            )}
          </div> */}
     
          
          
          {/* <button className="w-full rounded-xl bg-gray-200 py-3 text-sm font-medium">2 more new Appointment</button> */}
        </div>
         {dataFetchData && dataFetchData.length > 0 ? (
        <button type="button" onClick={()=>setResultUi(true)} className="w-full flex items-center justify-center gap-3 border-t border-gray-100 py-4 text-sm font-medium hover:bg-gray-50 text-center">See an overview</button>
      ) : (
      <div className="flex h-full items-center justify-center text-gray-500 italic">
        
      </div>
     )}
        </section>

      {/* <section className="rounded-2xl bg-white shadow-sm overflow-hidden">
        <div className="p-6 pb-2">
          <h2 className="mb-4 font-semibold">Health Care Activity</h2>
          <div className="h-40 w-full rounded-xl bg-gray-200 mb-4"></div>
        </div>
        <button className="w-full border-t border-gray-100 py-4 text-sm font-medium hover:bg-gray-50 text-center">View all activity </button>
      </section> */}
    </aside>
  </div>
</div>
    </main>
    
    </div>
  );
}
