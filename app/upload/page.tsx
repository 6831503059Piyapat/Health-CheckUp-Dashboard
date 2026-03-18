'use client';
import Image from "next/image";
import LocalNavbar from "../components/LocalNavbar";
 import React, { use } from 'react';
import { FolderDown,LayoutDashboard, Users, Calendar, MessageSquare, Settings, Search, Plus, Filter, ChevronDown, MoreHorizontal } from 'lucide-react';
import FilterSelect from "../components/FilterSelect";
import NavItem from "../components/NavItem";
import PaginationBtn from "../components/PaginationBtn";
import { useEffect,useState } from "react";
import Dragdrop from "./components/Dragdrop";
import Navbar from "../components/Navbar";
import FormInput from "./components/FormInput";
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
const [typeUpload,setTypeUpload] = useState<string>("dragdrop");


// Mock Data
const getFileIcon = (type: string) => {
  if (type.startsWith("image/")) return "🖼️";
  if (type.startsWith("video/")) return "🎬";
  if (type.startsWith("audio/")) return "🎵";
  if (type.includes("pdf")) return "📄";
  if (type.includes("zip") || type.includes("tar") || type.includes("gzip")) return "🗜️";
  if (type.includes("spreadsheet") || type.includes("excel") || type.includes("csv")) return "📊";
  if (type.includes("word") || type.includes("document")) return "📝";
  return "📁";
};
function choiceTypeUpload(){
  if(typeUpload === "dragdrop"){
setTypeUpload("manual");
  }
  else{
    setTypeUpload("dragdrop");
  }
  
}
return(
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <Navbar />

      {/* MAIN CONTENT */}
      <main className="ml-64 flex-1 p-8">
        
        {/* Header */}
        <header className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Upload Result File</h1>
          </div>
       
        </header>
       
       {/* Upload Section */}
     
    <FormInput/>
       
        {/* Filters */}
        {/* <div className="bg-white p-4 rounded-xl border border-slate-200 flex gap-4 mb-6 items-center">
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
        </div> */}

        {/* Table Container */}
        {/* <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="w-full border-b border-slate-100">
              <h1 className=" text-slate-400 uppercase text-[16px] font-bold p-5 pl-10 ">History</h1>
             
            </thead>
            <tbody className="divide-y divide-slate-50">

             
                <tr className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      
                        <p className="font-bold text-slate-800">FileName</p>
                     
                    </div>
                  </td>
                  <td className="px-4 py-4 font-mono text-xs text-slate-500">FileID</td>
                
                  <td className="px-4 py-4 text-slate-600">18 Otc 2026</td>
                  <td className="px-4 py-4 text-slate-600">Type File</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 font-bold hover:underline cursor-pointer">View Profile</button>
                  </td>
                </tr>
            

            </tbody>
          </table> */}

          {/* Pagination */}
          {/* <div className="px-6 py-4 bg-slate-50/30 flex justify-between items-center border-t border-slate-100">
            <p className="text-xs text-slate-400 font-medium">Showing 0 to 0 of 0 File</p>
            <div className="flex gap-2">
              <PaginationBtn label="Previous" disabled />
              <PaginationBtn label="1" active />
              <PaginationBtn label="2" />
              <PaginationBtn label="3" />
              <PaginationBtn label="Next" />
            </div>
          </div>
        </div> */}
      </main>
    </div>
  );
}
