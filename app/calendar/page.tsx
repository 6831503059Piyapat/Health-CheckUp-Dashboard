'use client'
import React, { useState,useEffect } from "react";
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, isSameMonth, isSameDay, eachDayOfInterval 
} from "date-fns";
import { ChevronRight, ChevronLeft, Calendar as CalendarIcon, Plus, X, Clock } from 'lucide-react';
import Navbar from "../components/Navbar";
import AuthNavbar from "../auth/components/AuthNavbar";
import { useRouter } from "next/navigation";
import { jwtDecode,JwtPayload } from "jwt-decode";
interface CalendarEvent {
  _id: string;
  title: string;
  time: string; 
}

type EventsState = Record<string, CalendarEvent[]>;

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null); 

  const [hour, setHour] = useState("09");
  const [minute, setMinute] = useState("00");

  const [events, setEvents] = useState<EventsState>({});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  // --- State สำหรับฟอร์มใหม่ ---
  const [newEventTitle, setNewEventTitle] = useState<string>("");
  const [newEventTime, setNewEventTime] = useState<string>("09:00"); // Default time

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
const router = useRouter();
 const fetchEvents = async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_PORT}/users/me/Calendar`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) throw new Error("Failed to fetch events");

    const data = await response.json();
    
    const formattedEvents: EventsState = {};
    
    data.forEach((event: any) => {
      const dateKey = event.date; 
      if (!formattedEvents[dateKey]) {
        formattedEvents[dateKey] = [];
      }
      formattedEvents[dateKey].push({
        _id: event._id,
        title: event.title,
        time: event.time
      });
    });

    setEvents(formattedEvents);
  } catch (error) {
    console.error("Error fetching events:", error);
  }
};
useEffect(()=>{
 const token = localStorage.getItem("token");
      
      if (token) {
          try {
            const decoded = jwtDecode<JwtPayload>(token);
            const currentTime = Date.now() / 1000; 
      
            if (decoded.exp! < currentTime) {
              localStorage.removeItem("token");
              router.push('/auth/login');
            }
          } catch (error) {
            localStorage.removeItem("token");
            router.push('/auth/login');
          }
        }
        else{
          router.push('/auth/login');
        }
        fetchEvents();
},[currentMonth])
  const generateRandomString = (length: number) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
 const handleAddEvent = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!newEventTitle.trim()) return;

  const dateKey = format(selectedDate, "yyyy-MM-dd");
  const newEvent = {
    _id:generateRandomString(24),
    title: newEventTitle,
    time: `${hour}:${minute}`,
    date: dateKey 
  };

  setIsSubmitting(true);
  setStatusMessage(null);
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${process.env.NEXT_PUBLIC_PORT}/users/create-calendar`, {
      method: "POST",
      headers: { "Content-Type": "application/json",
        "Authorization":`Bearer ${token}`
       },
      body: JSON.stringify({
    _id:generateRandomString(24),
    title: newEventTitle,
    time: `${hour}:${minute}`,
    date: dateKey }),
    });

    if (!response.ok) throw new Error("Failed to save event");

    const savedData = await response.json();

    setEvents((prev) => {
      const updatedEvents = [...(prev[dateKey] || []), { ...newEvent, id: savedData.id || Date.now() }]
        .sort((a, b) => a.time.localeCompare(b.time));
      return { ...prev, [dateKey]: updatedEvents };
    });

    setStatusMessage({ type: 'success', text: 'Event saved successfully!' });
   
    setTimeout(() => {
      window.location.reload();
      setNewEventTitle("");
      setHour("09");
      setMinute("00");
      setIsModalOpen(false);
      setStatusMessage(null);
    }, 1000);

  } catch (error) {
    setStatusMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
  } finally {
    setIsSubmitting(false);
  }
};

  const deleteEvent = async (dateKey: string, id: string) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_PORT}/users/delete-calendar`, {
      method: "DELETE",
      headers: { "Content-Type":"application/json","Authorization": `Bearer ${token}` },
      body:JSON.stringify({eventId:id})
    });

    if (!response.ok) throw new Error("Failed to delete");

   
    setEvents((prev) => ({
      ...prev,
      [dateKey]: prev[dateKey].filter(event => event._id !== id)
    }));
  } catch (error) {
    alert("Could not delete event. Please try again.");
  }
};
const upcomingAppointments = Object.entries(events)
  .filter(([dateKey]) => {
    const eventDate = new Date(dateKey);
    return isSameMonth(eventDate, currentMonth);
  })
  .flatMap(([dateKey, dayEvents]) => 
    dayEvents.map(event => ({ ...event, dateKey }))
  )
  .sort((a, b) => {
    if (a.dateKey !== b.dateKey) return a.dateKey.localeCompare(b.dateKey);
    return a.time.localeCompare(b.time);
  });
  return (
    <div>
      <div className="top-0 sticky z-50">
        <AuthNavbar />
      </div>
      <Navbar />
      
      <div className="min-h-screen ml-64 p-8 bg-slate-50 font-sans text-slate-900">
        <h1 className="text-[40px] text-slate-800 mb-6">Calendar</h1>
        
        <div className="flex items-start justify-bewteen">
          {/* Main Calendar Section */}
          <div className="flex-1 bg-white rounded-xl p-4 shadow-sm border border-slate-100 overflow-hidden flex flex-col">
            {/* Header Controls */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
              <h2 className="text-2xl font-bold text-slate-800">{format(currentMonth, "MMMM yyyy")}</h2>
              <div className="flex gap-2">
                <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <ChevronLeft className="w-5 h-5 text-slate-600" />
                </button>
                <button onClick={() => setCurrentMonth(new Date())} className="px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  Today
                </button>
                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>
      
            {/* Grid Header */}
            <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                <div key={day} className="py-3 text-center text-xs font-bold text-slate-400 tracking-widest">{day}</div>
              ))}
            </div>

            {/* Calendar Body */}
            <div className="grid grid-cols-7 flex-1">
              {calendarDays.map((day, idx) => {
                const dateKey = format(day, "yyyy-MM-dd");
                const dayEvents = events[dateKey] || [];
                const isToday = isSameDay(day, new Date());
                const isSelected = isSameDay(day, selectedDate);

                return (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedDate(day)}
                    onDoubleClick={() => setIsModalOpen(true)}
                    className={`min-h-[120px] border-r border-b border-slate-50 p-2 transition-all cursor-pointer relative
                      ${!isSameMonth(day, monthStart) ? 'bg-slate-50/30 opacity-40' : 'bg-white'} 
                      ${isSelected ? 'bg-blue-50/50 ring-1 ring-inset ring-blue-200' : 'hover:bg-slate-50'}`}
                  >
                    <span className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full mb-1
                      ${isToday ? 'bg-blue-600 text-white' : 'text-slate-600'}`}>
                      {format(day, "d")}
                    </span>

                    <div className="space-y-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                      {dayEvents.map((event) => (
                        <div key={event._id} className="bg-blue-100 text-blue-700 text-[10px] p-1 rounded border-l-2 border-blue-500 truncate font-medium flex justify-between">
                          <span>{event.title}</span>
                          <span className="opacity-60">{event.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar (Right) */}
          <div className="space-y-4">

          {/* Upper */}
          <div className="w-80 ml-8 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 sticky top-24">
              <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-blue-500" />
                {format(selectedDate, "do MMMM")}
              </h2>
              
              <div className="space-y-3 overflow-y-auto h-50">
                {(events[format(selectedDate, "yyyy-MM-dd")] || []).length > 0 ? (
                  events[format(selectedDate, "yyyy-MM-dd")].map((event) => (
                    <div key={event._id} className="group flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100 ">
                      
                      <div className="flex items-center gap-3 ">
                        <div className="w-1 h-8 bg-blue-500 rounded-full" />
                        <div>
                          <p className="text-sm font-bold text-slate-700 text-wrap">{event.title.length > 15 
        ? event.title.substring(0, 15) + "..." 
        : event.title}
                          </p>  
                          <p className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {event.time}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => deleteEvent(format(selectedDate, "yyyy-MM-dd"), event._id)} 
                        className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:bg-red-50 rounded transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-8 bg-slate-50 rounded-xl border border-dashed">No events for this day</p>
                )}
                
                
              </div>
              <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full mt-4 py-3 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-slate-500 hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50/30 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-xs font-bold">Add Event</span>
                </button>
            </div>
          </div>

          {/* Under: Upcoming Appointment */}
<div className="w-80 ml-8 space-y-6">
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 sticky top-[420px]">
    <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
      <CalendarIcon className="w-5 h-5 text-blue-500" />
      Monthly Upcoming
    </h2>
    <div className="space-y-3 overflow-y-auto h-75 custom-scrollbar pr-1">
      {upcomingAppointments.length > 0 ? (
        upcomingAppointments.map((event) => (
          <div key={event._id} className="group flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-blue-500 rounded-full" />
              <div>
                <p className="text-[10px] font-bold text-blue-600 uppercase">
                  {format(new Date(event.dateKey), "MMM dd")}
                </p>
                <p className="text-sm font-bold text-slate-700 truncate w-32">
                  {event.title}
                </p>
                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {event.time}
                </p>
              </div>
            </div>
            
          </div>
        ))
      ) : (
        <p className="text-xs text-slate-400 text-center py-8 bg-slate-50 rounded-xl border border-dashed">
          No events for {format(currentMonth, "MMMM")}
        </p>
      )}
    </div>
  </div>
</div>
</div>
          
        </div>
      </div>

      {/* --- Add Event Modal --- */}
{isModalOpen && (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 text-black">
    <div className="bg-white rounded-md p-8 w-full max-w-md shadow-2xl border border-slate-100">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-2xl font-bold text-slate-800">New Event</h3>
          <p className="text-sm text-slate-600 mt-1">{format(selectedDate, "eeee, do MMMM")}</p>
        </div>
        <button onClick={() => setIsModalOpen(false)} className="p-2 cursor-pointer hover:bg-red-50 hover:text-red-500 rounded-full text-slate-400 transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <form onSubmit={handleAddEvent} className="space-y-6">
        {/* Input: Title */}
        
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-[2px] mb-3">Event Title</label>
          <input 
            autoFocus
            type="text" 
            value={newEventTitle}
            onChange={(e) => setNewEventTitle(e.target.value)}
            placeholder="What's the plan?"
            className="w-full p-4 bg-slate-50 border border-slate-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-300 font-medium"
          />
        </div>

        {/* Custom Time Selection UI */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-[2px] mb-3">Select Time</label>
          <div className="flex items-center gap-3">
            <div className="flex-1 relative group">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <select 
                value={hour}
                onChange={(e) => setHour(e.target.value)}
                className="w-full p-4 pl-12 bg-slate-50 border border-slate-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 appearance-none cursor-pointer font-bold text-slate-700"
              >
                {Array.from({ length: 24 }).map((_, i) => (
                  <option key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}</option>
                ))}
              </select>
            </div>
            <span className="text-2xl font-bold text-slate-300">:</span>
            <div className="flex-1 relative">
              <select 
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 appearance-none cursor-pointer font-bold text-slate-700 text-center"
              >
                {['00','05','10','15','20','25','30','35','40','45','50','55'].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        

{/* Status Message Notification */}
{statusMessage && (
  <div className={`p-3 rounded-lg text-xs font-bold text-center animate-in fade-in zoom-in duration-300 ${
    statusMessage.type === 'success' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'
  }`}>
    {statusMessage.text}
  </div>
)}

<div className="flex gap-4 pt-4">
  <button 
    type="button" 
    disabled={isSubmitting}
    onClick={() => setIsModalOpen(false)} 
    className="flex-1 py-4 font-bold text-slate-600 hover:bg-slate-50 rounded-2xl transition-all disabled:opacity-50"
  >
    Discard
  </button>
  <button 
    type="submit" 
    disabled={isSubmitting}
    className="flex-[2] py-4 font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-2xl shadow-xl shadow-blue-200 transition-all disabled:bg-slate-400 disabled:shadow-none flex items-center justify-center gap-2"
  >
    {isSubmitting ? (
      <>
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        Saving...
      </>
    ) : "Add Event"}
  </button>
</div>
      </form>
    </div>
  </div>
)}
    </div>
  );
}