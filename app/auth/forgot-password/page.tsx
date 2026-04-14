'use client';
import React, { useState, useEffect } from 'react';
import { Shield, Lock, Mail, KeyRound, ArrowRight, Eye, EyeOff, Headset, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        <div className="md:w-5/12 bg-blue-600 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
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

            <h1 className="text-4xl font-bold mb-6 leading-tight">Life Markers <br /></h1>
            <p className="text-blue-100 text-lg leading-relaxed">
              Reset your password securely. We'll send a verification code to your email.
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

        <div className="md:w-7/12 p-8 md:p-16 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            <h2 className="text-3xl font-bold text-slate-800 mb-1">
              {step === 'email' ? 'Forgot Password' : 'Reset Password'}
            </h2>
            <p className="text-slate-500 mb-3 text-sm">
              {step === 'email'
                ? 'Enter your email to receive a reset code.'
                : `Enter the 6-digit code sent to ${email} and your new password.`}
            </p>

            {info && step === 'reset' && (
              <p className="text-sm text-green-700 p-2 bg-green-50 rounded mb-2">{info}</p>
            )}

            <div className="space-y-6">
              {step === 'email' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 mt-3">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        placeholder="example:name@hospital.com"
                        className={`w-full pl-10 pr-4 py-3 bg-slate-50 text-slate-900 border rounded-lg focus:outline-none focus:ring-2 ${errorEmail ? 'focus:ring-red-500 border-red-500' : ' focus:ring-blue-500 border-slate-200'} focus:border-transparent transition-all`}
                      />
                    </div>
                    {errorEmail && <p className="text-sm text-red-600 mt-1">{errorEmail}</p>}
                  </div>

                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={isPending}
                    className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-4 rounded-lg shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
                  >
                    {isPending ? 'Sending...' : 'Send Reset Code'}
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  <h1 className="text-center">
                    Remembered your password?{' '}
                    <button className="underline text-blue-500 cursor-pointer" onClick={() => router.push('/auth/login')}>
                      Login
                    </button>
                  </h1>
                </>
              )}

              {step === 'reset' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Reset Code</label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        onChange={(e) => setCode(e.target.value)}
                        value={code}
                        placeholder="Enter 6-digit code"
                        className={`w-full pl-10 pr-4 py-3 bg-slate-50 text-slate-900 border rounded-lg focus:outline-none focus:ring-2 ${errorCode ? 'focus:ring-red-500 border-red-500' : ' focus:ring-blue-500 border-slate-200'} focus:border-transparent transition-all`}
                      />
                    </div>
                    {errorCode && <p className="text-sm text-red-600 mt-1">{errorCode}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type={isShowPassword ? 'text' : 'password'}
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        placeholder="••••••••"
                        className={`w-full pl-10 pr-4 py-3 bg-slate-50 text-slate-900 border rounded-lg focus:outline-none focus:ring-2 ${errorPassword ? 'focus:ring-red-500 border-red-500' : ' focus:ring-blue-500 border-slate-200'} focus:border-transparent transition-all`}
                      />
                      {isShowPassword ? (
                        <Eye onClick={() => setIsShowPassword(!isShowPassword)} className="absolute right-5 cursor-pointer top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      ) : (
                        <EyeOff onClick={() => setIsShowPassword(!isShowPassword)} className="absolute cursor-pointer right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    {errorPassword && <p className="text-sm text-red-600 mt-1">{errorPassword}</p>}
                    <div className="mt-4">
                      <Checkpassword condition={password} setPasswordCons={setPasswordCons} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type={isShowConfirm ? 'text' : 'password'}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        value={passwordConfirm}
                        placeholder="••••••••"
                        className={`w-full pl-10 pr-4 py-3 bg-slate-50 text-slate-900 border rounded-lg focus:outline-none focus:ring-2 ${errorConfirm ? 'focus:ring-red-500 border-red-500' : ' focus:ring-blue-500 border-slate-200'} focus:border-transparent transition-all`}
                      />
                      {isShowConfirm ? (
                        <Eye onClick={() => setIsShowConfirm(!isShowConfirm)} className="absolute right-5 cursor-pointer top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      ) : (
                        <EyeOff onClick={() => setIsShowConfirm(!isShowConfirm)} className="absolute cursor-pointer right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    {errorConfirm && <p className="text-sm text-red-600 mt-1">{errorConfirm}</p>}
                  </div>

                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={isPending}
                    className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-4 rounded-lg shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
                  >
                    {isPending ? 'Resetting...' : 'Reset Password'}
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={isActive}
                      className={`cursor-pointer text-[14px] text-center hover:underline ${isActive ? 'text-slate-500' : 'text-blue-500'} font-bold rounded-lg flex items-center justify-center gap-2 transition-all transform`}
                    >
                      resend code {isActive ? `(${seconds})` : ''}
                    </button>
                  </div>
                </>
              )}
            </div>

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
  );
}
