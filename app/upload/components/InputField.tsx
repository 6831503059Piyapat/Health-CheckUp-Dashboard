export default function InputField({label, type = "text", registration, placeholder, size = "md"}:any) {
    return (
      <div>
    <label className={`block font-semibold mb-1 ${size === 'sm' ? 'text-xs text-slate-500 uppercase' : 'text-sm'}`}>
      {label}
    </label>
    <input
      type={type}
      {...registration}
      placeholder={placeholder}
      className="w-full p-2 rounded-md border border-slate-200 focus:border-[#137fec] focus:ring-1 focus:ring-[#137fec] outline-none transition-all"
    />
  </div>
        )
    }