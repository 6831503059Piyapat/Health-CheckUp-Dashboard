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
