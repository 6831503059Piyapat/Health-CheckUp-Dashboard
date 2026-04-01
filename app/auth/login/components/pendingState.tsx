'use client';
import React from 'react';
import { CircleCheckBig,X } from 'lucide-react';
import { Spinner,Button } from '@heroui/react';
import { useState } from 'react';

interface PendingProps{
    ispending:boolean,
    isOK:boolean,
    setIsUiShow:(value:boolean)=>void,
    isUiShow:boolean,
}
export default function PendingState({ispending,isOK,setIsUiShow,isUiShow}:PendingProps) {
    
    if(isUiShow){
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg space-y-6 bg-white p-6 shadow-xl dark:bg-gray-800 justify-center text-center text-[20px] font-bold">
        <p>Logging in...</p>
        
        <div className="flex justify-center">
            {ispending && (
        <Spinner className="animate-spin " size="xl"/>
            )}
            {!ispending && isOK &&(
        <CircleCheckBig className="text-green-500" size={50}/>
            )}
            {!ispending && !isOK &&(
        <X className="text-red-500" size={50}/>
            )}
        </div>
       {ispending&&(
        <p className="text-[14px]">Please wait . . .</p>
       )}
       {isOK&& !ispending &&(
        <p className="text-[14px]">Successful Login</p>
       )}
       {!isOK && !ispending&&(
        <p className="text-[14px]">Failed to Login in. Try again later.</p>
       )}

       {!ispending && isOK &&(
        <Button onClick={()=>setIsUiShow(false)} className="rounded-sm bg-white border border-2 border-green-500 text-green-500 ">Done</Button>
       )}

       {!ispending && !isOK &&(
        <Button onClick={()=>setIsUiShow(false)} className="rounded-sm bg-white border border-2 border-red-500 text-red-500 ">Done</Button>
       )}
      </div>
    </div>
        )}
    return (
    <></>
    );
}