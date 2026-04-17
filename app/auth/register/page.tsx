'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Shield, Lock, User, Headset, FileText, 
  ArrowRight, ArrowLeft, EyeOff, Eye, Mail, 
  KeyRound, CheckCircle2 
} from 'lucide-react';
import { jwtDecode, JwtPayload } from 'jwt-decode';

// Components (ตรวจสอบ Path ให้ถูกต้องตามโปรเจกต์คุณนะครับ)
import PendingCreate from './components/pendingCreate';
import Checkpassword from './components/Checkpassword';
import AuthNavbar from '../components/AuthNavbar';

export default function Register() {
  const router = useRouter();
  const [isShowpassword, setIsShowpassword] = useState(false);
  const [isShowConfirm, setIsShowConfirm] = useState(false);

  // INPUT FORM STATE
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [email, setEmail] = useState("");

  // ERROR MESSAGES
  const [errorName, setErrorName] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorConfirmPassword, setErrorConfirmPassword] = useState("");
  const [errorOTP, setErrorOTP] = useState("");

  // OTP & FLOW STATE
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [OTPstate, setOTPstate] = useState("");
  const [OTPConfirm, setOTPConfirm] = useState("");
  const [isOTPmatch, setIsOTPmatch] = useState(true);
  
  // COUNTDOWN STATE
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // PENDING STATE
  const [ispending, setIspending] = useState(false);
  const [isOK, setIsOK] = useState(false);
  const [isUipending, setIsUipending] = useState(false);
  const [passwordCon, setPasswordCons] = useState(false);

  // Countdown Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp! > currentTime) {
          router.push('/dashboard');
        }
      } catch (error) {
        localStorage.removeItem("token");
      }
    }
  }, [router]);

  // API Actions
  const sendEmail = async () => {
    setSeconds(60);
    setIsActive(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_PORT}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    if (res.ok) {
      setIsOTPSent(true);
      setOTPstate("Account created. Please verify your email.");
    }
  };

  const handleResend = async () => {
    setSeconds(60);
    setIsActive(true);
    await fetch(`${process.env.NEXT_PUBLIC_PORT}/auth/resend-code`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
  };

  const handleCheckOTP = async () => {
    if (!OTPConfirm) {
      setIsOTPmatch(false);
      setErrorOTP("Please enter the code.");
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_PORT}/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code: OTPConfirm }),
    });

    if (response.ok) {
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
          
          localStorage.setItem('token', result.access_token);
          setTimeout(() => router.push('/dashboard'), 1000);
        } else if (res.status === 401) {
         
        } else {
         
         
        }
      } catch (err) {
        
      }
      router.push('/auth/login');
    } else {
      setIsOTPmatch(false);
      setErrorOTP("Invalid code. Please try again.");
    }
  };

  const handleSubmit = async () => {
    let valid = true;
    if (!name || name.includes(" ")) { setErrorName("Valid name is required."); valid = false; } else setErrorName("");
    if (!email || !email.includes("@")) { setErrorEmail("Valid email is required."); valid = false; } else setErrorEmail("");
    if (!password || !passwordCon) { setErrorPassword("Password does not meet requirements."); valid = false; } else setErrorPassword("");
    if (password !== passwordConfirm) { setErrorConfirmPassword("Passwords do not match."); valid = false; } else setErrorConfirmPassword("");

    if (!valid) return;

    // Check availability and send OTP
    const res = await fetch(`${process.env.NEXT_PUBLIC_PORT}/auth/check-register`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    
    if (res.status === 401) {
      setErrorEmail("Email already exists.");
    } else if (res.ok) {
      sendEmail();
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <AuthNavbar />
      
      
      
      {isUipending && (
        <PendingCreate ispending={ispending} isOK={isOK} setIsUipending={setIsUipending} email={email} />
      )}

      <main className="flex-grow flex flex-col items-center justify-center px-4 py-8">
        

        {/* Form Card */}
        <div className="bg-white p-6 md:p-10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.08)] w-full max-w-full sm:max-w-[550px] mx-4 md:mx-0 border border-gray-100 relative overflow-hidden rounded-lg">
          <h1 className="text-center text-[#1E40AF] mb-4 text-2xl sm:text-3xl font-bold tracking-tight">
            Register
          </h1>
          <div className="space-y-6">
            {!isOTPSent ? (
              <>
                {/* Full Name */}
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase tracking-wider">Username</label>
                  <div className="relative group">
                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${errorName ? 'text-red-400' : 'text-gray-400 group-focus-within:text-[#2563EB]'} transition-colors`} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter username"
                      className={`w-full pl-12 text-slate-800 pr-4 py-2 sm:py-3 text-sm sm:text-base bg-[#F3F8FF] border-2 ${errorName ? 'border-red-100 focus:border-red-500' : 'border-transparent focus:border-[#2563EB]'} rounded-2xl focus:bg-white outline-none transition-all`}
                    />
                  </div>
                  {errorName && <p className="text-red-500 text-xs mt-1 ml-1">{errorName}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase tracking-wider">Email Address</label>
                  <div className="relative group">
                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${errorEmail ? 'text-red-400' : 'text-gray-400 group-focus-within:text-[#2563EB]'} transition-colors`} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className={`w-full pl-12 pr-4 text-slate-800 py-2 sm:py-3 text-sm sm:text-base bg-[#F3F8FF] border-2 ${errorEmail ? 'border-red-100 focus:border-red-500' : 'border-transparent focus:border-[#2563EB]'} rounded-2xl focus:bg-white outline-none transition-all`}
                    />
                  </div>
                  {errorEmail && <p className="text-red-500 text-xs mt-1 ml-1">{errorEmail}</p>}
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase tracking-wider">Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#2563EB]" />
                      <input
                        type={isShowpassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-12 py-2 sm:py-3 text-sm sm:text-base text-slate-800 bg-[#F3F8FF] border-transparent rounded-2xl focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none transition-all"
                      />
                      <button type="button" onClick={() => setIsShowpassword(!isShowpassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                        {isShowpassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
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
                        className={`w-full pl-12 text-slate-800 pr-12 py-2 sm:py-3 text-sm sm:text-base bg-[#F3F8FF] border-2 ${errorConfirmPassword ? 'border-red-100 focus:border-red-500' : 'border-transparent focus:border-[#2563EB]'} rounded-2xl focus:bg-white outline-none transition-all`}
                      />
                      <button type="button" onClick={() => setIsShowConfirm(!isShowConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                        {isShowConfirm ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                      </button>
                    </div>
                    {errorConfirmPassword && <p className="text-red-500 text-xs mt-1 ml-1">{errorConfirmPassword}</p>}
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full bg-[#0052EA] text-white font-bold py-3 rounded-full hover:bg-[#0041C2] shadow-lg shadow-blue-100 transition-all flex items-center justify-center space-x-2 active:scale-95 text-sm sm:text-base"
                >
                  <span>Create Account</span>

                  <ArrowRight className="h-5 w-5" />
                </button>
                 <p className="text-sm text-gray-600 text-center">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-[#2563EB] font-bold hover:underline">Log In</Link>
          </p>
              </>
            ) : (
              /* OTP VERIFICATION VIEW */
              <div className="space-y-6 py-4">
            <p className="text-gray-500 font-medium mx-auto">
           We've sent a 6-digit code to {email}
            </p>                
          <div className="relative group">
                  <KeyRound className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${!isOTPmatch ? 'text-red-400' : 'text-[#2563EB]'}`} />
                  <input
                    type="text"
                    maxLength={6}
                    value={OTPConfirm}
                    onChange={(e) => setOTPConfirm(e.target.value)}
                    placeholder="xxxxxx"
                    className={`w-full text-slate-800 pl-12 pr-4 py-3 sm:py-4 bg-[#F3F8FF] border-2 ${!isOTPmatch ? 'border-red-200' : 'border-[#2563EB]/20'} rounded-2xl text-center text-xl sm:text-2xl font-bold tracking-[0.5em] focus:bg-white outline-none transition-all`}
                  />
                </div>
                {errorOTP && <p className="text-red-500 text-center text-sm">{errorOTP}</p>}

                <button
                  onClick={handleCheckOTP}
                  className="w-full bg-[#2563EB] text-white font-bold py-3 rounded-full hover:bg-blue-700 shadow-lg transition-all"
                >
                  Verify & Complete
                </button>

                <div className="text-center">
                  <button
                    disabled={isActive}
                    onClick={handleResend}
                    className={`text-sm font-bold ${isActive ? 'text-gray-400 cursor-not-allowed' : 'text-[#2563EB] hover:underline'}`}
                  >
                    Resend Code {isActive ? `(${seconds}s)` : ""}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        
      </main>

      
    </div>
  );
}