import Navbar from "../components/Navbar";
import { Search,Filter,ArrowDown } from "lucide-react";
import FilterSelect from "../components/FilterSelect";
const patients = [
  { name: 'Alice Henderson', id: '#PT-82731', lastVisit: 'Oct 12, 2023', type: 'pdf', avatar: 'https://i.pravatar.cc/150?u=alice' },
  { name: 'James Wilson', id: '#PT-82745',  lastVisit: 'Oct 21, 2023', type: 'jpeg', avatar: 'https://i.pravatar.cc/150?u=james' },
  { name: 'Sarah Miller', id: '#PT-82752', lastVisit: 'Oct 20, 2023', type: 'png', avatar: 'https://i.pravatar.cc/150?u=sarah' },
  { name: 'Robert Chen',id: '#PT-82760', lastVisit: 'Oct 15, 2023', type: 'pdf', avatar: 'https://i.pravatar.cc/150?u=robert' },
  { name: 'Emily Davis', id: '#PT-82768', lastVisit: 'Oct 22, 2023', type: 'pdf', avatar: 'https://i.pravatar.cc/150?u=emily' },
];
export default function History(){
    return(
      <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
        <Navbar/>
        <main className="ml-64 flex-1 p-8 ">
       <div className="bg-white h-[100vh] shadow-xl rounded-md p-5">
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
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="w-full border-b border-slate-100 bg-slate-100 ">
             <td className=" text-slate-400 uppercase text-[14px] font-bold p-5 pl-10 ">Date</td>
             <td className=" text-slate-400 uppercase text-[14px] font-bold p-5 pl-10 ">Provider</td>
             <td className=" text-slate-400 uppercase text-[14px] font-bold p-5 pl-10 ">Status</td>
             <td></td>

            </thead>
            <tbody className="divide-y divide-slate-50">

             {patients.map((data,i)=>
              <tr className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      
                        <p className="font-bold text-slate-800">{data.lastVisit}</p>
                     
                    </div>
                  </td>
                
                
                  <td className="px-4 py-4 text-slate-600 pl-10 font-bld">{data.name}</td>
                  <td className="px-4 py-4 text-slate-600 pl-10 font-bold w-[10px] text-center">
                    <h1 className=" rounded-full text-yellow-600 p-1">Pending</h1>
                  </td>
                  <td className="px-6 py-4 text-right justify-end flex">
                    <button className=" text-slate-600 font-bold flex cursor-default items-center gap-3 pr-10">View <ArrowDown size={15}/></button>
                  </td>
                </tr>
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