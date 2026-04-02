export default function RowInput({label,registration,type = 'text', min, max, step, placeholder}:any){
    return(
        <div className="flex justify-between items-center">
    <label className="text-sm font-medium text-slate-600">{label}</label>
    <input 
      type={type} 
      min={min}
      max={max}
      step={step}
      {...registration}
      placeholder={placeholder}
      className="w-24 p-1 text-right border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 outline-none" 
    />
  </div>
    )
}