"use client";

import React, { useState, useRef,Dispatch,SetStateAction } from "react";
interface FileProps {
  fullName: String;
  provide:String;
  dateFile:string;
  dateUpload:string;
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

interface DragdropProps {
  onFileSelect?: (files: FileList) => void;
  multiple?: boolean;
  accept?: string;
  className?: string;
  pending?: boolean;
  pendingText?: string;
  setFileUpload:(value:FileProps)=>void;
  fileUpload:any;
}
// File Size format
const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// File Icon Type

const getFileIcon = (type: string) => {
  if (type.startsWith("image/")) return "🖼️";
  if (type.startsWith("video/")) return "🎬";
  if (type.startsWith("audio/")) return "🎵";
  if (type.includes("pdf")) return "📄";
  if (type.includes("zip") || type.includes("tar") || type.includes("gzip")) return "🗜️";
  if (type.includes("spreadsheet") || type.includes("excel") || type.includes("csv")) return "📊";
  if (type.includes("word") || type.includes("document")) return "📝";
  return "📁";
};

// export default function 
const Dragdrop: React.FC<DragdropProps> = ({
  onFileSelect = () => {},
  multiple = true,
  accept,
  className,
  pending = false,
  pendingText = "Uploading...",
  setFileUpload,
  fileUpload
}) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [result, setResult] = useState<any>(null);
  const [onAnalyze,setOnAnalyze] = useState(false);
  // Do not edit the prompt below, it is used for AI analysis of the uploaded file
  const prompt = `Extract information from the provided image/file and map it into the following JSON structure. If data is missing for a field, use zero if it's number or double if it's text use text minus sign . Return strictly the JSON object without any Markdown formatting or extra text.
  {
  "fullName": "string", // Just name patient in paper or File
  "provide":"string",
  "age": "int",
  "gender":"string",
  "historical": "string",
  "height": "double",
  "weight": "double",
  "bmi": "double",
  "vital_signs": {
    "temperature": "double",
    "heart_rate": "int",
    "blood_pressure": "string",
    "respiratory_rate": "int",
    "oxygen_saturation": "int",
    "pulse":"int",
  },
  "blood_test": {
    "cbc": {
      "wbc": "double",
      "rbc": "double",
      "hemoglobin": "double",
      "hematocrit": "double",
      "platelets": "double",
      "mcv": "double"
    },
    "fasting_blood_sugar": "double",
    "hba1c":"int",
    "lipid_profile": {
      "total_cholesterol": "double",
      "hdl": "double",
      "ldl": "double",
      "triglycerides": "double"
    },
    "liver_function_test": {
      "ast": "double",
      "alt": "double",
      "alp": "double",
      "total_bilirubin": "double",
      "albumin": "double",
      "ggt": "double",
      "direct_bilirubin": "double"
    },
    "kidney_function_test": {
      "bun": "double",
      "creatinine": "double",
      "egfr": "double"
    },
    "uric_acid": "double"
  },
  "urinalysis": {
    "color": "string",
    "clarity": "string",
    "specific_gravity": "double",
    "ph": "double",
    "protein": "string",
    "glucose": "string",
    "ketones": "string",
    "wbc": "int",
    "rbc": "int"
  },
  "stool_examination": {
    "macroscopic": "string",
    "occult_blood": "string"
  },
  "chest_xray": {
    "lung_opacity": "string",
    "heart": {
      "ctr": "double",
      "cardiomegaly": "string"
    }
  },
  "electrocardiogram": {
    "rhythm": "string",
    "heart_rate": "int",
    "st_segment": "string",
    "t_wave": "string"
  },
  "ultrasound": {
    "upper_abdomen": "string",
    "lower_abdomen": "string"
  }
}
  `;

