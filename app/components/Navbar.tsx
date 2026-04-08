'use client';
import { Plus, LayoutDashboard, Settings,History,ArrowDownToLine, LogOut, CalendarDays, Menu, ChevronLeft } from "lucide-react";
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
        <div className="p-6 flex items-center gap-3 text-blue-600 font-bold text-xl">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
              <Plus size={20} className="rotate-45" />
            </div>
            <span>LifeMarkers</span>
          </div>
          {/* <button aria-label="Collapse sidebar" onClick={() => setIsCollapsed(true)} className="ml-auto p-2 rounded-md text-slate-500 hover:bg-slate-100">
            <ChevronLeft size={18} />
          </button> */}
        </div>

           {/* Profile Icon */}
        <div className="px-4 mb-8 cursor-default" >
          <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50">
            <Skeleton className="w-10 h-10 rounded-full border border-white"/>
            <div>
                <p className="text-sm font-bold">{isLoading ? 'Loading…' : userData?.name}</p>
              <p className="text-[8px] text-slate-500 uppercase tracking-wider">{isLoading ? 'Loading…' : userData?.email}</p>
            </div>
          </div>
        </div>

      {/* UI Select page */}
        <nav className="flex-1 px-3 space-y-1">
          <div onClick={() => router.push('/upload')}><NavItem icon={<ArrowDownToLine size={20}/>} label="Upload" active={pathname === '/upload'} /></div>
          <div onClick={() => router.push('/')}><NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active={pathname === '/'} /></div>
          <div onClick={() => router.push('/history')}><NavItem icon={<History  size={20}/>} label="History" active={pathname === '/history'} /></div>
          {/* <div onClick={() => router.push('/calendar')}><NavItem icon={<CalendarDays  size={20}/>} label="Calendar" active={pathname === '/calendar'} /></div> */}
          <div onClick={()=>router.push('/Setting')}><NavItem  icon={<Settings size={20}/>} label="Settings" active={pathname === '/Setting'}  /></div>
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