'use client';
import React from 'react';
import { Shield, Lock, User, Building2, Headset, FileText, ArrowRight,EyeOff,Eye,Mail,KeyRound,CircleX,CircleCheck } from 'lucide-react';
import LocalNavbar from '@/app/components/LocalNavbar';
import { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PendingCreate from './components/pendingCreate';
import Checkpassword from './components/Checkpassword';
import {jwtDecode,JwtPayload} from 'jwt-decode';
// interface return after register success
interface AuthAfterRegister {
  email:string,
}
export default function Register() {
  const router = useRouter();
  const [isShowpassword,setIsShowpassword] = useState(false);
  const [isShowConfirm,setIsShowConfirm] = useState(false);
  // INPUT FORM
  const [name,setName] = useState("");
  const [password,setPassword] = useState("");
  const [passwordConfirm,setPasswordConfirm] = useState("");
  const [email,setEmail] = useState("");
  // Error input prevent message
  const [errorName,setErrorName]=useState<string>();
  const [errorEmail,setErrorEmail] = useState<string>();
  const [errorPassword,setErrorPassword] = useState<string>();
  const [errorConfirmPassword,setErrorConfirmPassword]=useState<string>();
  const [errorOTP,setErrorOTP] = useState<string>();
  // OTP STATE
  const [OTPstate,setOTPstate]=useState("");
  const [OTPConfirm,setOTPConfirm]= useState("");
  const [isOTPmatch,setIsOTPmatch] = useState<boolean>(true);
  // Data After Register
  const [returnRegis,setReturnRegis] = useState<AuthAfterRegister>({email:""}); 
  // Countdown OTP resend STATE
  const [seconds, setSeconds] = useState(0); //START with 0
  const [isActive, setIsActive] = useState(false);
  // pending create register state
  const [ispending,setIspending] = useState<boolean>(false);
  const [isOK,setIsOK] = useState<boolean>(false);
  const [isUipending,setIsUipending] = useState<boolean>(false);
  // password Condition all
  const [passwordCon,setPasswordCons] = useState<boolean>(false);
  // Time count to resend OTP 
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

useEffect(()=>{
  const token = localStorage.getItem("token");
  if (token) {
            try {
              const decoded = jwtDecode<JwtPayload>(token);
              const currentTime = Date.now() / 1000; 
        
              if (decoded.exp! < currentTime) {
                localStorage.removeItem("token");
                
              }
              else{
                router.push('/');
              }
            } catch (error) {
              localStorage.removeItem("token");
              router.push('/auth/login');
            }
          }
});
  // Password : Piadwaf25@
  const checkPassword = ()=>{
    
  }
  // Function Check Email Format

// Functoin Compare OTP 
  const handleCeckOTP = async ()=>{
    if (OTPstate===OTPConfirm){
      setIsOTPmatch(true);
      setErrorOTP("");
      setIsUipending(true);
      setIspending(true);
          const res = await fetch(`${process.env.NEXT_PUBLIC_PORT}/auth/register`,{
    method:"POST",
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      email:email,
      name:name,
      password:password,
    }),
  });
  const result = await res.json();
  setReturnRegis(result);
   
  if(res.ok){
   setIsOK(true);
   setIspending(false);
    router.push("/auth/login");
      
  }
  else{
       setIsOK(false);
      setIspending(false);
    setErrorName("");
    setErrorEmail("");
      setErrorPassword("");
      setErrorConfirmPassword("");
  }
  
    }
    else{
      setIsOTPmatch(false);
      setErrorOTP("Invalid OTP. Please try again.");
    }


  }
  // Function Handle after user Click register button
 function handleSubmit(){
   if(name && password && passwordCon && passwordConfirm &&
    !name.includes(" ") && 
    !password.includes(" ") &&
    !email.includes(" ") &&
     password === passwordConfirm){
      setErrorName("");
      setErrorEmail("");
      setErrorPassword("");
      setErrorConfirmPassword("");
      sendEmail();
      console.log("Work");
  
    }
  // Check Email Format 
  //  Work when User not input anything (Error prevent)
  if(!name){
    setErrorName("Name is required.");
  }
  if(!password){
    setErrorPassword("Password is required");
  }
  if(!passwordConfirm){
    setErrorConfirmPassword("Confirm Password is required.");
  }
  if(!email){
    setErrorEmail("Email is required.");
  }
  // Work when found text
  if(name){
    setErrorName("");
  }
  if(password){
    setErrorPassword("");
  }
  if(passwordConfirm){
    setErrorConfirmPassword("");
  
  }
  if(email){
    setErrorEmail("");
  }
  // Work when found spaces
  if(name.includes(" ")){
      setErrorName("Name cannot contain spaces.");
  }
  if(email.includes(" ")){
      setErrorEmail("Email cannot contain spaces.");
  }
  if(password.includes(" ")){
      setErrorPassword("Password cannot contain spaces.");
  }
  if(password != passwordConfirm){
      setErrorPassword("Passwords do not match. Please try again.");
      setErrorConfirmPassword("Passwords do not match. Please try again.");
    }
     if(!passwordCon){
      setErrorPassword("Condition password failed.");
    }
  // Work when not found text
    if(!name || !password || !passwordConfirm || !email){
    
    }
   
    // Work when password and Confirm password not match
    
    // Work when found spaces
    if(name.includes(" ") || password.includes(" ") || email.includes(" ")){
    

    }

   
    // console.log(name);
    // console.log(password);
    // console.log(email);
    // console.log(passwordCon);
    // console.log(!name.includes(" "));
    // console.log(!password.includes(" "));
    // console.log(!email.includes(" "));
    // console.log(password === passwordConfirm);
    

 }
 const generateRandomString = (length: number) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

 const sendEmail = async () => {
    setSeconds(60);
    console.log("WORK");
    setIsActive(true);
    const OTP = generateRandomString(6);
    setOTPstate(OTP);
      const emailHtml = `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
            <p>Hello,</p>
            <p>Your One-Time Password (OTP) is:</p>
            <h1 style="color: #4A90E2; font-size: 32px; letter-spacing: 5px;">${OTP}</h1>
            <p>This code will expire in 2 minutes.</p>
            <p style="font-size: 12px; color: #888;">If you did not request this code, please ignore this email.</p>
            <p>Thank you,<br/>The Support Team</p>
        </div>
    `;
    console.log(OTP);
    const response = await fetch('/api/send-email', {
      method: 'POST',
      body: JSON.stringify({
        subject: "Your OTP Verification Code",
        message: emailHtml,
        sendTo: email
      }),
    });

    const data = await response.json();
    
  };
    return (
    <>
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* UI Pending while create Account */}
      {isUipending&&(
      <PendingCreate ispending={ispending} isOK={isOK} setIsUipending={setIsUipending} returnRegis={returnRegis}/>
      )}
      
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
            {!OTPstate && (
              <>
              <h2 className="text-3xl font-bold text-slate-800 mb-1">Register</h2>
             <p className="text-slate-500 mb-3 text-sm">Enter your username and password</p>
              </>
            )}
            {OTPstate && (
              <>
              <h2 className="text-3xl font-bold text-slate-800 mb-1">OTP</h2>
             <p className="text-slate-500 mb-3 text-sm">We sent a code to {email || 'N/A'}</p>
              </>
            )}
            
          
           
            
           
            <div  className="space-y-7">
              {/* IS OTP */}
              {!OTPstate && (
                <>
               {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 mt-3">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    onChange={(e)=>setName(e.target.value)}
                    value={name}
                    placeholder="example:John"
                    className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 ${errorName? "focus:ring-red-500 border-red-500":" focus:ring-blue-500 border-slate-200"} focus:border-transparent transition-all`}
                  />
                  <p className='absolute text-red-500'>{errorName}</p>
                </div>
              </div>

        {/* Email */}
             
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 mt-3">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    onChange={(e)=>setEmail(e.target.value)}
                    value={email}
                    placeholder="example:name@patient.com"
                    className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 ${errorEmail? "focus:ring-red-500 border-red-500":" focus:ring-blue-500 border-slate-200"} focus:border-transparent transition-all`}
                  />
                   <p className='absolute text-red-500'>{errorEmail}</p>
                </div>
              </div>
           
              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-slate-700">Password</label>
                </div>
                <div className="relative">
                  
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type={`${isShowpassword?"text":"password"}`} 
                    onChange={(e)=>setPassword(e.target.value)}
                    value={password||""}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 ${errorPassword? "focus:ring-red-500 border-red-500":" focus:ring-blue-500 border-slate-200"} focus:border-transparent transition-all`}
                  />
                   <p className='absolute text-red-500'>{errorPassword}</p>
                  {isShowpassword?(<Eye onClick={()=>setIsShowpassword(!isShowpassword)} className='absolute right-5 cursor-pointer top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400'/>):(<EyeOff onClick={()=>setIsShowpassword(!isShowpassword)} className='absolute cursor-pointer right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400'/>)}
                  
                </div>
                <div className='mt-8'>
                <Checkpassword condition = {password} setPasswordCons={setPasswordCons}/>
                </div>
                
              </div>

      {/* Confirm Password */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-slate-700">Confirm Password</label>
                </div>
                <div className="relative">
                  
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type={`${isShowConfirm?"text":"password"}`} 
                    onChange={(e)=>setPasswordConfirm(e.target.value)}
                    value={passwordConfirm||""}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 ${errorConfirmPassword? "focus:ring-red-500 border-red-500":" focus:ring-blue-500 border-slate-200"} focus:border-transparent transition-all`}
                  />
                  {isShowConfirm?(<Eye onClick={()=>setIsShowConfirm(!isShowConfirm)} className='absolute right-5 cursor-pointer top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400'/>):(<EyeOff onClick={()=>setIsShowConfirm(!isShowConfirm)} className='absolute cursor-pointer right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400'/>)}
                   <p className='absolute text-red-500'>{errorConfirmPassword}</p>
                </div>
              </div>

             

              {/* Register -> Button */}
              <button 
                type="button" 
                onClick={()=>handleSubmit()}
                className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
              >
                Register
                <ArrowRight className="w-5 h-5" />
                
              </button>
                  <h1 className='text-center '>You already have an account? <button className='underline text-blue-500 cursor-pointer' onClick={()=>router.push('/auth/login')}>Login</button></h1>

              </>
              )}

              {/* OTP PAGE */}
              {OTPstate && (
                // OTP Input
                <>
                <div>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  
                  <input 
                    type="text" 
                    onChange={(e)=>setOTPConfirm(e.target.value)}
                    value={OTPConfirm}
                    placeholder="Enter 6-digit code"
                    className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 ${!isOTPmatch? "focus:ring-red-500 border-red-500":" focus:ring-blue-500 border-slate-200"} focus:border-transparent transition-all`}
                  />
                  <p className='absolute text-red-500'>{errorOTP}</p>
                </div>
              </div>
              {/* Check OTP Button */}
              <button 
                type="button" 
                onClick={()=>handleCeckOTP()}
                className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
              >
                CONFIRM
                <ArrowRight className="w-5 h-5" />
              </button>

              {/* Resend OTP */}
              <div className='flex justify-center'>
              <button 
                type="button" 
                onClick={()=>sendEmail()}
                disabled={isActive}
                className={`cursor-pointer text-[14px] text-center hover:underline ${isActive?"text-slate-500":"text-blue-500"} font-bold rounded-lg flex items-center justify-center gap-2 transition-all transform`}
              >
                resend OTP {isActive?`(${seconds})`:""} 
               
              </button>
            </div>

              </>
              )}
             
             
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