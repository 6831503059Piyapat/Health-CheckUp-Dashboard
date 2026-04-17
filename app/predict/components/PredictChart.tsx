"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Props {
  typeData?: string;
  horizon?: number;
}

const METRIC_KEY: Record<string, string> = {
  "Body Mass Index": "bmi",
  "Fasting blood sugar": "fbs",
  "Cholesterol": "cholesterol",
  "HDL": "hdl",
  "LDL": "ldl",
  "Blood pressure": "bloodPressure",
  "Triglyceride": "triglycerides",
  "Creatinine": "creatinine",
  "ALT": "sgpt",
  "Hemoglobin": "hemoglobin",
  "White blood cell": "wbc",
  "Platelet": "platelets",
  "Oxygen level": "spo2",
  "Heart rate": "heartRate",
};

const RANGES: Record<string, { min?: number; max?: number }> = {
  "Body Mass Index": { min: 18.5, max: 24.9 },
  "Fasting blood sugar": { min: 0.1, max: 99 },
  "Cholesterol": { min: 0.1, max: 199 },
  "LDL": { min: 0.1, max: 129 },
  "Triglyceride": { min: 0.1, max: 149 },
  "Creatinine": { min: 0.6, max: 1.3 },
  "ALT": { min: 0.1, max: 40 },
  "White blood cell": { min: 4500, max: 11000 },
  "Platelet": { min: 150000, max: 450000 },
  "Heart rate": { min: 60, max: 100 },
  "Blood pressure": { min: 90, max: 140 },
  "HDL": { min: 60, max: 97 },
  "Oxygen level": { min: 95, max: 100 },
  "Hemoglobin": { min: 12, max: 17 },
};

