'use client'
import Navbar from "../components/Navbar";
import { Search,Filter,ArrowDown,ArrowUp } from "lucide-react";
import FilterSelect from "../components/FilterSelect";
import Historyitem from "./components/historyitem";
import { useEffect,useState } from "react";
import { usePathname } from "next/navigation";

export default function History(){
  const pathName = usePathname();
  const [dataFetch,setDataFetch] = useState<any>([]);
  useEffect(()=>{
    const token = localStorage.getItem("token");
    const handleFetch =async ()=>{
      const res = await fetch('http://localhost:2710/users/me',{
        headers:{'Content-Type':'application/json',
        'Authorization':`Bearer ${token}`
        }

      }
      );
      const data = await res.json();
      if(res.ok){
        setDataFetch(data);
        console.log(data);
      }
      else{
      }
    }
    handleFetch();
  },[pathName])
    return(
      <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 ">
        <Navbar/>
        <main className="ml-64 flex-1 p-8 overflow-y-auto [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:display-none ">
       <div className="bg-slate-50 h-[100vh]  rounded-md p-5">
       <div className="bg-white p-2 rounded-xl border border-slate-200 flex gap-4 mb-6 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search reviewer by name" 
              className="w-full bg-slate-50 border-none rounded-lg py-2.5 pl-10 text-sm focus:ring-2 focus:ring-blue-100 outline-none"
            />
          </div>
          <FilterSelect label="Date Sort" />
          <FilterSelect label="Status Sort" />
          <button className="p-2.5 bg-slate-50 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
            <Filter size={18} />
          </button>
        </div>  

        {/* Table Container */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden ">
          <table className="w-full text-left text-sm">
            <thead className="w-full border-b border-slate-100 bg-slate-100 ">
              <tr>
                 <th className=" text-slate-400 uppercase text-[14px] font-bold p-5 pl-10 ">Date Upload</th>
             <th className=" text-slate-400 uppercase text-[14px] font-bold p-5 pl-10 ">Date info</th>

             <th className=" text-slate-400 uppercase text-[14px] font-bold p-5 pl-10 ">Provider</th>
          
             <th className=" text-slate-400 uppercase text-[14px] font-bold p-5 pl-10 ">Status</th>
             <th></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 ">

             {dataFetch?.Data?.map((data:any,i:number)=>
              
                  <Historyitem key={i} data={data}/>
             
            
            )}
                
            

            </tbody>
          </table>

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
       </div>
       </div>
    </main>
      </div>
    )
    }