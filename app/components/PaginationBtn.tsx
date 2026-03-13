export default function PaginationBtn({ label, active = false, disabled = false }: { label: string, active?: boolean, disabled?: boolean }) {
  return (
    <button 
      disabled={disabled}
      className={`px-3 py-1.5 rounded-md text-xs font-bold border transition-all ${
        active 
          ? 'bg-blue-600 border-blue-600 text-white' 
          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 disabled:opacity-50'
      }`}
    >
      {label}
    </button>
  );
}