export default function PredictChart({ typeData, horizon = 3 }: Props) {
  const [records, setRecords] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [reasoning, setReasoning] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    async function run() {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(`${process.env.NEXT_PUBLIC_PORT}/users/me`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.status === 401) {
          localStorage.removeItem("token");
          return;
        }
        const data = await res.json();
        const list = Array.isArray(data.Data)
          ? data.Data
          : Array.isArray(data.data)
          ? data.data
          : [];
        const sorted = [...list].sort(
          (a, b) =>
            new Date(a.dateFile).getTime() - new Date(b.dateFile).getTime()
        );
        setRecords(sorted);
      } catch (e) {
        setError("Failed to load records");
      } finally {
        setIsLoading(false);
      }
    }
    run();
  }, []);

  useEffect(() => {
    if (!records.length || !typeData) return;

    async function fetchPrediction() {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch("/api/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            records,
            metric: typeData,
            horizon,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Prediction failed");
        setPredictions(data.predictions || []);
        setReasoning(data.reasoning || "");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to generate prediction");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPrediction();
  }, [records, typeData, horizon]);

  if (!records.length) {
    return (
      <div className="h-[50vh] w-full bg-white p-6 rounded-xl flex items-center justify-center text-sm text-gray-500">
        No records yet. Upload a result to see a prediction.
      </div>
    );
  }

  if (!typeData) {
    return (
      <div className="h-[50vh] w-full bg-white p-6 rounded-xl flex items-center justify-center text-sm text-gray-500">
        Select a metric to predict its trend.
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[50vh] w-full bg-white p-6 rounded-xl flex items-center justify-center text-sm text-red-500">
        {error}
      </div>
    );
  }

  if (isLoading || !predictions.length) {
    return (
      <div className="h-[50vh] w-full bg-white p-6 rounded-xl flex flex-col items-center justify-center text-sm text-gray-500 gap-2">
        <div className="animate-spin"><Sparkles size={20} /></div>
        Generating AI prediction…
      </div>
    );
  }

  const key = METRIC_KEY[typeData];
  const values = records
    .map((r) => {
      const v = r[key];
      if (v === null || v === undefined) return NaN;
      const s = String(v);
      const bp = s.match(/(\d{2,3})\s*\/\s*(\d{2,3})/);
      if (bp) return Number(bp[1]);
      const m = s.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
      return m ? Number(m[0]) : NaN;
    })
    .filter((v) => !Number.isNaN(v));

  if (values.length < 2) {
    return (
      <div className="h-[50vh] w-full bg-white p-6 rounded-xl flex items-center justify-center text-sm text-gray-500">
        Need at least 2 records of "{typeData}" to predict.
      </div>
    );
  }

  const years = records.map((r) => new Date(r.dateFile).getFullYear());
  const allYears = [...new Set([...years, ...predictions.map((p) => p.year)])].sort((a, b) => a - b);
  const range = RANGES[typeData];

  const actualSeries = allYears.map((y) => {
    const idx = years.indexOf(y);
    return idx >= 0 ? values[idx] : null;
  });
  const forecastSeries = allYears.map((y) => {
    const pred = predictions.find((p) => p.year === y);
    return pred ? pred.value : null;
  });

  const data = {
    labels: allYears,
    datasets: [
      {
        label: `${typeData} (actual)`,
        data: actualSeries,
        borderColor: "rgb(0, 108, 249)",
        backgroundColor: "rgba(0, 108, 249, 0.1)",
        tension: 0.2,
        fill: true,
        pointRadius: 5,
        pointBackgroundColor: "#fff",
        pointBorderColor: "rgb(0, 108, 249)",
        pointBorderWidth: 2,
        spanGaps: false,
      },
      {
        label: "AI Forecast",
        data: forecastSeries,
        borderColor: "rgb(168, 85, 247)",
        backgroundColor: "rgba(168, 85, 247, 0.08)",
        borderWidth: 2,
        pointRadius: 5,
        pointBackgroundColor: "rgb(168, 85, 247)",
        pointBorderColor: "rgb(168, 85, 247)",
        tension: 0.2,
        fill: false,
        spanGaps: true,
      },
      ...(range?.max !== undefined
        ? [
            {
              label: "Upper or Lower Limit",
              data: allYears.map(() => range.max!),
              borderColor: "rgba(220, 38, 38, 0.4)",
              borderWidth: 2,
              borderDash: [5, 5],
              pointRadius: 0,
              fill: false,
              tension: 0,
            },
          ]
        : []),
      ...(range?.min !== undefined && range.min > 0
        ? [
            {
              label: "Lower Limit",
              
              data: allYears.map(() => range.min!),
              borderColor: "rgba(220, 38, 38, 0.4)",
              borderWidth: 2,
              borderDash: [5, 5],
              pointRadius: 0,
              fill: false,
              tension: 0,
            },
          ]
        : []),
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          filter: (legendItem: any) => legendItem.text !== "Lower Limit",
        },
      },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: false, grid: { display: false } },
      x: { grid: { display: false } },
    },
  };

  return (
    <div className="w-full">
      <div className="h-[42vh] sm:h-[55vh] w-full bg-white p-3 sm:p-4 rounded-xl">
        <Line options={options} data={data} />
      </div>

      {reasoning && (
        <div className="mt-4 rounded-xl bg-purple-50 border border-purple-200 p-4">
          <div className="flex gap-2 items-start">
            <Sparkles size={18} className="text-purple-600 mt-1 flex-shrink-0" />
            <div>
              <p className="font-semibold text-purple-900 text-sm">AI Analysis</p>
              <p className="text-sm text-purple-800 mt-1">{reasoning}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {predictions.map((p) => {
          const outOfRange =
            (range?.max !== undefined && p.value > range.max) ||
            (range?.min !== undefined && p.value < range.min);
          return (
            <div
              key={p.year}
              className={`rounded-xl p-4 border ${
                outOfRange
                  ? "bg-red-50 border-red-200"
                  : "bg-white border-slate-200"
              }`}
            >
              <p className="text-xs text-slate-500">Predicted {p.year}</p>
              <p className="text-lg font-semibold">
                {p.value.toFixed(2)}
                {outOfRange && (
                  <span className="ml-2 text-xs text-red-600 font-medium">
                    at risk
                  </span>
                )}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
