import Image from "next/image";
import LocalNavbar from "./components/LocalNavbar";
 import React from 'react';
import { LayoutDashboard, Users, Calendar, MessageSquare, Settings, Search, Plus, Filter, ChevronDown, MoreHorizontal } from 'lucide-react';
import FilterSelect from "./components/FilterSelect";
import NavItem from "./components/NavItem";
import PaginationBtn from "./components/PaginationBtn";
export default function Home() {
   
// Mock Data
const patients = [
  { name: 'Alice Henderson', sub: 'Female, 34 yrs', id: '#PT-82731', status: 'Stable', statusColor: 'bg-emerald-100 text-emerald-700', lastVisit: 'Oct 12, 2023', dept: 'Cardiology', avatar: 'https://i.pravatar.cc/150?u=alice' },
  { name: 'James Wilson', sub: 'Male, 62 yrs', id: '#PT-82745', status: 'Critical', statusColor: 'bg-rose-100 text-rose-700', lastVisit: 'Oct 21, 2023', dept: 'Neurology', avatar: 'https://i.pravatar.cc/150?u=james' },
  { name: 'Sarah Miller', sub: 'Female, 28 yrs', id: '#PT-82752', status: 'Active', statusColor: 'bg-blue-100 text-blue-700', lastVisit: 'Oct 20, 2023', dept: 'Pediatrics', avatar: 'https://i.pravatar.cc/150?u=sarah' },
  { name: 'Robert Chen', sub: 'Male, 45 yrs', id: '#PT-82760', status: 'Stable', statusColor: 'bg-emerald-100 text-emerald-700', lastVisit: 'Oct 15, 2023', dept: 'Oncology', avatar: 'https://i.pravatar.cc/150?u=robert' },
  { name: 'Emily Davis', sub: 'Female, 51 yrs', id: '#PT-82768', status: 'Active', statusColor: 'bg-blue-100 text-blue-700', lastVisit: 'Oct 22, 2023', dept: 'Cardiology', avatar: 'https://i.pravatar.cc/150?u=emily' },
];

return(
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full">
        <div className="p-6 flex items-center gap-3 text-blue-600 font-bold text-xl">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <Plus size={20} className="rotate-45" />
          </div>
          HealthOS
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
          <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" />
          <NavItem icon={<Users size={20}/>} label="Patients" active />
          <NavItem icon={<Calendar size={20}/>} label="Appointments" />
          <NavItem icon={<MessageSquare size={20}/>} label="Messages" />
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
            <h1 className="text-2xl font-bold text-slate-800">Patients</h1>
            <p className="text-slate-500 text-sm">Manage and track patient care profiles</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
            <Plus size={18} /> Add Patient
          </button>
        </header>

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
              {patients.map((patient, i) => (
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
                    <button className="text-blue-600 font-bold hover:underline">View Profile</button>
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
