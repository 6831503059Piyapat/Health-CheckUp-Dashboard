import Navbar from "../components/Navbar";

export default function CalendarPage() {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
    <Navbar/>
          <div className="max-w-5xl mx-auto space-y-6 mb-6 mt-6">
            <h1>Calendar</h1>
        </div>
      </div>
  );
}