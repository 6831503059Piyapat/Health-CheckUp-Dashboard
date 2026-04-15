'use client';
import Navbar from '@/app/components/Navbar';
import { useState,useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Skeleton } from '@heroui/react';
import {jwtDecode,JwtPayload} from "jwt-decode";
import AuthNavbar from '../auth/components/AuthNavbar';
export default function SettingsPage() {
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
    <div className="sticky top-0">
        <AuthNavbar/>
      </div>
    
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
<Navbar/>
      <div className="max-w-5xl mx-auto space-y-6 mb-6 mt-6">
    
        {/* header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-sm text-slate-500">Manage your profile and security preferences</p>
        </div>

        {/* profile */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex items-center gap-6">
          <div className="relative">
           
            <Skeleton className='w-20 h-20 rounded-full object-cover border'/>
            <label className="absolute bottom-0 right-0 bg-blue-600 text-white text-xs px-2 py-1 rounded-full cursor-pointer">
              Edit
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {dataFetch?.name}
            </h2>
            <p className="text-sm text-slate-500">{dataFetch?.email}</p>
            <p className="text-sm  text-green-500">online</p>
          </div>
        </div>

        {/* user info */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">User Info</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-600">First Name</label>
              <input
                className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-slate-600">Last Name</label>
              <input
                className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div className="col-span-2">
              <label className="text-sm text-slate-600">Address</label>
              <input
                className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="col-span-2">
              <label className="text-sm text-slate-600">Contact Info</label>
              <input
                className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* pass */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Security</h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-600">Change Password</label>
              <input
                type="password"
                className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={enable2FA}
                onChange={(e) => setEnable2FA(e.target.checked)}
              />
              <label className="text-sm text-slate-600">
                Enable Two-Factor Authentication (2FA)
              </label>
            </div>
          </div>
        </div>

        {/* save botton not working */}
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition"
        >
          Save Settings
        </button>

      </div>
    </div>
    </>
  );
}