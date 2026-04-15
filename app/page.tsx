'use client'
import Image from "next/image";
import Link from "next/link";
import {motion} from "framer-motion"
import ChartLanding from "./components/ChartLanding";
import ChartLandingPre from "./components/ChartLadingPre";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  return (
    <main className="bg-white min-h-screen text-gray-900">
      {/* Navbar */}
      
      <div className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 ">
      <div className="w-full px-10 mx-auto py-3 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3">
          
          <span className="font-bold text-blue-800 text-[20px]">LifeMarkers</span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="gap-4 flex">
            <button onClick={()=>router.push('/auth/login')} className="text-sm cursor-pointer text-slate-600 hover:text-slate-800 inline-flex items-center gap-2">
              Login
            </button>
            <button onClick={()=>router.push('/auth/register')} className="cursor-pointer bg-blue-700 p-2 rounded-md text-sm text-slate-100 hover:bg-blue-800 inline-flex items-center gap-2">
              Get Started
            </button>
          </div>
         
        </div>
      </div>
    </div>

      {/* Hero */}
      <section className="grid bg-white  gap-8 px-10 py-35 justify-center items-center">
        <div className="justify-center z-49">
          <h1 className="text-4xl font-bold mb-4 uppercase text-center w-[450px]">
            Your clinical data beautifully mastered
           </h1>
          <p className="text-gray-600 mb-6 text-center w-full">
            Transform complex health records into clear, actionable insights
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700" onClick={()=>router.push("/auth/login")}>
              Start Free Trial
            </button>
            <button className="border px-6 py-3 rounded-lg">
              See Sample Report
            </button>
          </div>
        </div>

        {/* IMAGE PLACEHOLDER */}
        
        
      </section>

      {/* Graph Section */}
     
     

      {/* Footer */}
      <footer className="text-center text-gray-400 text-sm py-6">
        © 2026 LabMetrics. All rights reserved.
      </footer>
    </main>
  );
}
