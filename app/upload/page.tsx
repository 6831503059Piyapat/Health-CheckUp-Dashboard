'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { UploadCloud, FileText, CheckCircle, Loader2, X, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import { a, s } from 'framer-motion/client';
import { set } from 'react-hook-form';

const emptyForm = {
  fullName: '', gender: '', age: '', height: '', weight: '', bmi: '',
  dateFile: '', provide: '', dateupload: new Date().toISOString().split('T')[0],
  pulse: '', temperature: '', heartRate: '', bloodPressure: '', respiratoryRate: '', spo2: '',
  fbs: '', cholesterol: '', hdl: '', ldl: '', triglycerides: '', creatinine: '',
  sgpt: '', hemoglobin: '', wbc: '', platelets: '', rbc: '', hematocrit: '',
  mcv: '', hba1c: '', sgot: '', alp: '', total_bilirubin: '', albumin: '',
  ggt: '', direct_bilirubin: '', history: '',
};

type FormData = typeof emptyForm;

// Map flat API response directly onto form fields (case-insensitive key match)
function mapApiToForm(data: any): Partial<FormData> {
  if (!data || typeof data !== 'object') return {};
  const formKeys = Object.keys(emptyForm);
  const updates: Partial<FormData> = {};
  for (const [k, v] of Object.entries(data)) {
    if (v == null) continue;
    const match = formKeys.find(fk => fk.toLowerCase() === k.toLowerCase());
    if (match) updates[match as keyof FormData] = String(v);
  }
  return updates;
}

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [form, setForm] = useState<FormData>(emptyForm);
  const [step, setStep] = useState<'upload' | 'review'>('upload');
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);  
  const [saveOk, setSaveOk] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/auth/login'); return; }
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded.exp! < Date.now() / 1000) {
        localStorage.removeItem('token');
        router.push('/auth/login');
        return;
      }
    } catch {
      localStorage.removeItem('token');
      router.push('/auth/login');
      return;
    }

    // Pre-fill form with existing health data
    fetch(`${process.env.NEXT_PUBLIC_PORT}/users/me/data`, {
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setForm(prev => ({ ...prev, ...mapApiToForm(data) }));
      })
      .catch(() => {});
  }, []);

  // Auto-calculate BMI from height + weight
  useEffect(() => {
    const h = parseFloat(form.height);
    const w = parseFloat(form.weight);
    if (h > 0 && w > 0) {
      const bmi = (w / ((h / 100) ** 2)).toFixed(1);
      setForm(prev => ({ ...prev, bmi }));
    }
  }, [form.height, form.weight]);

  // Auto-calculate LDL via Friedewald equation (only valid when TG < 400)
  useEffect(() => {
    const tc  = parseFloat(form.cholesterol);
    const hdl = parseFloat(form.hdl);
    const tg  = parseFloat(form.triglycerides);
    if (tc > 0 && hdl > 0 && tg > 0 && tg < 400) {
      const ldl = (tc - hdl - tg / 5).toFixed(1);
      setForm(prev => ({ ...prev, ldl }));
    }
  }, [form.cholesterol, form.hdl, form.triglycerides]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleExtract = async () => {
    if (!file) return;
    setIsExtracting(true);
    setExtractedText('');
    try {
      const token = localStorage.getItem('token');
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`${process.env.NEXT_PUBLIC_PORT}/ai/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd,
      });
      const text = await res.text();
      setExtractedText(text);

      try {
        let parsed = JSON.parse(text);
        if (typeof parsed === 'string') parsed = JSON.parse(parsed);
        const updates = mapApiToForm(parsed);
        if (Object.keys(updates).length > 0) {
          setForm(prev => ({ ...prev, ...updates }));
        }
      } catch { /* plain text — user fills manually */ }

      setStep('review');
    } catch {
      setStep('review');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSave =async () => {
    setIsSaving(true);
    if(!suggestion){
       const res = await fetch(`${process.env.NEXT_PUBLIC_PORT}/ai/suggest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ObjData: form,
          promptData: 'Based on these health results, give a brief summary of the patient\'s health status and any key areas of concern.',
        }),
      });
      const text = await res.text();
      let result: string;
      try {
        const json = JSON.parse(text);
        result = typeof json === 'string' ? json : json?.suggestion ?? JSON.stringify(json, null, 2);
      } catch {
        result = text;
      }
      const saveSuggest = await fetch(`${process.env.NEXT_PUBLIC_PORT}/users/create-post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
         },
        body: JSON.stringify({
          ...form, suggestion: result
        })
      });

    }else{
      const saveSuggest = await fetch(`${process.env.NEXT_PUBLIC_PORT}/users/create-post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
         },
        body: JSON.stringify({
          ...form,suggestion: suggestion
        })
      });
    }
    
    setSaveOk(true);
    setIsSaving(false);
      
  };

  const handleSuggest = async () => {
    setIsSuggesting(true);
    setSuggestion('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PORT}/ai/suggest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ObjData: form,
          promptData: 'Based on these health results, give a brief summary of the patient\'s health status and any key areas of concern.',
        }),
      });
      const text = await res.text();
      let result: string;
      try {
        const json = JSON.parse(text);
        result = typeof json === 'string' ? json : json?.suggestion ?? JSON.stringify(json, null, 2);
      } catch {
        result = text;
      }
      setSuggestion(result);
      
    } catch {
      setSuggestion('Failed to get AI suggestion. Please try again.');
    } finally {
      setIsSuggesting(false);
    }
  };

  const field = (label: string, key: keyof FormData, type = 'text') => (
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
        className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );

  if (saveOk) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Navbar />
        <main className="ml-64 flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <CheckCircle className="mx-auto text-green-500" size={64} />
            <h2 className="text-2xl font-bold text-slate-800">Saved successfully</h2>
            <p className="text-slate-500">Your health data has been recorded.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => { setForm(emptyForm); setFile(null); setExtractedText(''); setStep('upload'); setSaveOk(false); }} className="px-5 py-2 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-100">Upload another</button>
              <button onClick={() => router.push('/')} className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">Go to Dashboard</button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="ml-64 flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Upload Health Report</h1>
          <p className="text-slate-500 text-sm mb-6">Upload a medical report PDF or image. AI will extract the data for you to review before saving.</p>

          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-8">
            <div className={`flex items-center gap-2 text-sm font-semibold ${step === 'upload' ? 'text-blue-600' : 'text-slate-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 'upload' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>1</span>
              Upload File
            </div>
            <div className="flex-1 h-px bg-slate-200" />
            <div className={`flex items-center gap-2 text-sm font-semibold ${step === 'review' ? 'text-blue-600' : 'text-slate-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 'review' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>2</span>
              Review & Save
            </div>
          </div>

          {step === 'upload' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-6">
              {/* Drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'}`}
              >
                <UploadCloud size={48} className={isDragging ? 'text-blue-500' : 'text-slate-400'} />
                <p className="mt-4 font-semibold text-slate-700">Drag & drop your file here</p>
                <p className="text-sm text-slate-400 mt-1">or click to browse — PDF, JPG, PNG supported</p>
                <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={e => e.target.files?.[0] && setFile(e.target.files[0])} />
              </div>

              {/* Selected file */}
              {file && (
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
                  <FileText size={20} className="text-blue-500 shrink-0" />
                  <span className="text-sm text-slate-700 font-medium flex-1 truncate">{file.name}</span>
                  <span className="text-xs text-slate-400">{(file.size / 1024).toFixed(0)} KB</span>
                  <button onClick={e => { e.stopPropagation(); setFile(null); }} className="text-slate-400 hover:text-red-500">
                    <X size={16} />
                  </button>
                </div>
              )}

              <button
                disabled={!file || isExtracting}
                onClick={handleExtract}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                {isExtracting ? <><Loader2 size={18} className="animate-spin" /> Extracting…</> : 'Extract with AI'}
              </button>
            </div>
          )}

          {step === 'review' && (
            <div className="space-y-6">
              {/* AI extracted text */}
              {extractedText && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <h2 className="font-semibold text-slate-700 mb-3">AI Extracted Text</h2>
                  <pre className="text-xs text-slate-600 bg-slate-50 rounded-lg p-4 whitespace-pre-wrap max-h-48 overflow-y-auto border border-slate-100">{extractedText}</pre>
                </div>
              )}

              {/* Form */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
                <h2 className="font-semibold text-slate-700">Patient Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  {field('Full Name', 'fullName')}
                  {field('Gender', 'gender')}
                  {field('Age', 'age')}
                  {field('Height (cm)', 'height')}
                  {field('Weight (kg)', 'weight')}
                  {field('BMI', 'bmi')}
                  {field('Date of Report', 'dateFile', 'date')}
                  {field('Provider / Doctor', 'provide')}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
                <h2 className="font-semibold text-slate-700">Vital Signs</h2>
                <div className="grid grid-cols-3 gap-4">
                  {field('Pulse (bpm)', 'pulse')}
                  {field('Temperature (°C)', 'temperature')}
                  {field('Heart Rate (bpm)', 'heartRate')}
                  {field('Blood Pressure', 'bloodPressure')}
                  {field('Respiratory Rate', 'respiratoryRate')}
                  {field('SpO2 (%)', 'spo2')}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
                <h2 className="font-semibold text-slate-700">Blood Tests</h2>
                <div className="grid grid-cols-3 gap-4">
                  {field('FBS (mg/dL)', 'fbs')}
                  {field('Cholesterol (mg/dL)', 'cholesterol')}
                  {field('HDL (mg/dL)', 'hdl')}
                  {field('LDL (mg/dL)', 'ldl')}
                  {field('Triglycerides (mg/dL)', 'triglycerides')}
                  {field('Creatinine (mg/dL)', 'creatinine')}
                  {field('ALT/SGPT (U/L)', 'sgpt')}
                  {field('SGOT (U/L)', 'sgot')}
                  {field('ALP', 'alp')}
                  {field('GGT', 'ggt')}
                  {field('Total Bilirubin', 'total_bilirubin')}
                  {field('Direct Bilirubin', 'direct_bilirubin')}
                  {field('Albumin', 'albumin')}
                  {field('HbA1c (%)', 'hba1c')}
                  {field('Hemoglobin (g/dL)', 'hemoglobin')}
                  {field('WBC (cell/uL)', 'wbc')}
                  {field('RBC (cell/uL)', 'rbc')}
                  {field('Platelets (cell/uL)', 'platelets')}
                  {field('Hematocrit', 'hematocrit')}
                  {field('MCV', 'mcv')}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-3">
                <h2 className="font-semibold text-slate-700">Medical History</h2>
                <textarea
                  value={form.history}
                  onChange={e => setForm(prev => ({ ...prev, history: e.target.value }))}
                  rows={4}
                  placeholder="Notes, history, or additional context…"
                  className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* AI Suggest */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-slate-700">AI Health Suggestion</h2>
                  <button
                    onClick={handleSuggest}
                    disabled={isSuggesting}
                    className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-all"
                  >
                    {isSuggesting ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
                    {isSuggesting ? 'Analyzing…' : 'Get Suggestion'}
                  </button>
                </div>
                {suggestion && (
                  <p className="text-sm text-slate-600 bg-violet-50 border border-violet-100 rounded-lg p-4 whitespace-pre-wrap">{suggestion}</p>
                )}
                {!suggestion && !isSuggesting && (
                  <p className="text-xs text-slate-400">Click "Get Suggestion" to have AI analyze the filled-in health data.</p>
                )}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep('upload')} className="px-6 py-3 rounded-xl border border-slate-200 text-sm font-medium hover:bg-slate-100">
                  Back
                </button>
                <button
                  onClick={handleSave}
                  className={`flex-1 ${isSaving ? 'bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all`}
                >
                 {isSaving ?(<><Loader2 size={18} className="animate-spin" /> Saving…</>) : 'Save'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
