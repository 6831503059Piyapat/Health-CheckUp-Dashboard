'use client'
import Image from "next/image";
import Link from "next/link";
import {motion} from "framer-motion"
import ChartLanding from "./components/ChartLanding";
import ChartLandingPre from "./components/ChartLadingPre";
import { useRouter } from "next/navigation";
import AuthNavbar from "./auth/components/AuthNavbar";
export default function Home() {
  const router = useRouter();
  return (
    <main className="bg-white min-h-screen text-gray-900">

      {/* Navbar */}
      <div className="sticky top-0 z-52">
      <AuthNavbar />
      </div>
      

      {/* Hero */}
      <section className="grid bg-white gap-8 px-4 md:px-10 py-12 md:py-20 justify-center items-center">
        <div className="justify-center z-49 max-w-3xl mx-auto text-center px-4">
          <h1 className="text-2xl md:text-4xl font-bold mb-4 uppercase">
            Your clinical data beautifully mastered
           </h1>
          <p className="text-gray-600 mb-6 text-center max-w-2xl mx-auto">
            Transform complex health records into clear, actionable insights
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 w-full sm:w-auto" onClick={()=>router.push("/auth/login")}>
              Start Free Trial
            </button>
            <button className="border px-6 py-3 rounded-lg w-full sm:w-auto">
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
