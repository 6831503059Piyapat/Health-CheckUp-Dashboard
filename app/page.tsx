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
import { h1 } from "framer-motion/client";
import {jwtDecode,JwtPayload} from "jwt-decode";
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
  : null;  // Fetch data from backend
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_PORT}/users/me`,{
        headers:{
          'Content-Type':'application/json',
          'Authorization':`Bearer ${token}`
        }
      })
      const data = await res.json();
      if(res.ok){
        setDataFetch(data);
        setDataFetchData(data.Data);
      }
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
      
        <div className="p-6 pb-2">
          <h2 className="mb-4 font-semibold">Latest test results</h2>
     
      <div className="mb-4 flex items-center gap-4 rounded-xl bg-gray-200 p-4">
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
          </div>
     
          
          
          {/* <button className="w-full rounded-xl bg-gray-200 py-3 text-sm font-medium">2 more new Appointment</button> */}
        </div>
         {dataFetchData && dataFetchData.length > 0 ? (
        <button type="button" onClick={()=>setResultUi(true)} className="w-full border-t border-gray-100 py-4 text-sm font-medium hover:bg-gray-50 text-center">View </button>
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
