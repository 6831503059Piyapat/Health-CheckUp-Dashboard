'use client'
import { FileText } from "lucide-react";
import InputField from "./InputField";
import { useForm } from "react-hook-form";
import FormSection from "./FormSection";
import VitalSigns from "./VitalSign";
import RowInput from "./RowInput";
import Dragdrop from "./Dragdrop";
import { useState,useEffect,Dispatch,SetStateAction,useRef } from "react"
import ConfirmSubmit from "./ConfirmSubmit";
import React from "react";
import Pendingsubmit from "./Pendingsubmit";
import { useRouter } from "next/navigation";
interface FileProps {
  fullName: String;
  provide:String;
  dateUpload:string;
  dateFile:string;
  gender:String;
  age: Number;
  historical: String;
  height: Number;
  weight: Number;
  bmi: Number;
  vital_signs: {
    temperature: Number;
    heart_rate: Number;
    blood_pressure:String;
    respiratory_rate: Number;
    oxygen_saturation: Number;
    pulse:Number;
  };
  blood_test: {
    cbc: {
      wbc: Number;
      rbc: Number;
      hemoglobin: Number;
      hematocrit: Number;
      platelets: Number;
      mcv: Number;
    };
    fasting_blood_sugar: Number;
    hba1c:Number;
    lipid_profile: {
      total_cholesterol: Number;
      hdl: Number;
      ldl: Number;
      triglycerides: Number;
    };
    liver_function_test: {
      ast: Number;
      alt: Number;
      alp: Number;
      total_bilirubin: Number;
      albumin: Number;
      ggt: Number;
      direct_bilirubin: Number;
    };
    kidney_function_tes: {
      bun: Number;
      creatinine: Number;
      egfr: Number;
    };
    uric_acid: Number;
  };
  urinalysis: {
    color: String;
    clarity: String;
    specific_gravity: Number;
    ph: Number;
    protein: String;
    glucose: String;
    ketones: String;
    wbc: Number;
    rbc: Number;
  };
  stool_examination: {
    macroscopic:String;
    occult_blood: String;
  };
  chest_xray: {
    lung_opacity: String;
    heart: {
      ctr: String;
      cardiomegaly: String;
    }
  };
  electrocardiogram: {
    rhythm: String;
    heart_rate: Number;
    st_segment: String;
    t_wave:String;
  };
  ultrasound: {
    upper_abdomen: String;
    lower_abdomen: String;
  }
}
export default function FormInput(){
  const prompt = `Role: You are a professional Health Data Analyst.

Task: Analyze the provided JSON health data .

Rules:

Preserve Structure: You must return the exact same JSON object received from the user. Do not remove or rename any existing fields.

Append Data: Add exactly one new field named "suggest".

Content: Inside the "suggest" field, provide a concise health analysis and actionable advice in Thai.

Format: Output only valid JSON. Do not include markdown formatting like json unless requested.`;
    const router = useRouter();

    const [height, setHeight] = useState(0);
    const [weight, setWeight] = useState(0);
    const [bmi, setBmi] = useState(0);
    const [fileUpload,setFileUpload] = useState<FileProps>();
    const [onConfirm,setOnConfirm] = useState(false);

    const [ispending,setIspending] = useState<boolean>(false);
    const [isOK,setIsOK] = useState<boolean>(false);
    const [isUiShow,setIsUiShow] = useState<boolean>(false);

    const [resData,setResData] = useState<any>();
    const { register, handleSubmit,reset,formState:{isSubmitting} } = useForm();
    
    const calculateBMI = () => {
        if (height > 0 && weight > 0) {
            const heightInMeters = height / 100;
            const bmiValue = weight / (heightInMeters * heightInMeters);
            setBmi(bmiValue);
        }
    };
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const formRef = useRef<HTMLFormElement>(null);

  const onSubmit =async (data:any)=>{
  setIsUiShow(true);
  setIspending(true);
  
  const responseAi = await fetch(`${process.env.NEXT_PUBLIC_PORT}/ai/suggest`,{
    method:"POST",
    headers:{
      'Content-Type':'application/json',
      'Authorization':`Bearer ${token}`
    },
    body :JSON.stringify({
      promptData:prompt,
      ObjData:data
    })
  });
  const dataResAi = await responseAi.json();
  if (responseAi.status === 401) {
     localStorage.removeItem('token');
      router.push('/auth/login');
     return;
  }
  if(responseAi.ok){
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_PORT}/users/create-post`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify({
      Data:dataResAi,
    })
  });
  if (response.status === 401) {
     localStorage.removeItem('token');
      router.push('/auth/login');
     return;
  }
  if (response.ok) {
    setIsOK(true);
    setIspending(false);
    // Response From ai
    
    
      }
  else{
    setIsOK(false);
    setIspending(false);
  }
  }
  // 
  
    }
    const triggerSubmit=()=>{
      if(formRef.current){
        formRef.current.requestSubmit();
      }
      setOnConfirm(false);
    }
 
    function onCancelSubmit(){
      setOnConfirm(false)
    }
    
//  Use for update BMI
useEffect(() => {
  calculateBMI();
}, [height, weight]);
const getCustomDate = () => {
  const date = new Date();
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', // 'Nov'
    day: '2-digit', // '20'
    year: 'numeric' // '2020'
  }).format(date);
};

useEffect(() => {
    if (fileUpload) {
      
      // Use reset for Update field
           reset({
        
        fullName: fileUpload.fullName,
        age:fileUpload.age,
        provide:fileUpload.provide,
        dateFile:fileUpload.dateFile,
        dateUpload:fileUpload.dateUpload,
        height:fileUpload.height,
        gender:fileUpload.gender,
        weight:fileUpload.weight,
        bmi:fileUpload.bmi,
        history:fileUpload.historical,
//     cbc
       hemoglobin:fileUpload.blood_test.cbc.hemoglobin,
       wbc:fileUpload.blood_test.cbc.wbc,
       rbc:fileUpload.blood_test.cbc.rbc,
       hematocrit:fileUpload.blood_test.cbc.hematocrit,
       mcv:fileUpload.blood_test.cbc.mcv,
       platelets:fileUpload.blood_test.cbc.platelets,

       hba1c:fileUpload.blood_test.hba1c,
       fbs:fileUpload.blood_test.fasting_blood_sugar,
      //  Lipid Profile
       cholesterol:fileUpload.blood_test.lipid_profile.total_cholesterol,
       hdl:fileUpload.blood_test.lipid_profile.hdl,
       ldl:fileUpload.blood_test.lipid_profile.ldl,
       triglycerides:fileUpload.blood_test.lipid_profile.triglycerides,
      // Liver function
       sgot:fileUpload.blood_test.liver_function_test.ast,
       sgpt:fileUpload.blood_test.liver_function_test.alt,
       alp:fileUpload.blood_test.liver_function_test.alp,
       total_bilirubin:fileUpload.blood_test.liver_function_test.total_bilirubin,
       albumin:fileUpload.blood_test.liver_function_test.albumin,
       ggt:fileUpload.blood_test.liver_function_test.ggt,
       direct_bilirubin:fileUpload.blood_test.liver_function_test.direct_bilirubin,
            // Vital Signs
       temperature:fileUpload.vital_signs.temperature,
       heartRate:fileUpload.vital_signs.heart_rate,
       respiratoryRate:fileUpload.vital_signs.respiratory_rate,
       bloodPressure:fileUpload.vital_signs.blood_pressure,
       spo2:fileUpload.vital_signs.oxygen_saturation,
       pulse:fileUpload.vital_signs.pulse,
      });
    }
  }, [fileUpload, reset]);
 
    return(
      <main className="max-w-5xl mx-auto my-8 bg-white overflow-hidden font-sans">
{isUiShow &&(
  <Pendingsubmit ispending={ispending} isOK={isOK} setIsUiShow={setIsUiShow} />
)}
      <ConfirmSubmit formId="ConfirmSubm  it_FormInput" isSubmitting={isSubmitting} onConfirm={triggerSubmit} onClose={onCancelSubmit} isOpen={onConfirm} title="Are you sure?" message="Please make sure that all information is match with file or paper"/>
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)}  className="p-6 md:p-8 space-y-10">
     {/* Upload date day that upload data */}
        <h1 className="text-lg font-bold text-slate-700 mb-6 uppercase tracking-tight  pl-3" {...register("dateupload",{value:getCustomDate()})}>{getCustomDate()}</h1>
        <h1 {...register("ai_suggest")}></h1>
        {/* 1. Patient Information */}
        <FormSection title={`1. Patient Information`} >
         <div>
            <Dragdrop setFileUpload={setFileUpload} fileUpload={fileUpload}/>
        </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
            <div className="md:col-span-2">
              <InputField label="Full Name" registration={register("fullName",{value:fileUpload?.fullName})} placeholder="example:John Doe"  />
            </div>
            <InputField label="Age" type="number" registration={register("age",{value:fileUpload?.age})} placeholder="Years" />
            <InputField label="Height (cm)" type="number" registration={register("height",{onChange:(e) => setHeight(parseFloat(e.target.value)),value:fileUpload?.height})} />
            <InputField label="Weight (kg)" type="number" registration={register("weight",{onChange:(e) => setWeight(parseFloat(e.target.value)),value:fileUpload?.weight})} />
            <InputField label="Gender" type="text" registration={register("gender",{value:fileUpload?.gender})} placeholder="example:Female" />

            <div className="space-y-1">
              <label className="block text-sm font-semibold">BMI</label>
              <input className="w-full p-2 rounded-md border border-slate-200 bg-slate-50" {...register("bmi",{value:bmi.toFixed(2)})} disabled value={bmi.toFixed(2)} />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-semibold mb-1">Medical History</label>
              <textarea 
                {...register("history",{value:fileUpload?.historical})}
                className="w-full p-2 rounded-md border border-slate-200 focus:ring-2 focus:ring-[#137fec] outline-none" 
                rows={3} 
              />
            </div>
          </div>
        </FormSection>

        {/* 2. Vital Signs */}
        <VitalSigns register={register} fileUpload={fileUpload} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* 3. CBC & 4. Blood Sugar */}
          <div className="space-y-10">
            <FormSection title="3. Blood Test - CBC">
              <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
                <RowInput label="Hemoglobin (g/dL)" registration={register("hemoglobin",{value:fileUpload?.blood_test.cbc.hemoglobin})} />
                <RowInput label="WBC Count (cells/µL)" registration={register("wbc",{value:fileUpload?.blood_test.cbc.wbc})} />
                <RowInput label="RBC Count (cells/µL)" registration={register("rbc",{value:fileUpload?.blood_test.cbc.rbc})} />
                <RowInput label="Platelet Count" registration={register("platelets",{value:fileUpload?.blood_test.cbc.platelets})} />
                <RowInput label="hematocrit (cells/µL)" registration={register("hematocrit",{value:fileUpload?.blood_test.cbc.hematocrit})} />
                <RowInput label="mcv (cells/µL)" registration={register("mcv",{value:fileUpload?.blood_test.cbc.mcv})} />

              </div>
            </FormSection>
            
            <FormSection title="4. Fasting Blood Sugar">
              <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
                <RowInput label="HbA1c (%)" registration={register("hba1c",{value:fileUpload?.blood_test.hba1c})} />
                <RowInput label="FBS (mg/dL)" registration={register("fbs",{value:fileUpload?.blood_test.fasting_blood_sugar})} />
              </div>
            </FormSection>

            <FormSection title="7.Doctor">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-lg">
                <InputField label="Doctor name" registration={register("provide",{value:fileUpload?.provide})} size="sm" />
                <InputField label="Date in paper" placeholder="ex : Mar 22 2026" registration={register("dateFile",{value:fileUpload?.dateFile})} size="sm" />
              </div>
            </FormSection>
          </div>

          {/* 5. Lipid Profile & 6. Liver Function */}
          <div className="space-y-10">
            <FormSection title="5. Lipid Profile">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
                <InputField label="Cholesterol" registration={register("cholesterol",{value:fileUpload?.blood_test.lipid_profile.total_cholesterol})} size="sm" />
                <InputField label="HDL" registration={register("hdl",{value:fileUpload?.blood_test.lipid_profile.hdl})} size="sm" />
                <InputField label="LDL" registration={register("ldl",{value:fileUpload?.blood_test.lipid_profile.ldl})} size="sm" />
                <InputField label="Triglycerides" registration={register("triglycerides",{value:fileUpload?.blood_test.lipid_profile.triglycerides})} size="sm" />

              </div>
            </FormSection>

            <FormSection title="6. Liver Function">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-lg">
                <InputField label="SGOT" registration={register("sgot",{value:fileUpload?.blood_test.liver_function_test.ast})} size="sm" />
                <InputField label="SGPT" registration={register("sgpt",{value:fileUpload?.blood_test.liver_function_test.alt})} size="sm" />
                <InputField label="ALP" registration={register("alp",{value:fileUpload?.blood_test.liver_function_test.alp})} size="sm" />
                <InputField label="Total bilirubin" registration={register("total_bilirubin",{value:fileUpload?.blood_test.liver_function_test.total_bilirubin})} size="sm" />
                <InputField label="Albumin" registration={register("albumin",{value:fileUpload?.blood_test.liver_function_test.albumin})} size="sm" />
                <InputField label="GGT" registration={register("ggt",{value:fileUpload?.blood_test.liver_function_test.ggt})} size="sm" />
                <InputField label="Direct Bilirubin" registration={register("direct_bilirubin",{value:fileUpload?.blood_test.liver_function_test.direct_bilirubin})} size="sm" />

              </div>
            </FormSection>
            
          </div>
        </div>

        {/* Footer Actions */}
        <footer className="pt-8 border-t border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
          <p className="text-xs text-slate-500 italic">Ensure data matches laboratory reports.</p>
          <div className="flex gap-4">
            <button type="reset" className="px-6 py-2 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors font-semibold">Clear</button>
            <button type="button" onClick={()=>setOnConfirm(true)} className="px-8 py-2 bg-[#137fec] text-white rounded-md hover:bg-blue-600 transition-colors font-bold shadow-lg shadow-blue-200">Submit Record</button>
          </div>
        </footer>
      </form>
    </main>
    )
}