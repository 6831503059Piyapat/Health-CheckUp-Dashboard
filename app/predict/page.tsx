"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode, JwtPayload } from "jwt-decode";
import Navbar from "../components/Navbar";
import DropDown from "../dashboard/components/dropDown";
import PredictChart from "./components/PredictChart";
import AuthNavbar from "../auth/components/AuthNavbar";

const metrics = [
  "Body Mass Index",
  "Fasting blood sugar",
  "Cholesterol",
  "HDL",
  "LDL",
  "Blood pressure",
  "Triglyceride",
  "Creatinine",
  "ALT",
  "Hemoglobin",
  "White blood cell",
  "Platelet",
  "Oxygen level",
  "Heart rate",
];

export default function PredictPage() {
  const router = useRouter();
  const [typeData, setTypeData] = useState<string>("Body Mass Index");
  const [horizon, setHorizon] = useState<number>(3);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded.exp! < Date.now() / 1000) {
        localStorage.removeItem("token");
        router.push("/auth/login");
      }
    } catch {
      localStorage.removeItem("token");
      router.push("/auth/login");
    }
  }, []);

  return (
    <>
      <div className="sticky top-0 z-50">
        <AuthNavbar />
      </div>
      <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
        <Navbar />
        <main className="flex-1 md:ml-64 px-4 sm:px-6 pt-10 sm:pt-8 pb-6 sm:py-8 overflow-y-auto [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:display-none">
          <div className="min-h-screen bg-slate-50 text-gray-700">
            <h1 className="mb-5 text-3xl sm:text-[45px] ml-5 text-black">Predict</h1>

            <div className="rounded-2xl bg-blue-50/80 border border-blue-200 p-4 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end mb-6">
                <div className="w-full sm:w-auto">
                  <p className="text-xs text-slate-500 mb-1">Metric</p>
                  <DropDown
                    data={metrics}
                    type={"Body Mass Index"}
                    setData={setTypeData}
                  />
                </div>
                <div className="w-full sm:w-auto">
                  <p className="text-xs text-slate-500 mb-1">Years ahead</p>
                  <select
                    value={horizon}
                    onChange={(e) => setHorizon(Number(e.target.value))}
                    className="w-full sm:w-auto rounded-xl bg-white border border-slate-200 px-4 py-2 text-sm"
                  >
                    {[1, 2, 3, 5, 10].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "year" : "years"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <PredictChart typeData={typeData} horizon={horizon} />

              <p className="mt-4 text-xs leading-5 text-slate-500">
                Forecast uses a linear regression over your uploaded records.
                Accuracy improves with more data points and may not reflect
                lifestyle or medical changes.
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
