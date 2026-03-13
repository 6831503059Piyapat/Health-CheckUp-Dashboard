'use client';
import React from 'react';
import { Shield, Lock, User, Building2, Headset, FileText, ArrowRight } from 'lucide-react';
import LocalNavbar from '@/app/components/LocalNavbar';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export default function Login() {
  const router = useRouter();
 function handleSubmit(){
    router.push('/');
 }
    return (
    <>
        <LocalNavbar />
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Side: Branding & Info */}
        <div className="md:w-5/12 bg-blue-600 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Background Decorative Element */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-white"></div>
          </div>

          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-8">
              <div className="text-white">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                   <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
                </svg>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Dedicated to <br /> Patient Care.
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed">
              Access clinical records, manage appointments, and coordinate with your team securely from any location.
            </p>
          </div>

          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">HIPAA Compliant</p>
                <p className="text-xs text-blue-200 uppercase tracking-wider">End-to-end encrypted data</p>
              </div>
            </div>
            
            <p className="italic text-blue-200 text-sm border-t border-white/10 pt-6">
              "Technology at the service of healthcare excellence."
            </p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="md:w-7/12 p-8 md:p-16 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Doctor Login</h2>
            <p className="text-slate-500 mb-10 text-sm">Enter your credentials to access the hospital system.</p>

            <div  className="space-y-6">
              {/* Doctor ID */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Doctor ID / Email</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="DR-123456 or name@hospital.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Hospital Code */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Hospital Code</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="e.g. CITY-GEN-01"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-slate-700">Password</label>
                  <a href="#" className="text-xs font-bold text-blue-600 hover:underline">Forgot Password?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Remember Checkbox */}
              <div className="flex items-center gap-2">
                <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <label htmlFor="remember" className="text-sm text-slate-500">Remember this workstation</label>
              </div>

              {/* Submit Button */}
              <button 
                type="button" 
                onClick={()=>handleSubmit()}
                className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
              >
                Log In to Dashboard
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Footer Links */}
            <div className="mt-12">
              <div className="flex justify-center gap-6 mb-4">
                <button className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-xs font-medium uppercase tracking-wide">
                  <Headset className="w-4 h-4" /> Technical Support
                </button>
                <button className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-xs font-medium uppercase tracking-wide">
                  <FileText className="w-4 h-4" /> IT Policy
                </button>
              </div>
              <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-[0.15em]">
                Restricted to authorized medical personnel only
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}