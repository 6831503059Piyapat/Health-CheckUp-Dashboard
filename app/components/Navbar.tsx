'use client';
import { Plus, Users, LayoutDashboard, Settings } from "lucide-react";
import NavItem from "./NavItem";
import { useRouter,usePathname } from "next/navigation";

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();

   

    return (
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
          <div onClick={() => router.push('/upload')}><NavItem icon={<Users size={20}/>} label="Upload" active={pathname === '/upload'} /></div>
          <div onClick={() => router.push('/')}><NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active={pathname === '/'} /></div>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <NavItem icon={<Settings size={20}/>} label="Settings" />
        </div>
      </aside>
    )
}