"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';



export default function dropDown({data,type}:any) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(type==="Body Mass Index"?"Body Mass Index":"Length of data");
    const [metrics,setMetrics] = useState<any[]>(data);
  return (
    <div className="relative w-50 font-sans text-[#475569]">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between rounded-t-xl bg-white border px-4 py-2 text-sm font-medium transition-all
          ${!isOpen ? 'rounded-b-xl' : 'border-b border-slate-300'}`}
      >
        <span>{selected}</span>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 right-0 z-50 mt-0 max-h-64 overflow-y-auto rounded-b-xl border border-t-0 border-slate-300 bg-[#F1F5F9] shadow-lg scrollbar-hide"
          >
            {metrics.map((metric, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelected(metric);
                  setIsOpen(false);
                }}
                className="w-full border-b border-slate-200 px-4 py-2.5 text-left text-xs hover:bg-white transition-colors last:border-0 last:rounded-b-xl"
              >
                {metric}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}