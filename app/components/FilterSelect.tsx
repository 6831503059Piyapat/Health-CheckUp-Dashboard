import { ChevronDown } from "lucide-react";
export default function FilterSelect({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-6 px-4 py-2.5 bg-slate-50 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors">
      {label}
      <ChevronDown size={16} className="text-slate-400" />
    </button>
  );
}