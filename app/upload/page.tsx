'use client'
import Navbar from "../components/Navbar";
import FormInput from "./components/FormInput";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {jwtDecode,JwtPayload} from "jwt-decode";
export default function Upload() {
  const router = useRouter();
useEffect(()=>{
  const token = localStorage.getItem("token");
  if (token) {
          try {
            const decoded = jwtDecode<JwtPayload>(token);
            const currentTime = Date.now() / 1000; 
      
            if (decoded.exp! < currentTime) {
              localStorage.removeItem("token");
              router.push('/auth/login');
            }
          } catch (error) {
            localStorage.removeItem("token");
            router.push('/auth/login');
          }
        }else{
        router.push('/auth/login');
      }
});
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
       
        
      </main>
    </div>
  );
}
