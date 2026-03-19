export default function NavItem({ icon,
   label,
   active = false 
  }: { icon: React.ReactNode,
     label: string,
      active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all focus:ring-2 focus:ring-blue-500 ${
      active ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 '  
    }`}>
      {icon}
      {label}
    </button>
  );
}