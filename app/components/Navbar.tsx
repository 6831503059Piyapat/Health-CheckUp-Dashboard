'use client';
import { Plus, LayoutDashboard, Settings,History,ArrowDownToLine, LogOut, CalendarDays, Menu, ChevronLeft, TrendingUp } from "lucide-react";
import NavItem from "./NavItem";
import { useRouter,usePathname } from "next/navigation";
import { useState,useEffect } from "react";
import { Skeleton } from "@heroui/react";
export default function Navbar() {
  // router for got to another page
    const router = useRouter();
  // pathname for ui sidebar 
  // check pathname if current pathname match with current sidebar  
    const pathname = usePathname();
    const [userData,setUserData] = useState<any>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const handleLogout = ()=>{
      localStorage.removeItem("token");
      router.push('/auth/login');
    }
    useEffect(()=>{
      const token = localStorage.getItem('token');
    
    const fetcProfile = async ()=>{
      try{
        setIsLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_PORT}/users/me`,{
          method:'GET',
          headers:{
            'Authorization':`Bearer ${token}`,
            'Content-Type':'application/json'
          }
        });
        if(res.status === 401){ localStorage.removeItem('token'); router.push('/auth/login'); return; }
        const data = await res.json();
        if(res.ok){
          setUserData(data);
        }
      }finally{
        setIsLoading(false);
      }
    };
    fetcProfile();
    },[pathname])

  
   

    return (
      <>
        {/* open button visible when collapsed */}
        {isCollapsed && (
          <button aria-label="Open sidebar" onClick={() => setIsCollapsed(false)} className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md">
            <Menu size={18} />
          </button>
        )}

        <aside className={`w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full transform transition-transform duration-300 ${isCollapsed ? '-translate-x-64' : 'translate-x-0'}`}>
        

           {/* Profile Icon */}
       

      {/* UI Select page */}
        <nav className="flex-1 px-5 space-y-1 mt-1">
          <div onClick={() => router.push('/upload')}><NavItem icon={<ArrowDownToLine size={20}/>} label="Upload" active={pathname === '/upload'} /></div>
          <div onClick={() => router.push('/dashboard')}><NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active={pathname === '/dashboard'} /></div>
          <div onClick={() => router.push('/history')}><NavItem icon={<History  size={20}/>} label="History" active={pathname === '/history'} /></div>
          <div onClick={() => router.push('/predict')}><NavItem icon={<TrendingUp  size={20}/>} label="Predict" active={pathname === '/predict'} /></div>
          <div onClick={() => router.push('/calendar')}><NavItem icon={<CalendarDays  size={20}/>} label="Calendar" active={pathname === '/calendar'} /></div>
          <div onClick={()=>router.push('/profile')}><NavItem  icon={<Settings size={20}/>} label="Profile" active={pathname === '/profile'}  /></div>
        </nav>

      {/* Setting button */}
        <div className="p-4 border-t border-slate-100">
<button onClick={()=>handleLogout()} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all focus:ring-2 focus:ring-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 
    }`}>
      {<LogOut size={20} className="text-red-500"/>}
      {"Logout"}
    </button>
        </div>
      </aside>
      </>
    );
  }