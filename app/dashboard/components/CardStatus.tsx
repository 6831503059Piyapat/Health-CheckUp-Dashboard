'use client';
import React from 'react';
import { HeartPulse, Lollipop, Droplet,Droplets, WeightTilde, Bubbles } from 'lucide-react';

interface Props {
  typeData?: string;
  setTypeData: (s: string) => void;
  dataFetchData?: any[];
  setIsDanger?: (b: boolean) => void;
}

const metrics = [
  'Body Mass Index',
  'Fasting blood sugar',
  'Cholesterol',
  'HDL',
  'LDL',
  'Blood pressure',
  'Triglyceride',
  'Creatinine',
  'ALT',
  'Hemoglobin',
  'White blood cell',
  'Platelet',
  'Oxygen level',
  'Heart rate',
];

const keyMap: Record<string, string> = {
  'Body Mass Index': 'bmi',
  'Fasting blood sugar': 'fbs',
  Cholesterol: 'cholesterol',
  HDL: 'hdl',
  LDL: 'ldl',
  'Blood pressure': 'bloodPressure',
  Triglyceride: 'triglycerides',
  Creatinine: 'creatinine',
  ALT: 'sgpt',
  Hemoglobin: 'hemoglobin',
  'White blood cell': 'wbc',
  Platelet: 'platelets',
  'Oxygen level': 'spo2',
  'Heart rate': 'heartRate',
};

// Standard ranges (inclusive) used to determine status. Values are illustrative and can be adjusted.
const ranges: Record<string, { min?: number; max?: number; higherIsBetter?: boolean }> = {
  'Body Mass Index': { min: 18.5, max: 24.9 },
  'Fasting blood sugar': { min: 0.1, max: 99 },
  Cholesterol: { min: 0.1, max: 199 },
  HDL: { min: 60, max: 97, higherIsBetter: true },
  LDL: { min: 0.1, max: 129 },
  Triglyceride: { min: 0.1, max: 149 },
  Creatinine: { min: 0.6, max: 1.3 },
  ALT: { min: 0.1, max: 40 },
  Hemoglobin: { min: 12, max: 17 },
  'White blood cell': { min: 4500, max: 11000 },
  Platelet: { min: 150000, max: 450000 },
  'Oxygen level': { min: 95, max: 100 },
  'Heart rate': { min: 60, max: 100 },
};

function safeGetLatest(dataFetchData?: any[]) {
  if (!dataFetchData || dataFetchData.length === 0) return null;
  // choose entry with latest dateFile if available, otherwise last element
  try {
    return dataFetchData.reduce((prev: any, curr: any) => {
      const p = new Date(prev?.dateFile || prev?.date || 0).getTime();
      const c = new Date(curr?.dateFile || curr?.date || 0).getTime();
      return c > p ? curr : prev;
    });
  } catch {
    return dataFetchData[dataFetchData.length - 1];
  }
}

