'use client';
import { useState,useEffect } from "react";
import Navbar from "../components/Navbar";
import { useRouter } from "next/navigation";
import ChartDashboard from "./components/ChartDashboard";
import { Skeleton } from "@heroui/react";
import Result from "./components/Result";
import DropDown from "./components/dropDown";
import {jwtDecode,JwtPayload} from "jwt-decode";
import CardStatus from "./components/CardStatus";
import { Lightbulb } from "lucide-react";
import { parseISO, format } from 'date-fns';
import { div } from "framer-motion/client";
import AuthNavbar from "../auth/components/AuthNavbar";

export default function Home() {
  const router = useRouter();
  const [dataFetch,setDataFetch] = useState<any>();
  const [dataFetchData,setDataFetchData] = useState<any>();
  // For graph
  const [lengthData,setLengthData] = useState<string>();
  const [typeData,setTypeData] = useState<string>("Fasting blood sugar");
  const [resulUi,setResultUi] = useState<boolean>();
  const [isDanger,setIsDanger] = useState<boolean>(false);
const latest = (dataFetchData && dataFetchData.length > 0) 
  ? dataFetchData.reduce((prev: any, current: any) => {
      const prevDate = new Date(prev.dateFile).getTime();
      const currentDate = new Date(current.dateFile).getTime();
      return currentDate > prevDate ? current : prev;
    })
  : null;  
   type SuggestionValue =
    | string
    | {
        suggestion?: string;
        Risk_of_disease?: string | null;
        Prevention_Reduction?: string;
        [k: string]: any;
      };

  type ParsedSuggestion = { key: string; suggestion?: string; risk?: string | null };

const extractRiskSuggestions = (suggestionData?: Record<string, SuggestionValue>): ParsedSuggestion[] => {
    if (!suggestionData || typeof suggestionData !== 'object') return [];

    return Object.entries(suggestionData)
      .filter(([key, val]) => {
        if (val == null) return false;
        if (typeof val === 'string') {
          return val.trim() !== 'Data not provided' && /_suggestion$/i.test(key);
        }
        if (typeof val === 'object') {
          const risk = (val as any).Risk_of_disease;
          return risk !== undefined && String(risk).trim() !== 'Data not provided';
        }
        return false;
      })
      .map(([key, val]) => {
        const baseKey = key.replace(/_suggestion$/i, '');
        if (typeof val === 'string') {
          return { key: baseKey, suggestion: val, risk: undefined };
        }
        const suggestionText = (val as any).Prevention_Reduction !== undefined ? String((val as any).Prevention_Reduction) : undefined;
        const riskText = (val as any).Risk_of_disease !== undefined ? String((val as any).Risk_of_disease) : undefined;
        return { key: baseKey, suggestion: suggestionText, risk: riskText };
      });
  };
  const riskFiltered = (dataFetchData ?? [])
    .map((item: any) => ({ ...item, suggestions: extractRiskSuggestions(item?.suggestionData) }))
    .filter((item: any) => item.suggestions && item.suggestions.length > 0);

function typeDataRisk(typeDisease:string){
  switch (typeDisease){
  case "Body Mass Index":   return dataFetchData[0]?.suggestionData.bmi_suggestion.Risk_of_disease ||  'No data';
  case "Fasting blood sugar": return dataFetchData[0]?.suggestionData.fbs_suggestion.Risk_of_disease || 'No data';
  case "Cholesterol":       return dataFetchData[0]?.suggestionData.cholesterol_suggestion.Risk_of_disease || 'No data';
  case "HDL":               return dataFetchData[0]?.suggestionData.hdl_suggestion.Risk_of_disease || 'No data';
  case "LDL":               return dataFetchData[0]?.suggestionData.ldl_suggestion.Risk_of_disease || 'No data';
  case "Blood pressure":    return dataFetchData[0]?.suggestionData.bloodPressure_suggestion.Risk_of_disease || 'No data';
  case "Triglyceride":      return dataFetchData[0]?.suggestionData.triglycerides_suggestion.Risk_of_disease || 'No data';
  case "Creatinine":        return dataFetchData[0]?.suggestionData.creatinine_suggestion.Risk_of_disease || 'No data';
  case "ALT":               return dataFetchData[0]?.suggestionData.sgpt_suggestion.Risk_of_disease || 'No data';
  case "Hemoglobin":        return dataFetchData[0]?.suggestionData.hemoglobin_suggestion.Risk_of_disease || 'No data';
  case "White blood cell":  return dataFetchData[0]?.suggestionData.wbc_suggestion.Risk_of_disease || 'No data';
  case "Platelet":          return dataFetchData[0]?.suggestionData.platelets_suggestion.Risk_of_disease || 'No data';
  case "Oxygen level":      return dataFetchData[0]?.suggestionData.spo2_suggestion.Risk_of_disease || 'No data';
  case "Heart rate":        return dataFetchData[0]?.suggestionData.heartRate_suggestion.Risk_of_disease || 'No data';
}
}
  
  // Fetch data from backend

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
      }
      else{
        router.push('/auth/login');
      }
    const handleFetch = async()=>{
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_PORT}/users/me`,{
          headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
          }
        });
        if(res.status === 401){ localStorage.removeItem('token'); router.push('/auth/login'); return; }
        const data = await res.json();
        if(res.ok){
          setDataFetch(data);
          setDataFetchData(Array.isArray(data.Data) ? data.Data : Array.isArray(data.data) ? data.data : []);
        }
      } catch { /* network error — keep empty state */ }
    }
    handleFetch();
     
  },[]);
   function formatDate(d: any) {
        if (!d) return 'N/A';
        try {
          const dt = typeof d === 'string' ? parseISO(d) : (d instanceof Date ? d : new Date(d));
          return format(dt, 'dd MMM yyyy');
        } catch (e) {
          return String(d);
        }
      }
  function safeGetLatest(dataFetchData?: any[]) {
  if (!dataFetchData || dataFetchData.length === 0) return null;
  // choose entry with latest dateFile if available, otherwise last element
  try {
    return dataFetchData.reduce((prev: any, curr: any) => {
      const p = new Date(prev?.dateFile || prev?.date || 0).getTime();
      const c = new Date(curr?.dateFile || curr?.date || 0).getTime();
      return c > p ? curr : prev;
    });
  } catch {
    return dataFetchData[dataFetchData.length - 1];
  }
}
return(
  <>
  <div className="sticky top-0">
    <AuthNavbar/>
  </div>
   
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
     
      <Navbar />
      {/* DASHBOARD PAGE */}
  
    <main className="ml-64 flex-1 ">
      
      <div className="min-h-screen bg-slate-50 p-6 font-sans text-gray-700">
        
  <h1 className="text-[45px] text-black pl-5 mb-5">Dashboard</h1>

  <div className="grid grid-cols-3 gap-6">

    <main className={`col-span-2 rounded-2xl  ${isDanger ?'bg-red-50 border border-red-200' : 'bg-blue-50/80 border border-blue-200'} p-6 shadow-sm h-full flex flex-col`}>
     

      <div className="relative justify-end pb-4 ">

       <ChartDashboard typeData={typeData} lengthData={lengthData} isDanger={isDanger}/>

      </div>
        
    </main>

    <aside className="space-y-6">
      <section className="rounded-2xl shadow-sm overflow-hidden bg-white ">
      
        <div className="p-6 pb-2 mb-6">
       <h2 className="mb-4 font-semibold">Status Overview, {dataFetchData && dataFetchData.length > 0 ? formatDate(safeGetLatest(dataFetchData)?.dateFile) : 'N/A'}</h2>
     
        <div className="justify-between">
          {/* For Show what status mean */}
          <div className="justify-between ">
            <CardStatus typeData={typeData} setTypeData={setTypeData} dataFetchData={dataFetchData} setIsDanger={setIsDanger}/>
          </div>
        </div>
      </div> 
    </section>

    </aside>
   
  </div>
   <span className="justify-center  items-center ">
            {dataFetchData && dataFetchData.length > 0 ? (
              (() => {
                // map human-readable metric to suggestion key used in suggestionData
                const suggestionKeyMap: Record<string, string> = {
                  'Body Mass Index': 'bmi',
                  'Fasting blood sugar': 'fbs',
                  'Cholesterol': 'cholesterol',
                  'HDL': 'hdl',
                  'LDL': 'ldl',
                  'Blood pressure': 'bloodPressure',
                  'Triglyceride': 'triglycerides',
                  'Creatinine': 'creatinine',
                  'ALT': 'sgpt',
                  'Hemoglobin': 'hemoglobin',
                  'White blood cell': 'wbc',
                  'Platelet': 'platelets',
                  'Oxygen level': 'spo2',
                  'Heart rate': 'heartRate',
                };

                const latestRecord = latest;
                if (!latestRecord) return null;
                const suggestions = extractRiskSuggestions(latestRecord?.suggestionData);
                const desiredKey = suggestionKeyMap[typeData || ''] || (typeData || '').replace(/\s+/g, '').toLowerCase();
                const match = suggestions.find((s) => s.key && String(s.key).toLowerCase() === String(desiredKey).toLowerCase());
                if (!match) return (
                  <div className=" w-full mx-auto" >

              </div>
                );
                return (
                  <div className=' transition-all w-full justify-center mt-5'>
                    <div className='flex w-full gap-5 justfy-center items-center '>
                      <div className={`gap-5 border border-purple-500/50 bg-purple-50 shadow shadow-lg shadow-purple-200 p-5 w-full rounded-lg flex`}>
                        <div>
                          <div className="flex gap-5 items-center mb-3">
                            <Lightbulb className="text-purple-500"/>
                            <h3 className='text-lg font-semibold text-purple-500'>Health Suggestion {typeData}</h3>
                          </div>
                          
                          <span className='text-sm flex items-center text-red-700'><p className="font-bold mr-9 text-red-800">Risk:</p>  {match.risk ?? 'N/A'}</span>

                          <span className='text-sm text-green-700 flex items-center'><p className="font-bold mr-2 text-green-800">Suggest:</p> {match.suggestion || 'N/A'}</span>
                        
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : (
              null
            )}

          </span>
</div>
    </main>
    
    </div>
    </>
  );
}
