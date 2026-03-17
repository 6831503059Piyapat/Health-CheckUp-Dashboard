export default function RowInput({label,registration}:any){
    return(
        <div className="flex justify-between items-center">
    <label className="text-sm font-medium text-slate-600">{label}</label>
    <input 
      type="text" 
      {...registration}
      className="w-24 p-1 text-right border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 outline-none" 
    />
  </div>
    )
}