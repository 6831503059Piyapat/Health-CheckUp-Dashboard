export default function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <section>
    <h2 className="text-lg font-bold text-slate-700 mb-6 uppercase tracking-tight border-l-4 border-[#137fec] pl-3">
      {title}
    </h2>
    {children}
  </section>
    );
  }