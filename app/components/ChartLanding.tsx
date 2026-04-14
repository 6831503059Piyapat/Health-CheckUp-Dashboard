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
import { Toast } from "@heroui/react";
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
import { color } from 'chart.js/helpers';

const ChartLanding = () => {
 
  const data = {
    labels: [2023,2024,2025,2026],
    datasets: [
      {
        label: "Your Health Score",
        data: [100,75,80,80],
        
        borderColor: 'rgb(0, 108, 249)', // Blue to match your "LifeMarkers" UI
        backgroundColor: 'rgba(59, 130, 246, 0.1)', 
        tension: 0.3, 
        
        fill: true,   
      
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
        color:'rgb(0,0,0)', 
        align: 'start' as const,
        font: { size: 16 }
      },
    },
    scales: {
      y: {
        beginAtZero: true, // BMI usually doesn't start at 0
        grid: { display: false },
      },
      x: {
        grid: { display: false },
      }
    },
  };


  
  return (
    <div className="h-full w-full bg-white p-2 rounded-xl">
      <div className="h-full w-full">
        <Line options={options} data={data} />
      </div>
    </div>
  );
};

export default ChartLanding;