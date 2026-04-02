'use client'
import { useEffect,useState } from "react";
import { CircleCheck,CircleX } from "lucide-react"
interface Props{
    condition:string;
    setPasswordCons:(value:boolean)=>void,
}
export default function Checkpassword({condition,setPasswordCons}:Props){
    const [isUpper,setIsUpper] = useState<boolean>();
    const [isLower,setIsLower] = useState<boolean>();
    const [isNumber,setIsNumber] = useState<boolean>();
    const [isSpecialChars,setIsSpecailChars]=useState<boolean>();
    const [isAtleast,setIsAtleast] = useState<boolean>();
// Check Upper Letter
    const findFirstUpper = (text:any) => {
  const match = text.match(/[A-Z]/);
  return match ? match[0] : false; 
};
// Check Lower Letter
const findFirstLower = (text:any) => {
  const match = text.match(/[a-z]/);
  return match ? match[0] : false; 
};
// Check number 
const findFirstNumber = (text:any) => {
  const match = text.match(/[0-9]/);
  return match ? match[0] : false; 
};
//Ceck special character
const findFirstSpecial = (text:any) => {
  const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  return specialChars.test(text);
};
const atleast =(text:any) =>{
  return text.length >=6;
}
useEffect(()=>{
 const upper = findFirstUpper(condition);
 const lower = findFirstLower(condition);
 const number = findFirstNumber(condition);
 const special = findFirstSpecial(condition);
 const enough = atleast(condition);
 setIsUpper(upper);
 setIsLower(lower);
 setIsNumber(number);
 setIsSpecailChars(special);
 setIsAtleast(enough);
 if(upper && lower && number && special && enough) {
    setPasswordCons(true);
 }
 else{
    setPasswordCons(false);
 }
},[condition])
    return(
        <>
        <div className="text-[14px]">
         <p className={`flex gap-2 ${isAtleast?"text-green-500":"text-slate-500"}`}>
            {isAtleast?(<CircleCheck size={20}/>):(<CircleX size={20}/>)} 
            At least 6 characters
         </p>
         <p className={`flex gap-2 ${isLower?"text-green-500":"text-slate-500"}`}>
             {isLower?(<CircleCheck size={20}/>):(<CircleX size={20}/>)}
        
            1 lowercase letter
         </p>
         <p className={`flex gap-2 ${isUpper?"text-green-500":"text-slate-500"}`}>
            {isUpper?(<CircleCheck size={20}/>):(<CircleX size={20}/>)}
            1 uppercase letter
         </p>
         <p className={`flex gap-2 ${isNumber?"text-green-500":"text-slate-500"}`}>
            {isNumber?(<CircleCheck size={20}/>):(<CircleX size={20}/>)}
            1 number
         </p>
         <p className={`flex gap-2 ${isSpecialChars?"text-green-500":"text-slate-500"}`}>
           {isSpecialChars?(<CircleCheck size={20}/>):(<CircleX size={20}/>)}
            1 special character
         </p>
         </div>
        </>
    )
}