
export default function VitalSign({ register,fileUpload }: any) {
    return(
        <section data-purpose="vital-signs">
<h2 className="text-lg font-bold text-slate-700 mb-6 uppercase tracking-tight">2. Vital Signs</h2>
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
<div>
<label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Temp (C)</label>
<input className="w-full p-2 rounded-md border border-slate-200 focus:border-[#137fec] focus:ring-1 focus:ring-[#137fec] outline-none transition-all"
 type="number" min={25} max={45} step="0.1" {...register("temperature",{value:fileUpload?.vital_signs.temperature})} />
</div>
<div>
<label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Heart Rate (BPM)</label>
<input className="w-full p-2 rounded-md border border-slate-200 focus:border-[#137fec] focus:ring-1 focus:ring-[#137fec] outline-none transition-all" type="number" min={0} max={300} {...register("heartRate",{value:fileUpload?.vital_signs.heart_rate})} />
</div>
<div>
<label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Resp. Rate (min)</label>
<input className="w-full p-2 rounded-md border border-slate-200 focus:border-[#137fec] focus:ring-1 focus:ring-[#137fec] outline-none transition-all" type="number" min={0} max={100} {...register("respiratoryRate",{value:fileUpload?.vital_signs.respiratory_rate})} />
</div>
<div>
<label className="block text-xs font-bold text-slate-500 mb-1 uppercase">BP (mmHg)</label>
<input className="w-full p-2 rounded-md border border-slate-200 focus:border-[#137fec] focus:ring-1 focus:ring-[#137fec] outline-none transition-all" placeholder="120/80" type="text" {...register("bloodPressure",{value:fileUpload?.vital_signs.blood_pressure})} />
</div>
<div>
<label className="block text-xs font-bold text-slate-500 mb-1 uppercase">SpO2 (%RA)</label>
<input className="w-full p-2 rounded-md border border-slate-200 focus:border-[#137fec] focus:ring-1 focus:ring-[#137fec] outline-none transition-all" type="number" min={0} max={100} {...register("spo2",{value:fileUpload?.vital_signs.oxygen_saturation})} />
</div>
<div>
<label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Pulse. Rate (min)</label>
<input className="w-full p-2 rounded-md border border-slate-200 focus:border-[#137fec] focus:ring-1 focus:ring-[#137fec] outline-none transition-all" type="number" min={0} max={300} {...register("pulse",{value:fileUpload?.vital_signs.pulse})} />
</div>
</div>
</section>
    )
}