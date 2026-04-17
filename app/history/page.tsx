'use client'
import Navbar from "../components/Navbar";
import { Search,Filter,ArrowDown,ArrowUp } from "lucide-react";
import FilterSelect from "../components/FilterSelect";
import Historyitem from "./components/historyitem";
import { useEffect,useState,useMemo } from "react";
import { usePathname,useRouter } from "next/navigation";
import {jwtDecode,JwtPayload} from "jwt-decode";
import { Spinner } from "@heroui/react";
import { set } from "react-hook-form";
import AuthNavbar from "../auth/components/AuthNavbar";
export default function History(){
  const pathName = usePathname();
  const [dataFetch,setDataFetch] = useState<any>([]);
  const [isLoading,setIsLoading] = useState(true);
  const [searchQuery,setSearchQuery] = useState<string>('');
  const [sortKey,setSortKey] = useState<string>('date');
  const [sortOrder,setSortOrder] = useState<'asc'|'desc'>('desc');
  const router = useRouter();
  const displayedData = useMemo(()=>{
    const list = Array.isArray(dataFetch?.Data) ? [...dataFetch.Data] : Array.isArray(dataFetch?.data) ? [...dataFetch.data] : [];
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
  const uploadsSummary = useMemo(() => {
    const list = Array.isArray(dataFetch?.Data) ? dataFetch.Data : Array.isArray(dataFetch?.data) ? dataFetch.data : [];
    const now = new Date();
    const total = list.length ||"-";
    const thisYear = list.filter((d: any) => {
      const dt = d?.dateFile ? new Date(d.dateupload) : null;
      return dt ? dt.getFullYear() === now.getFullYear() : false;
    }).length || "-";
    const thisMonth = list.filter((d: any) => {
      const dt = d?.dateFile ? new Date(d.dateupload) : null;
      return dt ? dt.getFullYear() === now.getFullYear() && dt.getMonth() === now.getMonth() : false;
    }).length || "-";
    return { total, thisYear, thisMonth };
  }, [dataFetch]);
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
      <>
      <div className="sticky top-0 z-50">
          <AuthNavbar/>
        </div>
      <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 ">
        <Navbar/>
        <main className="flex-1 md:ml-64 px-4 sm:px-6 pt-10 sm:pt-8 pb-6 sm:py-8 overflow-y-auto [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:display-none ">
        <h1 className="text-3xl sm:text-[42px] ml-5 mb-5">History Upload</h1>
       
       <div className="bg-white rounded-xl shadow mb-2 shadow-lg shadow-blue-500/10 py-4 justify-between flex flex-col sm:flex-row gap-4">
        <div className="flex-1 text-center sm:border-r border-slate-200 px-4">
          <p className="text-sm text-[#0068F0]/80 font-bold">Total Uploads</p>
          <p className="text-2xl font-bold text-blue-700">{uploadsSummary.total}</p>
        </div>
        <div className="flex-1 text-center sm:border-r border-slate-200 px-4">
          <p className="text-sm text-[#0068F0]/80 font-bold">Uploads This Year</p>
          <p className="text-2xl font-bold text-blue-700">{uploadsSummary.thisYear}</p>
        </div>
        <div className="flex-1 text-center px-4">
          <p className="text-sm text-[#0068F0]/80 font-bold">Uploads This Month</p>
          <p className="text-2xl font-bold text-blue-700">{uploadsSummary.thisMonth}</p>
        </div>
       </div>
       <div className="h-full rounded-md p-2 bg-white">
       <div className="bg-white p-2 rounded-xl border border-blue-200 shadow shadow-blue-500/10 shadow-lg flex flex-col md:flex-row gap-4 mb-2 items-stretch md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder={`Search reviews by provider or name...`} 
                className="w-full pl-10 border-none rounded-lg py-2.5 text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                value={searchQuery}
                onChange={(e)=>setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              )}
            </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select className="w-full md:w-auto rounded-lg p-2 bg-blue-50 border border-blue-200 text-sm" value={`${sortKey}:${sortOrder}`} onChange={(e)=>{
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
        <div className="bg-white rounded-xl border border-blue-200 overflow-hidden ">
          <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="w-full border-b border-slate-100 bg-[#006CFA] ">
              <tr>
                 <th className=" text-slate-100 uppercase text-[13px] font-bold p-4 sm:p-5 pl-4 sm:pl-10 border-r border-slate-200 text-center">Date Upload</th>
             <th className="hidden sm:table-cell text-slate-100 uppercase text-[13px] font-bold p-4 sm:p-5 pl-4 sm:pl-10 border-r border-slate-200 text-center">Date info</th>

             <th className=" text-slate-100 uppercase text-[13px] font-bold p-4 sm:p-5 pl-4 sm:pl-10  text-center">Provider</th>
          
             <th className="hidden sm:table-cell text-slate-100 uppercase text-[13px] font-bold p-4 sm:p-5 pl-4 sm:pl-10 text-center  border-r border-slate-200"></th>
             <th></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 ">

               {displayedData.map((data:any,i:number)=>(
                 <Historyitem key={i} data={data}/>
               ))}
            
                
            

            </tbody>
          </table>
          </div>
      
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
        {!isLoading && displayedData.length === 0 && (
              <div className="flex h-[40vh] items-center justify-center text-gray-500 italic">
                <p>No history found</p>
              </div>
            )}
       </div>
    </main>
      </div>
      </>
    )
    }