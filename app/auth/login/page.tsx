'use client';
import React from 'react';
import { Shield, Lock, User, Building2, Headset, FileText, ArrowRight,EyeOff,Eye } from 'lucide-react';
import LocalNavbar from '@/app/components/LocalNavbar';
import { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {jwtDecode,JwtPayload} from 'jwt-decode';
export default function Login() {
  const router = useRouter();
  const [isShowpassword,setIsShowpassword] = useState(false);
  // INPUT FORM
  const [name,setName] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");
  useEffect(()=>{
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const currentTime = Date.now() / 1000; 

      if (decoded.exp! < currentTime) {
        localStorage.removeItem("token");
      } else {
        router.push("/");
      }
    } catch (error) {
      localStorage.removeItem("token");
    }
  }

},[]);
 async function handleSubmit(){
  

    if(!name || !password){
      console.log("Login Failed");
      setError("Email and password are required.");
      
    }
    else{
      setError("");
      const res = await fetch(`${process.env.NEXT_PUBLIC_PORT}/auth/login`,{
    method:"POST",
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      email:name,
      password:password,
    }),
  });
  const result = await res.json();

  if(res.ok){
    localStorage.setItem('token',result.access_token);
    router.push('/');
  }
  else{
    setError("");
  }
  

    }

 }
    return (
    <>
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
              Life Markers <br /> 
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
            <h2 className="text-3xl font-bold text-slate-800 mb-1">Login</h2>
             <p className="text-slate-500 mb-3 text-sm">Enter your username and password</p>
            {error && (
               <p className='text-white bg-red-500 p-1'>{error}</p>
            )}
           
            
           
            <div  className="space-y-6">
              {/* Doctor ID */}
             
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 mt-3">Username / Email</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    onChange={(e)=>setName(e.target.value)}
                    value={name}
                    placeholder="example:name@hospital.com"
                    className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 ${error? "focus:ring-red-500 border-red-500":" focus:ring-blue-500 border-slate-200"} focus:border-transparent transition-all`}
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
                    type={`${isShowpassword?"text":"password"}`} 
                    onChange={(e)=>setPassword(e.target.value)}
                    value={password||""}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 ${error? "focus:ring-red-500 border-red-500":" focus:ring-blue-500 border-slate-200"} focus:border-transparent transition-all`}
                  />
                  {isShowpassword?(<Eye onClick={()=>setIsShowpassword(!isShowpassword)} className='absolute right-5 cursor-pointer top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400'/>):(<EyeOff onClick={()=>setIsShowpassword(!isShowpassword)} className='absolute cursor-pointer right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400'/>)}
                  
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
                          <h1 className='text-center '>Don't have any an account? <button className='underline text-blue-500' onClick={()=>router.push('/auth/register')}>register</button></h1>

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