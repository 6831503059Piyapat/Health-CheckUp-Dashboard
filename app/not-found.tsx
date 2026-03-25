'use client'
import Navbar from "./components/Navbar"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function NotFound(){
    const router = useRouter();
    useEffect(()=>{

      const token = localStorage.getItem("token");
      if(token){
        router.push("/")
      }
    });
    return(
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
        
        {/* PAGE 404 WHEN OCCOUR */}
        <div className="flex w-full justify-center items-center">

        
        <div className=" justify-center gap-2 font-bold items-center">
         
        <h1 className="text-slate-500 text-[50px] text-center">404</h1>
        <h1 className="text-center text-[55px] text-slate-500">NOT FOUND</h1>
        <p className="text-center text-slate-500">This is not the web page you are looking for.</p>

        </div>
    </div>
    </div>
    )
}