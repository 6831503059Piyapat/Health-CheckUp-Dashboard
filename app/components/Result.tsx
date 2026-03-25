"use client";

import React, { useState,useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { data, div } from 'framer-motion/client';
interface Props{
    ui:(value:boolean)=>void;
}

export default function Result({ui}:Props) {
  const [dataFetch,setDataFetch] = useState<any[]>([]);
  const token = localStorage.getItem("token");
  useEffect(()=>{
    const handlefetch = async ()=>{
        const res = await fetch("http://localhost:2710/users/me",{
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`
            }

        })
        const data = await res.json();
        if(res.ok){
            setDataFetch(data.Data);
        }
    }
    handlefetch();
  },[])
 

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="max-w-3xl mx-auto p-10 bg-white w-[100vh] rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-slate-800">Lab Result</h2>
        <button onClick={()=>ui(false)} className="flex items-center text-gray-500 hover:text-red-500 cursor-pointer transition-colors">
          <span  className="mr-1 text-sm">close</span>
          <X size={18} />
        </button>
      </div>
      

      {/* List Items */}
      <div className="space-y-3">
        {dataFetch.map((value,i)=>(
            <div 
              key={i}
              className="group flex items-center justify-between p-4 bg-gray-100 rounded-xl cursor-pointer hover:bg-gray-200 transition-all"
            >
              <h1 className='relative w-full'>{value.dateFile}</h1>
              <span className="text-slate-600 font-medium">{value.suggest}</span>
              
             
            </div>
        ))}
     
      </div>

      {/* Footer Action */}
      
    </div>
</div>
  );
}