  const handleConfirmAnalyze =async () => {
  try{
const formdata = new FormData();
    formdata.append("file", selectedFiles[0]);
    formdata.append('prompt', prompt);
    setOnAnalyze(true);
    const res = await fetch("http://localhost:2710/ai", {
      method: "POST",
      body: formdata,
    });

    const data = await res.json();
  
    setResult(data);
    setFileUpload(data);
    setOnAnalyze(false);
    console.log("Analysis Result:", data);
 
  }catch(err){
    console.error("Error during analysis:", err);
  }
    
    
  }
  const handleDrag = (e: React.DragEvent) => {
    if (pending) return;
    
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    if (pending) return;
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (!files.length) return;

    if (!multiple && files.length > 1) {
      setError("Only one file is allowed");
      return;
    }

    const acceptedTypes = accept ? accept.split(",") : [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isValidFileType = acceptedTypes.some((type) => {
        const regex = new RegExp(type.replace("*", ".*"));
        return regex.test(file.type);
      });

      if (accept && !isValidFileType) {
        setError(`Invalid file type: ${file.name}`);
        return;
      }
    }

    setError(null);
    setSelectedFiles(Array.from(files));
    onFileSelect(files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (pending) return;
    if (e.target.files) {
      setError(null);
      setSelectedFiles(Array.from(e.target.files));
      onFileSelect(e.target.files);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const triggerFileSelect = () => {
    if (pending) return;
    inputRef.current?.click();
  };

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-ring {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.08); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dragdrop-shimmer {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255,255,255,0.06) 40%,
            rgba(255,255,255,0.12) 50%,
            rgba(255,255,255,0.06) 60%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.6s linear infinite;
        }
        .spinner-ring {
          animation: spin-slow 1s linear infinite;
        }
        .pulse-ring {
          animation: pulse-ring 1.6s ease-in-out infinite;
        }
        .file-item {
          animation: slide-in 0.15s ease-out;
        }
      `}</style>

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileSelect}
        className={`${className} relative border-2 border-dashed rounded-lg text-center transition-all duration-200 overflow-hidden
          ${pending
            ? "border-primary/40 bg-base-200 cursor-wait"
            : dragActive
            ? "border-primary bg-primary/5 cursor-pointer"
            : "border-base-content/20 bg-base-200 cursor-pointer hover:border-primary/50 hover:bg-base-200/80"
          }
        `}
        style={{ padding: "1.5rem" }}
      >
        {pending && (
          <div className="dragdrop-shimmer absolute inset-0 pointer-events-none" />
        )}

        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple={multiple}
          accept={accept}   
          onChange={handleChange}
          disabled={pending}
        />

        <div className="relative flex flex-col items-center gap-2">
          {pending ? (
            <>
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="pulse-ring absolute inset-0 rounded-full border-2 border-primary/30" />
                <svg
                  className="spinner-ring w-8 h-8 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12" cy="12" r="10"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray="31.4 31.4"
                    strokeDashoffset="7.85"
                    opacity="0.25"
                  />
                  <path
                    d="M12 2a10 10 0 0 1 10 10"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-primary">{pendingText}</p>
              <p className="text-xs text-base-content/40">Please wait…</p>
            </>
          ) : (
            <>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
                  dragActive ? "bg-primary/15" : "bg-base-content/8"
                }`}
              >
                <svg
                  className={`w-5 h-5 transition-colors duration-200 ${
                    dragActive ? "text-primary" : "text-base-content/40"
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="16 16 12 12 8 16" />
                  <line x1="12" y1="12" x2="12" y2="21" />
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                </svg>
              </div>
              <p className="text-sm text-base-content/50">
                {dragActive
                  ? "Release to upload"
                  : multiple
                  ? "Drag & drop file here to auto fill form"
                  : "Drag & drop file here to auto fill form"}
              </p>
            </>
          )}
        </div>
      </div>

      {error && !pending && (
        <p className="text-xs text-error mt-2">{error}</p>
      )}
{/* File show Section */}
      {selectedFiles.length > 0 && !pending && (
        <ul className="mt-2 flex flex-col gap-1">
          {selectedFiles.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="file-item flex items-center gap-2 px-3 py-2 rounded-lg bg-base-200 border border-base-content/10"
            >
              <span className="text-base leading-none">{getFileIcon(file.type)}</span>
              <span className="flex-1 text-xs text-base-content/80 truncate min-w-0">
                {file.name}
              </span>
              <span className="text-xs text-base-content/40 shrink-0">
                {formatBytes(file.size)}
              </span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                className="shrink-0 w-4 h-4 flex items-center justify-center rounded-full text-base-content/30 hover:text-error hover:bg-error/10 transition-colors"
                aria-label={`Remove ${file.name}`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-3 h-3">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
      {selectedFiles.length > 0 && !pending && (
         <div className="flex justify-center mt-4">
          {!onAnalyze &&(
            <button
          type="button"
          onClick={handleConfirmAnalyze}
          className="btn btn-primary px-6 py-2 text-sm font-medium transition-colors disabled:bg-primary/50 disabled:text-primary/30 disabled:cursor-not-allowed bg-blue-500/80 rounded-md p-1 text-white hover:bg-blue-500/100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:hover:bg-blue-500/80 disabled:hover:text-white/80"
        >
         Upload
        </button>
          )}
          {onAnalyze && (
            <button
          type="button"
          disabled
          
          className="btn btn-primary px-6 py-2 text-sm font-medium transition-colors disabled:bg-primary/50 disabled:text-primary/30 disabled:cursor-not-allowed bg-slate-500/80 rounded-md p-1 text-white  "
        >
         Analyzing.....
        </button>
          )}
        
      </div>
      )}
     
    </>
  );
};

export default Dragdrop;