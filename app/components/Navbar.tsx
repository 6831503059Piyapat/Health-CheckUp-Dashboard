'use client';
import { Plus, LayoutDashboard, Settings,History,ArrowDownToLine, LogOut, CalendarDays, Menu, ChevronLeft, TrendingUp,User } from "lucide-react";
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
    const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
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
        <button
          aria-label="Open sidebar"
          onClick={() => setShowMobileMenu(true)}
          className="fixed top-23 left-4 z-49 p-2 bg-white rounded-md shadow-md sm:hidden"
        >
          <Menu size={18} className="text-black"/>
        </button>

        {showMobileMenu && (
          <div className="fixed inset-0 z-50 bg-black/40 sm:hidden" onClick={() => setShowMobileMenu(false)}>
            <aside
              className="absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-white border-r border-slate-200 flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100">
                <span className="text-sm font-bold text-slate-900">Menu</span>
                <button onClick={() => setShowMobileMenu(false)} className="p-2 rounded-md hover:bg-slate-100">
                  <ChevronLeft size={18} />
                </button>
              </div>
              <nav className="flex-1 px-5 space-y-1 mt-1">
                <div onClick={() => { router.push('/upload'); setShowMobileMenu(false); }}><NavItem icon={<ArrowDownToLine size={20}/>} label="Upload" active={pathname === '/upload'} /></div>
                <div onClick={() => { router.push('/dashboard'); setShowMobileMenu(false); }}><NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active={pathname === '/dashboard'} /></div>
                <div onClick={() => { router.push('/history'); setShowMobileMenu(false); }}><NavItem icon={<History  size={20}/>} label="History" active={pathname === '/history'} /></div>
                <div onClick={() => { router.push('/predict'); setShowMobileMenu(false); }}><NavItem icon={<TrendingUp  size={20}/>} label="Predict" active={pathname === '/predict'} /></div>
                <div onClick={() => { router.push('/calendar'); setShowMobileMenu(false); }}><NavItem icon={<CalendarDays  size={20}/>} label="Calendar" active={pathname === '/calendar'} /></div>
                <div onClick={() => { router.push('/profile'); setShowMobileMenu(false); }}><NavItem  icon={<User size={20}/>} label="Profile" active={pathname === '/profile'}  /></div>
              </nav>
             
            </aside>
          </div>
        )}

        <aside className={`hidden sm:flex w-64 bg-white border-r border-slate-200 flex-col fixed h-full transform transition-transform duration-300 ${isCollapsed ? '-translate-x-64' : 'translate-x-0'}`}>
        

           {/* Profile Icon */}
       

      {/* UI Select page */}
        <nav className="flex-1 px-5 space-y-1 mt-1">
          <div onClick={() => router.push('/upload')}><NavItem icon={<ArrowDownToLine size={20}/>} label="Upload" active={pathname === '/upload'} /></div>
          <div onClick={() => router.push('/dashboard')}><NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active={pathname === '/dashboard'} /></div>
          <div onClick={() => router.push('/history')}><NavItem icon={<History  size={20}/>} label="History" active={pathname === '/history'} /></div>
          <div onClick={() => router.push('/predict')}><NavItem icon={<TrendingUp  size={20}/>} label="Predict" active={pathname === '/predict'} /></div>
          <div onClick={() => router.push('/calendar')}><NavItem icon={<CalendarDays  size={20}/>} label="Calendar" active={pathname === '/calendar'} /></div>
          <div onClick={()=>router.push('/profile')}><NavItem  icon={<User size={20}/>} label="Profile" active={pathname === '/profile'}  /></div>
        </nav>

      
      </aside>
      </>
    );
  }