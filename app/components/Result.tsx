"use client";

import React, { useState,useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { data, div } from 'framer-motion/client';
interface Props{
    ui:(value:boolean)=>void;
}

export default function Result({ui}:Props) {
  const [dataFetch,setDataFetch] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const token = localStorage.getItem("token");
  const router = useRouter();
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
      setDataFetch(data.Data);
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
 

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="max-w-3xl h-[80vh] mx-auto p-10 bg-white w-[100vh]  rounded-xl shadow-sm">
      {/* Header */}
      <div className='rounded-xl p-4 mb-4 h-[70vh]'>
      <div className="flex justify-between items-center mb-4   ">
        <h2 className="text-2xl font-bold text-slate-800">Lab Result</h2>
        <button onClick={()=>ui(false)} className="flex items-center text-gray-500 hover:text-red-500 cursor-pointer transition-colors">
          <span  className="mr-1 text-sm">close</span>
          <X size={18} />
        </button>
      </div>
      

      {/* List Items */}
      <div className="space-y-3 h-[60vh] overflow-y-auto [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:display-none">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">Loading…</div>
        ) : (
        dataFetch.map((value,i)=>(
            <div 
              key={i}
              className="group  flex items-center justify-between p-4 bg-gray-100 rounded-xl cursor-pointer hover:bg-gray-200 transition-all"
            >
              <h1 className='relative w-full'>{value.dateFile}</h1>
              <span className="text-slate-600 font-medium">{value.suggest}</span>
              
             
            </div>
        )))}
     
     
      </div>
</div>
      {/* Footer Action */}
      
    </div>
</div>
  );
}