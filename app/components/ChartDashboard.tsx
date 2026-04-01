"use client"; 

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  Filler // Added Filler to make 'fill: true' work
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Toast,toast } from "@heroui/react";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler 
);
import { useState,useEffect, useRef } from 'react';

interface Props{
  typeData:string,
  lengthData:string,
}
const ChartDashboard = ({typeData,lengthData}:any) => {
  
  const [dataFetch,setDataFetch] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(()=>{
    const token = localStorage.getItem("token");
    async function handleFetch(){
    try{
    setIsLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_PORT}/users/me`,
      {   
        headers:{
          'Content-Type':'application/json',
          'Authorization':`Bearer ${token}`
        }
      }
    );
    const data = await res.json();
    if(res.ok){
      const sortedData = [...data.Data].sort((a, b) => {
     return new Date(a.dateFile).getTime() - new Date(b.dateFile).getTime();
        
    })
   setDataFetch(sortedData);
  }
    }finally{
      setIsLoading(false);
    }
  
  }
  handleFetch();
  },[]);
  const handleCategory = (select:string) =>{
 
    switch(select){
      case "Body Mass Index" :
        return dataFetch.map((item:any) => Number(item.weight));
      break;
      case "Fasting blood sugar" :
        return dataFetch.map((item:any) => Number(item.fbs));
      break;
      case "Cholesterol" :
        return dataFetch.map((item:any) => Number(item.cholesterol));
      break;
      case "HDL" :
        return dataFetch.map((item:any) => Number(item.hdl));
      break;
      case "LDL" :
        return dataFetch.map((item:any) => Number(item.ldl));
      break;
      case "Blood pressure" :
        return dataFetch.map((item:any) => Number(item.bloodPressure));
      break;
      case "Triglyceride" :
        return dataFetch.map((item:any) => Number(item.triglycerides));
      break;
      case "Creatinine" :
        return dataFetch.map((item:any) => Number(item.creatinine));
      break;
      case "ALT" :
        return dataFetch.map((item:any) => Number(item.sgpt));
      break;
      case "Hemoglobin" :
        return dataFetch.map((item:any) => Number(item.hemoglobin));
      break;
      case "White blood cell" :
        return dataFetch.map((item:any) => Number(item.wbc));
      break;
      case "Platelet" :
        return dataFetch.map((item:any) => Number(item.platelets));
      break;
      case "Oxygen level" :
        return dataFetch.map((item:any) => Number(item.spo2));
      break;
      case "Heart rate" :
        return dataFetch.map((item:any) => Number(item.heartRate));
      break;
    }

  }
  const currentYear = new Date().getFullYear(); 
  const processedWeights = handleCategory(typeData);
  const yearLabels = dataFetch.map((item:any) => {
    const date = new Date(item.dateFile);
    return date.getFullYear(); 
  });
  const hasNumericData = Array.isArray(processedWeights) && processedWeights.some(v => typeof v === 'number' && !isNaN(v));

  // standard thresholds (max values). adjust as needed
  const thresholds: Record<string, number | undefined> = {
    'Body Mass Index': 25,
    'Fasting blood sugar': 125,
    'Cholesterol': 200,
    'LDL': 130,
    'Triglyceride': 150,
    'Creatinine': 1.3,
    'ALT': 41,
    'White blood cell': 11000,
    'Platelet': 450000,
    'Heart rate': 100,
    'Blood pressure': 140
  };

  const threshold = thresholds[typeData];
  const exceedIndices: number[] = [];
  const pointBackgroundColor = Array.isArray(processedWeights) ? processedWeights.map((v:any, i:number) => {
    const num = Number(v);
    if (isNaN(num) || threshold === undefined) return '#fff';
    const exceed = num > threshold;
    if (exceed) exceedIndices.push(i);
    // user requested white fill when value higher than standard
    return '#fff';
  }) : [];
  const pointBorderColor = pointBackgroundColor.map((_, idx) => exceedIndices.includes(idx) ? 'rgb(220 38 38)' : 'rgb(35 167 176)');
  const lastToastRef = useRef<string | null>(null);

  useEffect(() => {
    if (!threshold) return;
    if (exceedIndices.length === 0) return;
    const msg = `${typeData} high: ${exceedIndices.length} value(s) above standard (${threshold}).`;
    if (lastToastRef.current === msg) return;
    lastToastRef.current = msg;
    try { Toast.toast.danger(msg, { timeout: 5000 }); } catch(e) { console.warn('toast error', e); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeData, JSON.stringify(processedWeights)]);

  const data = {
    labels: yearLabels,
    datasets: [
      {
        label: typeData,
        data: processedWeights,
        borderColor: 'rgb(35, 167, 176)', // Blue to match your "LifeMarkers" UI
        backgroundColor: 'rgba(59, 130, 246, 0.1)', 
        tension: 0.1, 
        fill: true,   
        pointRadius: 6, 
        pointHoverRadius: 8,
        pointBackgroundColor: pointBackgroundColor,
        pointBorderColor: pointBorderColor,
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allows you to control height via a wrapper div
    plugins: {
      legend: { display: false }, // Cleaner look like your screenshot
      title: { 
        display: true, 
        text: typeData, 
        align: 'start' as const,
        font: { size: 16 }
      },
    },
    scales: {
      y: {
        beginAtZero: true, // BMI usually doesn't start at 0
        grid: { display: true },
      },
      x: {
        grid: { display: true },
      }
    },
  };

  if (!dataFetch || dataFetch.length === 0) {
    return (
      <div className="h-[50vh] w-full bg-white p-6 rounded-xl flex items-center justify-center text-sm text-gray-500">
        No records available. Upload a result to see the chart.
      </div>
    );
  }

  if (!typeData) {
    return (
      <div className="h-[50vh] w-full bg-white p-6 rounded-xl flex items-center justify-center text-sm text-gray-500">
        Select a metric to view its trend.
      </div>
    );
  }

  if (!hasNumericData) {
    return (
      <div className="h-[50vh] w-full bg-white p-6 rounded-xl flex items-center justify-center text-sm text-gray-500">
        No numeric data available for "{typeData}".
      </div>
    );
  }

  return (
    <div className="h-[50vh] w-full bg-white p-2 rounded-xl">
      {isLoading ? (
        <div className="h-full flex items-center justify-center">Loading chart…</div>
      ) : (
        <Line options={options} data={data} />
      )}
    </div>
  );
};

export default ChartDashboard;