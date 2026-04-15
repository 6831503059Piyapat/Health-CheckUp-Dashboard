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
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Start Free Trial
            </button>
            <button className="border px-6 py-3 rounded-lg">
              See Sample Report
            </button>
          </div>
        </div>

        {/* IMAGE PLACEHOLDER */}
        <div className="rounded-xl p-5 absolute ">
          <div className="flex items-center justify-center h-[220px] sm:h-[260px] md:h-[320px] lg:h-[380px]">
              
              <motion.div
              
        animate={{
          y: [0, -20, 0],         // ลอยขึ้น 20px แล้วกลับมาที่เดิม
          rotateX: [15, 15, 15],    // หมุนแกน X เล็กน้อย
          rotateY: [15, 15, 15],    // หมุนแกน Y เล็กน้อย
        }}
        transition={{
          duration: 8,           
          repeat: Infinity,       
          ease: "easeInOut",     
        }}
        style={{
          perspective: 1000,      
        }}
        className="w-full z-0 rounded-xl max-w-[720px] h-[220px] sm:h-[260px] md:h-[320px] lg:h-[380px]"
      >
        <div className="bg-slate-500 border border-black w-100 h-full rounded">

        </div>
      </motion.div>
            </div>
          </div>
        
      </section>

      {/* Graph Section */}
      <section className="px-10 py-10">
        <h2 className="text-xl font-semibold mb-4">
          Generate TrendLine Graph
        </h2>

        <div className="bg-slate-50 rounded-xl shadow justify-center flex
         p-6 h-[60vh] ">
          {/* GRAPH PLACEHOLDER */}
         
                 <Image src="/Graph.png" width={1000} height={700} alt="Graph"/>
 
          
        </div>
      </section>

      {/* Precision Analysis */}
      <section className="px-10 py-10">
        <h2 className="text-xl font-semibold mb-6">Precision Analysis</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {["Improved Patterns", "Healthy Variability", "Emerging Trends"].map(
            (item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow"
              >
                <div className="h-10 w-10 bg-blue-100 rounded mb-4"></div>
                <h3 className="font-semibold mb-2">{item}</h3>
                <p className="text-sm text-gray-500">
                  Placeholder description for this analysis feature.
                </p>
              </div>
            )
          )}
        </div>
      </section>

      {/* Surgical Document Comparison */}
      <section className="px-10 py-10">
        <h2 className="text-xl font-semibold mb-4">
          Ai predict Trendline
        </h2>

        <div className="bg-white rounded-xl shadow p-6">
          {/* COMPARISON PLACEHOLDER */}
          <div className="h-[200px] flex items-center justify-center text-gray-400">
           <ChartLandingPre/>
          </div>
        </div>
      </section>

      {/* Scheduling */}
      <section className="grid md:grid-cols-2 gap-8 px-10 py-10">
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Proactive Scheduling
          </h2>
          <p className="text-gray-600">
            Automatically schedule follow-ups based on trends and anomalies.
          </p>
        </div>

        {/* CALENDAR PLACEHOLDER */}
        <div className="bg-white rounded-xl shadow p-6 h-[250px] flex items-center justify-center text-gray-400">
          TODO: Calendar Component
        </div>
      </section>

     

      {/* Footer */}
      <footer className="text-center text-gray-400 text-sm py-6">
        © 2026 LabMetrics. All rights reserved.
      </footer>
    </main>
  );
}
