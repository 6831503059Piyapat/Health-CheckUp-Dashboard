 'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Shield, Lock, User, Headset, FileText, 
  ArrowRight, ArrowLeft, EyeOff, Eye, ShieldCheck 
} from 'lucide-react';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import PendingState from './components/pendingState'; // ตรวจสอบ path ให้ถูกต้องนะครับ
import AuthNavbar from '../components/AuthNavbar';
import { Spinner } from '@heroui/react';

export default function Login() {
  const router = useRouter();
  const [isShowpassword, setIsShowpassword] = useState(false);
  
  // INPUT FORM
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success,setSuccess] = useState("");
  // Pending State
  const [ispending, setIspending] = useState(false);
  const [isOK, setIsOK] = useState(false);
  const [isUiShow, setIsUiShow] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp! < currentTime) {
          localStorage.removeItem("token");
        } else {
          router.push("/dashboard");
        }
      } catch (error) {
        localStorage.removeItem("token");
      }
    }
  }, [router]);

  async function handleSubmit() {
    if (!name || !password) {
      setError("Email and password are required.");
    } else {
      setError("");
      setIsUiShow(true);
      setIspending(true);

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_PORT}/auth/login`, {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: name,
            password: password,
          }),
        });
        const result = await res.json();

        if (res.ok) {
          setIsOK(true);
          setIspending(false);
          setSuccess(`Login Success Welcome ${name} !`);
          localStorage.setItem('token', result.access_token);
          setTimeout(() => router.push('/dashboard'), 1000);
        } else if (res.status === 401) {
          setIsOK(false);
          setIspending(false);
          setIsUiShow(false); // ปิด overlay เพื่อแสดง error
          setError("Username or password is incorrect.");
        } else {
          setIsOK(false);
          setIspending(false);
          setIsUiShow(false);
          setError("Something went wrong. Try again later.");
        }
      } catch (err) {
        setIsOK(false);
        setIspending(false);
        setIsUiShow(false);
        setError("Network error. Please check your connection.");
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between font-sans relative">
      <AuthNavbar />
      {/* <PendingState ispending={ispending} isOK={isOK} setIsUiShow={setIsUiShow} isUiShow={isUiShow} /> */}

      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12">
        {/* Logo & Header */}
        <div className="text-center mb-8">
         
          
        
        </div>

        {/* Login Card */}
        <div className="bg-white p-8  shadow shadow-xl w-full max-w-[500px]">
          <h1 className="text-center text-[#1E40AF] mb-5 text-3xl font-bold tracking-tight mb-2">
            Sign in
          </h1>
          {error && (
            <div className="mb-6 p-3 bg-red-50 border-l-4 rounded-md border-red-500 text-red-700 text-sm rounded-r-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-3 bg-greens-50 border-l-4 rounded-md border-green-500 text-green-700 text-sm rounded-r-lg">
              {success}
            </div>
          )}
           

          <div className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Username or email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className={`h-5 w-5 ${error ? 'text-red-400' : 'text-gray-400 group-focus-within:text-[#2563EB]'} transition-colors`} />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="name@hospital.com"
                  className={`w-full pl-11 pr-4 py-3 bg-[#F3F8FF] text-black border-2 ${error ? 'border-red-100 focus:border-red-500' : 'border-transparent focus:border-[#2563EB]'} rounded-xl focus:bg-white outline-none transition-all placeholder:text-gray-400`}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-[13px] font-bold text-gray-700 uppercase tracking-wide">
                  Password
                </label>
                <Link href="#" className="text-sm font-bold text-[#2563EB] hover:text-blue-700 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 ${error ? 'text-red-400' : 'text-gray-400 group-focus-within:text-[#2563EB]'} transition-colors`} />
                </div>
                <input
                  type={isShowpassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-12 text-black py-3 bg-[#F3F8FF] border-2 ${error ? 'border-red-100 focus:border-red-500' : 'border-transparent focus:border-[#2563EB]'} rounded-xl focus:bg-white outline-none transition-all placeholder:text-gray-400`}
                />
                <button 
                  type="button"
                  onClick={() => setIsShowpassword(!isShowpassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {isShowpassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
            </div>

            

            {/* Login Button */}
            <button
              type="button"
              onClick={handleSubmit}
              className={`w-full  ${ispending ?"bg-[#0052EA]/50":"bg-[#0052EA] hover:bg-[#0041C2] hover:shadow-lg hover:shadow-blue-200"} text-white font-bold py-3.5 rounded-full  active:scale-[0.98] transition-all flex items-center justify-center space-x-2`}
            >
              <span>Log In</span>
              {!ispending &&(
            <ArrowRight className="w-5 h-5" />
              )}
              
               {ispending && (
              <Spinner color="current"/>
            )}
            </button>
             <p className="text-sm text-gray-600 text-center">
            Don't have an account?{' '}
            <button onClick={() => router.push('/auth/register')} className="text-[#2563EB] font-bold hover:underline">
              Register Now
            </button>
          </p>
          </div>
          
        </div>

       
      </main>

     
    </div>
  );
}