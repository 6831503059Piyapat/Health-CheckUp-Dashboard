'use client';
import { Chart } from "chart.js";
import { getRelativePosition } from "chart.js/helpers";
import Navbar from "./components/Navbar";
import ChartDashboard from "./components/ChartDashboard";

export default function Home() {


return(
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <Navbar />
    <main className="ml-64 flex-1 p-8">
     
    </main>
    
    </div>
  );
}
