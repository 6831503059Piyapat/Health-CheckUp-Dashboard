'use client';
import Image from "next/image";
import LocalNavbar from "./components/LocalNavbar";
 import React, { use } from 'react';
import { FolderDown,LayoutDashboard, Users, Calendar, MessageSquare, Settings, Search, Plus, Filter, ChevronDown, MoreHorizontal } from 'lucide-react';
import FilterSelect from "./components/FilterSelect";
import NavItem from "./components/NavItem";
import PaginationBtn from "./components/PaginationBtn";
import { useEffect,useState } from "react";
import Dragdrop from "./upload/components/Dragdrop";
import { useRouter } from "next/navigation";
import Navbar from "./components/Navbar";
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
      <Navbar />

    
    </div>
  );
}
