'use client';
import React from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Menu, X } from 'lucide-react';
import { Skeleton } from '@heroui/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useRef } from 'react';
interface Props {
  isLoading?: boolean;
  userData?: any;
}
export default function AuthNavbar({ isLoading, userData }: Props) {
  const router = useRouter();
  const pathname = usePathname();
 const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [showLogoutCard, setShowLogoutCard] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(()=>{
        const token = localStorage.getItem('token');
      
      const fetcProfile = async ()=>{
        try{
          setIsLoadingProfile(true);
          const res = await fetch(`${process.env.NEXT_PUBLIC_PORT}/users/me`,{
            method:'GET',
            headers:{
              'Authorization':`Bearer ${token}`,
              'Content-Type':'application/json'
            }
          });
          if(res.status === 401){ localStorage.removeItem('token'); return; }
          const data = await res.json();
          if(res.ok){
            setProfileData(data);
          }
        }finally{
          setIsLoadingProfile(false);
        }
      };
      fetcProfile();
      },[pathname])
  return (
    <div className="w-full bg-white border-b border-slate-100  font-sans">
      <div className="w-full px-4 sm:px-5 mx-auto py-2 sm:py-3 flex items-center justify-between gap-3">
        <Link href="/dashboard" className="flex items-center min-w-0">
          
            <Image src="/LifeMarkerLogo.png" alt="LifeMarkers Logo" className='w-full' width={100} height={30} />
          
        </Link>
        <button
          type="button"
          className="sm:hidden inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-slate-100"
          aria-label="Open menu"
          onClick={() => setShowMobileMenu(true)}
        >
          <Menu size={20} />
        </button>
      { pathname !== '/auth/login' && pathname !== '/auth/register' && pathname !== '/' && pathname != '/auth/forgot-password' ? (
        <div className="hidden sm:flex px-4 cursor-default relative" ref={profileRef}>
          <div
            role="button"
            tabIndex={0}
            onClick={() => setShowLogoutCard((s) => !s)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowLogoutCard((s) => !s); }}
            className="flex items-center gap-3 rounded-xl"
          >
            <Skeleton className="w-10 h-10 rounded-full border border-white" />
            
            <div>
              <p className="text-sm font-bold text-black">{isLoadingProfile ? 'Loading…' : profileData?.name || ''}</p>
              <p className="text-[8px] text-slate-500 uppercase tracking-wider">{isLoadingProfile ? 'Loading…' : profileData?.email}</p>
            </div>
            
            {
              
              showLogoutCard ? <ChevronUp className='text-black' size={15}/> : <ChevronDown className='text-black' size={15}/> }
          
          </div>

          {/* Logout card shown on click — kept mounted for smooth transitions */}
          <div
            className={`absolute right-0 mt-5 w-50 bg-white border rounded-md shadow-lg z-50 transform transition-all duration-150 ease-in-out origin-top-right
              ${showLogoutCard ? 'opacity-100 translate-y-1 scale-100 pointer-events-auto' : 'opacity-0 translate-y-0 scale-100 pointer-events-none'}`}
            aria-hidden={!showLogoutCard}
          >
            <div className="p-3">
              <button
                onClick={() => { localStorage.removeItem('token'); router.push('/auth/login'); }}
                className="w-full text-left text-sm text-red-600 hover:bg-red-50 px-2 py-2 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      ):(
        <>
          <div className="hidden sm:flex items-center gap-4">
            <div className="gap-4 flex">
              <Link href="/auth/login" className="text-sm text-slate-600 hover:text-slate-800 inline-flex items-center gap-2">Login</Link>
              <Link href="/auth/register" className="bg-blue-700 p-2 rounded-md text-sm text-slate-100 hover:bg-blue-800 inline-flex items-center gap-2">Get Started</Link>
            </div>
          </div>
          </>
       )}

      {showMobileMenu && (
        <div className="fixed inset-0 z-50 bg-black/40 sm:hidden z-52">
          <div className="absolute right-0 top-0 h-full w-72 max-w-[85vw] bg-white p-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Menu</p>
                <h3 className="text-base font-bold text-slate-900">LifeMarkers</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMobileMenu(false)}
                className="rounded-md p-2 hover:bg-slate-100 text-slate-700"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {pathname !== '/auth/login' && pathname !== '/auth/register' && pathname !== '/' && pathname !== '/auth/forgot-password' ? (
              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400 mb-2">Account</p>
                  <p className="font-semibold text-slate-900 truncate">{isLoadingProfile ? 'Loading…' : profileData?.name || 'User'}</p>
                  <p className="text-sm text-slate-500 truncate">{isLoadingProfile ? 'Loading…' : profileData?.email || ''}</p>
                </div>
                <button
                  type="button"
                  onClick={() => { localStorage.removeItem('token'); router.push('/auth/login'); setShowMobileMenu(false); }}
                  className="w-full rounded-xl bg-red-50 px-4 py-3 text-left text-sm font-semibold text-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link href="/auth/login" onClick={() => setShowMobileMenu(false)} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">Login</Link>
                <Link href="/auth/register" onClick={() => setShowMobileMenu(false)} className="rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      )}

      

    

      
        
      </div>
    </div>
  );
}
