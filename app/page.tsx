'use client';
import Image from "next/image";
import LocalNavbar from "./components/LocalNavbar";
 import React, { use } from 'react';
import { FolderDown,LayoutDashboard, Users, Calendar, MessageSquare, Settings, Search, Plus, Filter, ChevronDown, MoreHorizontal } from 'lucide-react';
import FilterSelect from "./components/FilterSelect";
import NavItem from "./components/NavItem";
import PaginationBtn from "./components/PaginationBtn";
import { useEffect,useState } from "react";
import Dragdrop from "./components/Dragdrop";
interface Patient {
  name: string;
  sub: string;

  id: string;
  status: string;
  statusColor: string;
  lastVisit: string;
  dept: string;
  avatar: string;
}

export default function Home() {
const [patientsfetch, setPatientsfetch] = useState<Patient[]>([]);

useEffect(() => {
  async function fetchPatients() {
    try {
      const res = await fetch('http://localhost:2710/patient');
      const data = await res.json();
      
      // If your API returns { patients: [...] }, use data.patients
      // Otherwise, check if it's an array directly
      if (Array.isArray(data)) {
        setPatientsfetch(data);
      } else if (data && Array.isArray(data.patients)) {
        setPatientsfetch(data.patients);
      } else {
       
      }
    } catch (error) {
      
      setPatientsfetch([]); // Fallback on network error
    }
  }
  fetchPatients();
}, []);
// Mock Data


return(
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full">
        <div className="p-6 flex items-center gap-3 text-blue-600 font-bold text-xl">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <Plus size={20} className="rotate-45" />
          </div>
          LifeMarkers
        </div>

        <div className="px-4 mb-8">
          <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50">
            <img src="https://i.pravatar.cc/150?u=drsmith" className="w-10 h-10 rounded-full border border-white" alt="Doctor" />
            <div>
              <p className="text-sm font-bold">Dr. Smith</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">General Practitioner</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          <NavItem icon={<Users size={20}/>} label="Upload Result File" active />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <NavItem icon={<Settings size={20}/>} label="Settings" />
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="ml-64 flex-1 p-8">
        
        {/* Header */}
        <header className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Upload Result File</h1>
            <p className="text-slate-500 text-sm">Manage and upload result files</p>
          </div>
       
        </header>
       
       {/* Upload Section */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 mb-8">
<Dragdrop />
      </div>
       
        
         

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex gap-4 mb-6 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search patients by name, ID or specialty..." 
              className="w-full bg-slate-50 border-none rounded-lg py-2.5 pl-10 text-sm focus:ring-2 focus:ring-blue-100 outline-none"
            />
          </div>
          <FilterSelect label="All Statuses" />
          <FilterSelect label="All Departments" />
          <button className="p-2.5 bg-slate-50 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
            <Filter size={18} />
          </button>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 uppercase text-[11px] font-bold tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">Patient Name</th>
                <th className="px-4 py-4">Patient ID</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Last Visit</th>
                <th className="px-4 py-4">Department</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">

              {patientsfetch?.map((patient, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={patient.avatar} className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <p className="font-bold text-slate-800">{patient.name}</p>
                        <p className="text-xs text-slate-500">{patient.sub}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-mono text-xs text-slate-500">{patient.id}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${patient.statusColor}`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{patient.lastVisit}</td>
                  <td className="px-4 py-4 text-slate-600">{patient.dept}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 font-bold hover:underline cursor-pointer">View Profile</button>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>

          {/* Pagination */}
          <div className="px-6 py-4 bg-slate-50/30 flex justify-between items-center border-t border-slate-100">
            <p className="text-xs text-slate-400 font-medium">Showing 1 to 5 of 1,240 patients</p>
            <div className="flex gap-2">
              <PaginationBtn label="Previous" disabled />
              <PaginationBtn label="1" active />
              <PaginationBtn label="2" />
              <PaginationBtn label="3" />
              <PaginationBtn label="Next" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
