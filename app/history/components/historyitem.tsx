'use client'
import { ArrowUp,ArrowDown } from "lucide-react";
import { useState } from "react"
export default function Historyitem({data}:any){
    const [isShow,setIsShow] = useState(false);
    function handleViewbutton(){
        if(isShow === false){
            setIsShow(true);
        }
        else{
            setIsShow(false)
        }
    }
    return(
        <tr className="hover:bg-slate-50/50 transition-colors group " onClick={()=>handleViewbutton() }>
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
                    <button className=" text-slate-600 font-bold flex cursor-default items-center gap-3 pr-10">View {isShow?(<ArrowUp size={15}/>):(<ArrowDown size={15}/>)}</button>
                  </td>
                </tr>
    )
    
}