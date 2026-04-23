'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft,ChevronDown,ChevronUp } from 'lucide-react';
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
      <div className="w-full px-5 mx-auto py-3 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center p-2" aria-label="LifeMarkers home">
          <Image
            src="/LifeMaker.png"
            alt="LifeMarkers"
            width={160}
            height={40}
            priority
            sizes="160px"
            className="h-10 w-auto object-contain"
          />
        </Link>
      { pathname !== '/auth/login' && pathname !== '/auth/register' && pathname !== '/' && pathname != '/auth/forgot-password' ? (
        <div className="px-4 cursor-default relative" ref={profileRef}>
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
          <div className="flex items-center gap-4">
          <div className="gap-4 flex">
            <Link href="/auth/login" className="text-sm text-slate-600 hover:text-slate-800 inline-flex items-center gap-2">Login</Link>
            <Link href="/auth/register" className="bg-blue-700 p-2 rounded-md text-sm text-slate-100 hover:bg-blue-800 inline-flex items-center gap-2">Get Started</Link>
          </div>
         
        </div>
          {/* Logout card shown on click — kept mounted for smooth transitions */}
          <div
            className={`absolute right-0 mt-5 w-50 bg-white border rounded-md shadow-lg z-50 transform transition-all duration-150 ease-in-out origin-top-right
              ${showLogoutCard ? 'opacity-100 translate-y-1 scale-100 pointer-events-auto' : 'opacity-0 translate-y-0 scale-100 pointer-events-none'}`}
            aria-hidden={!showLogoutCard}
          >
           
          </div>
          </>
       )}

      

    

      
        
      </div>
    </div>
  );
}
