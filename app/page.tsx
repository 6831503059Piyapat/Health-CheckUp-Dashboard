'use client';
import { Chart } from "chart.js";
import { useState,useEffect } from "react";
import { getRelativePosition } from "chart.js/helpers";
import Navbar from "./components/Navbar";
import ChartDashboard from "./components/ChartDashboard";
import { Skeleton } from "@heroui/react";
import DropDown from "./components/dropDown";
const metrics = [
  "Fasting blood sugar", "Cholesterol", "HDL", "LDL", 
  "Blood pressure", "Triglyceride", "Creatinine", "ALT", 
  "Hemoglobin", "White blood cell", "Platelet", "Oxygen level", "Heart rate"
];
const lenghtData=["All of length","Every three yerars","Customized","One of all years","Last years","Current year"]
export default function Home() {
  const [dataFetch,setDataFetch] = useState<any>();
  useEffect(()=>{
    const token = localStorage.getItem("token");
    const handleFetch = async()=>{
      const res = await fetch('http://localhost:2710/users/me',{
        headers:{
          'Content-Type':'application/json',
          'Authorization':`Bearer ${token}`
        }
      })
      const data = await res.json();
      if(res.ok){
        setDataFetch(data);
      }
    }
    handleFetch();
  },[]);
return(
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <Navbar />
      {/* DASHBOARD PAGE */}

    <main className="ml-64 flex-1 p-1">
      <div className="min-h-screen bg-gray-100 p-6 font-sans text-gray-700">
  <header className="mb-6 rounded-2xl bg-white p-6 shadow-sm flex items-start justify-between">
    <div className="flex gap-6">
      <Skeleton className="h-24 w-24 rounded-xl bg-gray-200"  />
      <div>
        <h1 className="text-2xl font-bold text-black mb-2 uppercase">{dataFetch?.name || (<Skeleton className="w-20 h-[30px]"/>)}</h1>
        <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-sm text-gray-500">
          <span>Age : 24 years</span>
          <span>High : 180 cm</span>
          <span>Weight : 24</span>
          <span className="col-span-3">Gender : Female</span>
          <span className="col-span-3">Last Checkup : Mar 21, 2025</span>
        </div>
      </div>
    </div>
    <div className="flex flex-col gap-2">
      <button className="rounded-xl bg-blue-400 px-6 py-2 text-sm font-medium text-gray-100 hover:bg-blue-500">Book Appointment</button>
      <button className="rounded-xl bg-blue-400 px-6 py-2 text-sm font-medium text-gray-100 hover:bg-blue-500">Health Care Recommend</button>
    </div>
  </header>

  <div className="grid grid-cols-3 gap-6">
    <main className="col-span-2 rounded-2xl bg-white p-6 shadow-sm h-full flex flex-col">
      <div className="mb-8 flex justify-between items-center">
        <div>

          <DropDown data={metrics} type={"Body Mass Index"}/>
        
        </div>
        <div>
          <DropDown data={lenghtData} type={"Length of data"}/>
        </div>
      </div>

      <div className="relative flex-grow flex flex-col justify-end border-b border-gray-300 pb-2">
       <ChartDashboard />
      </div>
    </main>

    <aside className="space-y-6">
      <section className="rounded-2xl bg-white shadow-sm overflow-hidden">
        <div className="p-6 pb-2">
          <h2 className="mb-4 font-semibold">Upcoming Appointment</h2>
          <div className="mb-4 flex items-center gap-4 rounded-xl bg-gray-200 p-4">
            <div className="text-center leading-tight border-r border-gray-400 pr-4">
              <p className="text-xs uppercase">Mar</p>
              <p className="text-xl font-bold">28</p>
            </div>
            <div>
              <p className="font-bold">Dr.Manhua Webpage</p>
              <p className="text-xs text-gray-500">Physical checking</p>
            </div>
          </div>
          <button className="w-full rounded-xl bg-gray-200 py-3 text-sm font-medium">2 more new Appointment</button>
        </div>
        <button className="w-full border-t border-gray-100 py-4 text-sm font-medium hover:bg-gray-50 text-center">View all appointment </button>
      </section>

      <section className="rounded-2xl bg-white shadow-sm overflow-hidden">
        <div className="p-6 pb-2">
          <h2 className="mb-4 font-semibold">Health Care Activity</h2>
          <div className="h-40 w-full rounded-xl bg-gray-200 mb-4"></div>
        </div>
        <button className="w-full border-t border-gray-100 py-4 text-sm font-medium hover:bg-gray-50 text-center">View all activity </button>
      </section>
    </aside>
  </div>
</div>
    </main>
    
    </div>
  );
}