const CardStatus: React.FC<Props> = ({ typeData, setTypeData, dataFetchData,setIsDanger }) => {
  const latest = safeGetLatest(dataFetchData);

  function typeDataRisk(typeDisease?: string) {
    if (!dataFetchData || dataFetchData.length === 0) return 'No data';
    const d = dataFetchData[0]?.suggestionData;
    switch (typeDisease) {
      case 'Body Mass Index':
        return d?.bmi_suggestion?.Risk_of_disease || 'No data';
      case 'Fasting blood sugar':
        return d?.fbs_suggestion?.Risk_of_disease || 'No data';
      case 'Cholesterol':
        return d?.cholesterol_suggestion?.Risk_of_disease || 'No data';
      case 'HDL':
        return d?.hdl_suggestion?.Risk_of_disease || 'No data';
      case 'LDL':
        return d?.ldl_suggestion?.Risk_of_disease || 'No data';
      case 'Blood pressure':
        return d?.bloodPressure_suggestion?.Risk_of_disease || 'No data';
      case 'Triglyceride':
        return d?.triglycerides_suggestion?.Risk_of_disease || 'No data';
      case 'Creatinine':
        return d?.creatinine_suggestion?.Risk_of_disease || 'No data';
      case 'ALT':
        return d?.sgpt_suggestion?.Risk_of_disease || 'No data';
      case 'Hemoglobin':
        return d?.hemoglobin_suggestion?.Risk_of_disease || 'No data';
      case 'White blood cell':
        return d?.wbc_suggestion?.Risk_of_disease || 'No data';
      case 'Platelet':
        return d?.platelets_suggestion?.Risk_of_disease || 'No data';
      case 'Oxygen level':
        return d?.spo2_suggestion?.Risk_of_disease || 'No data';
      case 'Heart rate':
        return d?.heartRate_suggestion?.Risk_of_disease || 'No data';
      default:
        return 'No data';
    }
  }

  function displayValue(metric: string) {
    const key = keyMap[metric];
    if (!latest) return '—';
    // try direct value
    const val = latest?.[key];
    if (val !== undefined && val !== null && String(val) !== '') return String(val);
    // fallback: check nested form/data fields
    if (latest.data && latest.data[key]) return String(latest.data[key]);
    if (latest.form && latest.form[key]) return String(latest.form[key]);
    // last resort: suggestionData values (may be text)
    const sugKey = `${key}_suggestion`;
    if (latest.suggestionData && latest.suggestionData[sugKey]) return String(latest.suggestionData[sugKey]);
    return '—';
  }

  function parseNumber(value: string) {
    if (!value) return null;
    const s = String(value).trim();
    // handle blood pressure explicitly when it contains a '/'
    if (s.includes('/')) {
      const m = s.match(/^(\s*)(\d{2,3})\s*\/\s*(\d{2,3})(\s*)$/);
      if (m) return Number(m[2]);
      const m2 = s.match(/(\d{2,3})\s*\/\s*(\d{2,3})/);
      if (m2) return Number(m2[1]);
    }
    // general numeric extraction (includes decimals)
    const numMatch = s.replace(/,/g, '').match(/-?\d+(?:\.\d+)?/);
    return numMatch ? Number(numMatch[0]) : null;
  }

  function evaluateStatus(metric: string, rawValue: string) {
    if (!rawValue || rawValue === '—') return 'unknown';
    // special case: blood pressure '120/80'
    if (metric === 'Blood pressure') {
      const m = rawValue.match(/(\d{2,3})\s*\/\s*(\d{2,3})/);
      if (!m) return 'unknown';
      const sys = Number(m[1]);
      const dia = Number(m[2]);
      if (isNaN(sys) || isNaN(dia)) return 'unknown';
      if (sys >= 140 || dia >= 90) return 'high';
      if (sys < 90 || dia < 60) return 'low';
      if (sys >= 120 || dia >= 80) return 'high';
      return 'normal';
    }

    const val = parseNumber(rawValue);
    if (val === null) return 'unknown';

    const r = ranges[metric];
    if (!r) return 'unknown';
    if (r.higherIsBetter) {
      if (val < (r.min ?? -Infinity)) return 'low';
      return 'normal';
    }
    if (r.min !== undefined && val < r.min) return 'low';
    if (r.max !== undefined && val > r.max) return 'high';
    return 'normal';
  }

  function classesForStatus(status: string) {
    switch (status) {
      case 'high':
        return { pill: 'bg-red-100 text-red-600', border: 'border-red-200' ,bg: 'bg-red-50/50'};
      case 'low':
        return { pill: 'bg-yellow-100 text-yellow-600', border: 'border-yellow-200' ,bg: 'bg-yellow-50/50'};
      case 'normal':
        return { pill: 'bg-blue-100 text-blue-600', border: 'border-blue-200' ,bg: 'bg-blue-50/50'};
      default:
        return { pill: 'bg-gray-100 text-gray-600', border: 'border-gray-100',bg:'bg-gray-50/50' };
    }
  }

  const iconFor = (metric: string) => {
    switch (metric) {
      case 'Blood pressure':
      case 'Heart rate':
        return <HeartPulse />;
      case 'Fasting blood sugar':
        return <Lollipop />;
      case 'Body Mass Index':
        return <WeightTilde />;
      case 'Oxygen level':
        return <Bubbles />;
      case 'Cholesterol':
      case 'Triglyceride':
      case 'HDL':
      case 'LDL':
        return <Droplets />;
      default:
        return <Droplet />;
    }
  };

  return (
    <div>
      <div className='overflow-y-auto h-[40vh] md:h-[50vh] [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:display-none'>
        {/* <div className={`flex justify-between gap-5 items-center transition-all mb-4 bg-white p-5  ${typeData === 'Blood pressure' ? 'border border-blue-500 border-2' : 'border-2 border border-white'}  rounded-xl`} onClick={() => setTypeData('Blood pressure')}>
        <div className="flex items-center gap-5">
          <HeartPulse />
          <div>
            <p className="text-sm text-slate-500">Blood Pressure</p>
            <p className={`font-bold`}>118/76 mmHg</p>
          </div>
        </div>
        <p className="mr-5 bg-green-100 text-green-500 px-2 py-1 rounded-full font-bold text-[11px] text-center">Normal</p>
      </div> */}

      {metrics.map((metric) => {
        const val = displayValue(metric);
        const status = evaluateStatus(metric, val);
        const cls = classesForStatus(status);
        const cardBorder = typeData === metric ? `border  ${status === 'high' ? 'border-red-500' : status === 'low' ? 'border-yellow-500' : 'border-blue-500'  } border-2` : `border-2 ${cls.border}`;
        const pillText = status === 'normal' ? 'Normal' : status === 'high' ? 'High' : status === 'low' ? 'Low' : 'N/A';
        return (
          <div
            key={metric}
            className={`flex justify-between gap-5 items-center transition-all mb-4 ${cls.bg} p-5 ${cardBorder} rounded-xl`}
            onClick={() => {
              setTypeData(metric);
              if (setIsDanger) {
                setIsDanger(status === 'high');
              }
            }}
          >
            <div className="flex items-center gap-5">
              {iconFor(metric)}
              
              <div>
                <p className="text-sm text-slate-500">{metric}</p>
                <p className={`font-bold`}>{val}</p>
              </div>
            </div>
            <p className={`mr-5 px-2 py-1 rounded-full font-bold text-[11px] text-center ${cls.pill}`}>{pillText}</p>
          </div>
        );
      })}

    </div>
    
    </div>
  );
};

export default CardStatus;
