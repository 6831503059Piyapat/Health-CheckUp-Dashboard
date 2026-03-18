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
} from 'chart.js';
import { Bar,Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const ChartDashboard = () => {
const data = {
    labels: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.'],
    datasets: [
      {
        label: 'จำนวนผู้เข้าชมเว็บไซต์',
        data: [3000, 4500, 4200, 6000, 7800, 8200],
        borderColor: 'rgb(75, 192, 192)', // สีของเส้น
        backgroundColor: 'rgba(94, 109, 109, 0.2)', 
        tension: 0.4, 
        fill: true,   
        pointRadius: 5, 
        pointHoverRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'สถิติผู้ใช้งานรายเดือน' },
    },
    scales: {
      y: {
        beginAtZero: true, // เริ่มแกน Y ที่ 0
      },
    },
  };

  return <Line options={options} data={data} />;
};

export default ChartDashboard;