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

const ChartDashboard = () => {
  const currentYear = new Date().getFullYear(); 

  // Calculate years directly. No useState needed = no infinite loop!
  const startYear = currentYear - 5; // -5 to show 6 years total including current
  const yearShow = Array.from({ length: 6 }, (_, i) => startYear + i);

  const data = {
    labels: yearShow,
    datasets: [
      {
        label: 'จำนวนผู้เข้าชมเว็บไซต์',
        data: [3000, 4500, 4200, 6000, 7800, 8200],
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
        text: 'Body Mass Index History', 
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