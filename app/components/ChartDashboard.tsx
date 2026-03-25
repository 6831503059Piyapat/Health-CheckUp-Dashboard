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
import { useState,useEffect } from 'react';

interface Props{
  typeData:string,
  lengthData:string,
}
const ChartDashboard = ({typeData,lengthData}:any) => {
  
  const [dataFetch,setDataFetch] = useState<any>([]);
  useEffect(()=>{
    const token = localStorage.getItem("token");
    async function handleFetch(){
    const res = await fetch('http://localhost:2710/users/me',
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
  const data = {
    labels: yearLabels,
    datasets: [
      {
        label: typeData,
        data: processedWeights,
        borderColor: 'rgb(80, 146, 251)', // Blue to match your "LifeMarkers" UI
        backgroundColor: 'rgba(59, 130, 246, 0.1)', 
        tension: 0.1, 
        fill: true,   
        pointRadius: 4, 
        pointHoverRadius: 6,
        pointBackgroundColor: '#fff',
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
        beginAtZero: false, // BMI usually doesn't start at 0
        grid: { display: true },
      },
      x: {
        grid: { display: true },
      }
    },
  };

  return (
    <div className="h-full w-full bg-white p-4 rounded-xl">
      <Line options={options} data={data} />
    </div>
  );
};

export default ChartDashboard;