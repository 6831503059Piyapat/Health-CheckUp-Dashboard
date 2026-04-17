'use client';
import Navbar from '@/app/components/Navbar';
import { useState,useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Skeleton } from '@heroui/react';
import {jwtDecode,JwtPayload} from "jwt-decode";
import AuthNavbar from '../auth/components/AuthNavbar';
export default function Profile() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [dataFetch,setDataFetch] = useState<any>();
  const router = useRouter();
 useEffect(()=>{
  const token = localStorage.getItem("token");
  if (token) {
            try {
              const decoded = jwtDecode<JwtPayload>(token);
              const currentTime = Date.now() / 1000; 
        
              if (decoded.exp! < currentTime) {
                localStorage.removeItem("token");
                router.push('/auth/login');
              }
            } catch (error) {
              localStorage.removeItem("token");
              router.push('/auth/login');
            }
          }else{
        router.push('/auth/login');
      }
     async function fetchData(){
    
      try{
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_PORT}/users/me`,{
          method:'GET',
          headers:{
            'Authorization':`Bearer ${token}`,
            'Content-Type':'application/json'
          }
        });
        if(res.status === 401){ localStorage.removeItem('token'); router.push('/auth/login'); return; }
        const data = await res.json();
        if(res.ok){
          setDataFetch(data);
        }
      }finally{
       
      }
    };
    fetchData();
 },[]);
  const [password, setPassword] = useState('');
  const [enable2FA, setEnable2FA] = useState(false);

  const [avatar, setAvatar] = useState<string | null>(null);

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
        // This only create a temp URL, need to change it if you want to upload to server
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
    }
  }
  

  function handleSave() {
    console.log({
      firstName,
      lastName,
      address,
      contact,
      password,
      enable2FA,
      avatar
    });
    alert("Settings saved successfully!");
  }

  return (
    <>
      <div className="sticky top-0 z-50">
        <AuthNavbar />
      </div>
      <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
        <Navbar />
        <main className="flex-1 md:ml-64 px-4 sm:px-6 pt-16 sm:pt-8 pb-6 sm:py-8 overflow-y-auto [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:display-none">
          <div className="max-w-5xl mx-auto space-y-6">
    
        {/* header */}
        <div>
          <h1 className="text-2xl sm:text-3xl ml-5 font-bold text-slate-900">Profile</h1>
          <p className="text-sm text-slate-500">Manage your profile and security preferences</p>
        </div>

        {/* profile */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
          <div className="relative flex-shrink-0">
            <Skeleton className="w-28 h-28 sm:w-40 sm:h-40 rounded-full object-cover border" />
            <label className="absolute bottom-1 right-1 bg-blue-600 text-white text-xs px-2 py-1 rounded-full cursor-pointer shadow-sm">
              Edit
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          <div className="text-center sm:text-left min-w-0">
            <h2 className="text-lg font-semibold text-slate-900 truncate">
              {dataFetch?.name}
            </h2>
            <p className="text-sm text-slate-500 truncate">{dataFetch?.email}</p>
          </div>
        </div>

        {/* user info */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">User Info</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-600">First Name</label>
              <input
                className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={firstName || "-"}
              disabled
              />
            </div>

            <div>
              <label className="text-sm text-slate-600">Last Name</label>
              <input
                className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={lastName || "-"}
                disabled
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm text-slate-600">Address</label>
              <input
                className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={address || "-"}
                disabled
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm text-slate-600">Contact Info</label>
              <input
                className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={contact || "-"}
                disabled
/>
            </div>
          </div>
        </div>
          </div>
        </main>
      </div>
    </>
  );
}