'use client'
import Navbar from "../components/Navbar";
import { Search,Filter,ArrowDown,ArrowUp } from "lucide-react";
import FilterSelect from "../components/FilterSelect";
import Historyitem from "./components/historyitem";
import { useEffect,useState,useMemo } from "react";
import { usePathname,useRouter } from "next/navigation";
import {jwtDecode,JwtPayload} from "jwt-decode";
import { Spinner } from "@heroui/react";
import { div } from "framer-motion/client";
import { set } from "react-hook-form";
export default function History(){
  const pathName = usePathname();
  const [dataFetch,setDataFetch] = useState<any>([]);
  const [isLoading,setIsLoading] = useState(true);
  const [searchQuery,setSearchQuery] = useState<string>('');
  const [sortKey,setSortKey] = useState<string>('date');
  const [sortOrder,setSortOrder] = useState<'asc'|'desc'>('desc');
  const router = useRouter();
  const displayedData = useMemo(()=>{
    const list = Array.isArray(dataFetch?.Data) ? [...dataFetch.Data] : [];
    const q = searchQuery.trim().toLowerCase();
    let filtered = list.filter((it:any)=>{
      if(!q) return true;
      const provider = (it.provide||'').toString().toLowerCase();
      const fullname = (it.fullName||'').toString().toLowerCase();
      return provider.includes(q) || fullname.includes(q);
    });
    filtered.sort((a:any,b:any)=>{
      if(sortKey === 'provider'){
        const pa = (a.provide||'').toString();
        const pb = (b.provide||'').toString();
        return sortOrder === 'asc' ? pa.localeCompare(pb) : pb.localeCompare(pa);
      }
      // default: date
      const da = a.dateFile ? new Date(a.dateFile).getTime() : 0;
      const db = b.dateFile ? new Date(b.dateFile).getTime() : 0;
      return sortOrder === 'asc' ? da - db : db - da;
    });
    return filtered;
  },[dataFetch, searchQuery, sortKey, sortOrder]);
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
    
    const handleFetch =async ()=>{
      const res = await fetch(`${process.env.NEXT_PUBLIC_PORT}/users/me`,{
        headers:{'Content-Type':'application/json',
        'Authorization':`Bearer ${token}`
        }

      }
      );
      const data = await res.json();
      if(res.ok){
        setDataFetch(data);
        setIsLoading(false);
        

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
              placeholder="Search reviews by name provider..." 
              className="w-full bg-slate-50 border-none rounded-lg py-2.5 pl-10 text-sm focus:ring-2 focus:ring-blue-100 outline-none"
              value={searchQuery}
              onChange={(e)=>setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <select className="rounded-lg p-2 bg-slate-50 border border-slate-200 text-sm" value={`${sortKey}:${sortOrder}`} onChange={(e)=>{
              const [k,o] = e.target.value.split(":");
              setSortKey(k); setSortOrder(o as 'asc'|'desc');
            }}>
              <option value="date:desc">Date: Newest</option>
              <option value="date:asc">Date: Oldest</option>
              <option value="provider:asc">Provider: A-Z</option>
              <option value="provider:desc">Provider: Z-A</option>
            </select>
          </div>
         
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

               {displayedData.map((data:any,i:number)=>(
                 <Historyitem key={i} data={data}/>
               ))}
            
                
            

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
       {isLoading && (
              
        <div className="flex h-[40vh] items-center justify-center text-gray-500 italic">
          <Spinner size="xl" className="text-slate-400"/>
        </div>
              
            )}
        {dataFetch?.Data && !isLoading && dataFetch.Data.length === 0 && (
              <div className="flex h-[40vh] items-center justify-center text-gray-500 italic">
                <p>No history found</p>
              </div>
            )}
       </div>
    </main>
      </div>
    )
    }