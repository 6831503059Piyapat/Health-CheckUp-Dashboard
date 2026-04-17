'use client';
import React, { useState, useEffect } from 'react';
import { Shield, Lock, Mail, KeyRound, ArrowRight, Eye, EyeOff, Headset, FileText, Key } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Spinner } from '@heroui/react';
import AuthNavbar from '../components/AuthNavbar';
import Checkpassword from '../register/components/Checkpassword';

type Step = 'email' | 'reset';

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordCon, setPasswordCons] = useState<boolean>(false);

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirm, setIsShowConfirm] = useState(false);

  const [errorEmail, setErrorEmail] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [errorConfirm, setErrorConfirm] = useState('');
  const [info, setInfo] = useState('');

  const [isPending, setIsPending] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && seconds > 0) {
      interval = setInterval(() => setSeconds((p) => p - 1), 1000);
    } else if (seconds === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  async function handleSendCode() {
    setErrorEmail('');
    setInfo('');
    if (!email) { setErrorEmail('Email is required.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErrorEmail('Please enter a valid email address.'); return; }

    setIsPending(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PORT}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStep('reset');
        setInfo(`We sent a reset code to ${email}.`);
        setSeconds(60);
        setIsActive(true);
      } else if (res.status === 400) {
        const result = await res.json().catch(() => ({}));
        setErrorEmail(result?.message || 'No account found with that email.');
      } else {
        setErrorEmail('Something went wrong. Try again later.');
      }
    } finally {
      setIsPending(false);
    }
  }

  async function handleResend() {
    if (isActive) return;
    setSeconds(60);
    setIsActive(true);
    await fetch(`${process.env.NEXT_PUBLIC_PORT}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
  }

  async function handleReset() {
    setErrorCode('');
    setErrorPassword('');
    setErrorConfirm('');
    let valid = true;

    if (!code) { setErrorCode('Please enter the code.'); valid = false; }
    if (!password) { setErrorPassword('Password is required.'); valid = false; }
    else if (password.includes(' ')) { setErrorPassword('Password cannot contain spaces.'); valid = false; }
    else if (!passwordCon) { setErrorPassword('Password does not meet requirements.'); valid = false; }
    if (!passwordConfirm) { setErrorConfirm('Confirm Password is required.'); valid = false; }
    else if (password !== passwordConfirm) { setErrorConfirm('Passwords do not match.'); valid = false; }
    if (!valid) return;

    setIsPending(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PORT}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, password }),
      });
      if (res.ok) {
        router.push('/auth/login');
      } else if (res.status === 400) {
        const result = await res.json().catch(() => ({}));
        setErrorCode(result?.message || 'Invalid or expired reset code.');
      } else {
        setErrorCode('Something went wrong. Try again later.');
      }
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
    <AuthNavbar/>
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-3 sm:p-4">
    
      <main className="w-full max-w-2xl flex-grow flex flex-col items-center justify-center px-0 sm:px-4 py-8 sm:py-12">
      
        {/* Login Card */}
        <div className="bg-white p-5 sm:p-8 shadow shadow-xl w-full max-w-[500px] rounded-xl">
          <h1 className="text-center text-[#1E40AF] mb-5 text-2xl sm:text-3xl font-bold tracking-tight mb-2">
          {step === "reset" && "Reset Password"}
          {step === "email" && "Forgot Password"}
            
          
          </h1>
          {step === "email" && (
          <h1 className='text-slate-600 mb-2 text-sm sm:text-base'>
            Enter your email to receive a reset code
          </h1>
          )}
          {errorEmail && (
            <div className="mb-6 p-3 bg-red-50 border-l-4 rounded-md border-red-500 text-red-700 text-sm rounded-r-lg">
              {errorEmail}
            </div>
          )}
          {errorPassword && (
            <div className="mb-6 p-3 bg-red-50 border-l-4 rounded-md border-red-500 text-red-700 text-sm rounded-r-lg">
              {errorPassword}
            </div>
          )}
           {step === "reset" && (
            <div className="space-y-6">
            
              <>
                {/* Full Name */}
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase tracking-wider">Reset Code</label>
                  <div className="relative group">
                    <Key className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${errorCode ? 'text-red-400' : 'text-gray-400 group-focus-within:text-[#2563EB]'} transition-colors`} />
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Enter 6-digit code"
                      className={`w-full pl-12 pr-4 py-3 bg-[#F3F8FF] border-2 text-slate-800 ${errorCode ? 'border-red-100 focus:border-red-500' : 'border-transparent focus:border-[#2563EB]'} rounded-2xl focus:bg-white outline-none transition-all`}
                    />
                  </div>
                  {errorCode && <p className="text-red-500 text-xs mt-1 ml-1">{errorCode}</p>}
                </div>


                {/* Password Fields */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase tracking-wider">New Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#2563EB]" />
                      <input
                        type={isShowPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-12 py-3 bg-[#F3F8FF] text-slate-800 border-transparent rounded-2xl focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none transition-all"
                      />
                      <button type="button" onClick={() => setIsShowPassword(!isShowPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                        {isShowPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  
                  {/* Password Checker Component */}
                  <Checkpassword condition={password} setPasswordCons={setPasswordCons} />

                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase tracking-wider">Confirm Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#2563EB]" />
                      <input
                        type={isShowConfirm ? "text" : "password"}
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full pl-12 pr-12 py-3.5 bg-[#F3F8FF] border-2 text-slate-800 ${errorConfirm ? 'border-red-100 focus:border-red-500' : 'border-transparent focus:border-[#2563EB]'} rounded-2xl focus:bg-white outline-none transition-all`}
                      />
                      <button type="button" onClick={() => setIsShowConfirm(!isShowConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                        {isShowConfirm ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                      </button>
                    </div>
                    {errorConfirm && <p className="text-red-500 text-xs mt-1 ml-1">{errorConfirm}</p>}
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="w-full bg-[#0052EA] text-white font-bold py-3 rounded-full hover:bg-[#0041C2] shadow-lg shadow-blue-100 transition-all flex items-center justify-center space-x-2 active:scale-95"
                >
                  <span>Reset Password</span>
  
                  <ArrowRight className="h-5 w-5" />
                </button>
              <div className='justify-center flex'>
                 <button
                    disabled={isActive}
                    onClick={handleResend}
                    className={`text-sm font-bold ${isActive ? 'text-gray-400 cursor-not-allowed' : 'text-[#2563EB] hover:underline'}`}
                  >
                    resend code {isActive ? `(${seconds}s)` : ""}
                  </button>
               </div>
              </>
            
          </div>
           )}
          {step === "email" && (
<div className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className={`h-5 w-5 ${errorEmail ? 'text-red-400' : 'text-gray-400 group-focus-within:text-[#2563EB]'} transition-colors`} />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@hospital.com"
                  className={`w-full pl-11 pr-4 py-3 bg-[#F3F8FF] text-black border-2 ${errorEmail ? 'border-red-100 focus:border-red-500' : 'border-transparent focus:border-[#2563EB]'} rounded-xl focus:bg-white outline-none transition-all placeholder:text-gray-400`}
                />
              </div>
            </div>

            

            {/* Login Button */}
            <button
              type="button"
              onClick={handleSendCode}
              disabled={isPending}
              className={`w-full  ${isPending ?"bg-[#0052EA]/50":"bg-[#0052EA] hover:bg-[#0041C2] hover:shadow-lg hover:shadow-blue-200"} text-white font-bold py-3.5 rounded-full  active:scale-[0.98] transition-all flex items-center justify-center space-x-2`}
            >
              <span>Send Reset Code</span>
              {!isPending &&(
            <ArrowRight className="w-5 h-5" />
              )}
              
               {isPending && (
              <Spinner color="current"/>
            )}
            </button>
             <p className="text-sm text-gray-600 text-center">
            Remember your password?{' '}
            <button onClick={() => router.push('/auth/Login')} className="text-[#2563EB] font-bold hover:underline">
              Login
            </button>
          </p>
          </div>
          )}
          
          
        </div>

       
      </main>

     
      
    </div>
    </>
  );
}
