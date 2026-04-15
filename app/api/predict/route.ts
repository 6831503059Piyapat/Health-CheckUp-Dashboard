import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { records, metric, horizon } = await req.json();

    if (!records || records.length < 2) {
      return NextResponse.json(
        { error: "Need at least 2 records to predict" },
        { status: 400 }
      );
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

    const key = METRIC_KEY[metric];
    if (!key) {
      return NextResponse.json(
        { error: "Unknown metric" },
        { status: 400 }
      );
    }

    // Parse numeric value from string (handles blood pressure "120/80")
    function parseValue(v: any) {
      if (v === null || v === undefined) return NaN;
      const s = String(v);
      const bp = s.match(/(\d{2,3})\s*\/\s*(\d{2,3})/);
      if (bp) return Number(bp[1]);
      const m = s.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
      return m ? Number(m[0]) : NaN;
    }

    // Extract data points
    const points = records
      .map((r: any) => ({
        date: r.dateFile,
        value: parseValue(r[key]),
      }))
      .filter((p: any) => !Number.isNaN(p.value));

    if (points.length < 2) {
      return NextResponse.json(
        { error: `Not enough ${metric} records` },
        { status: 400 }
      );
    }

    const values = points.map((p: any) => p.value);
    const dates = points.map((p: any) => p.date);
    const latestYear = new Date(dates[dates.length - 1]).getFullYear();

    // Build prompt for Gemini
    const prompt = `You are a health data analyst. Given the following historical health metric data, predict the next ${horizon} year(s) of values.

Metric: ${metric}
Historical data (date, value): ${points.map((p: any) => `${p.date}: ${p.value}`).join(", ")}
Current trend: ${values[values.length - 1]} (latest)
Average: ${(values.reduce((a: number, b: number) => a + b) / values.length).toFixed(2)}

Predict the next ${horizon} ${horizon === 1 ? "year" : "years"} of ${metric} values and provide:
1. Predicted values for years ${latestYear + 1} to ${latestYear + horizon}
2. Brief reasoning (trend direction, risk assessment)

Format your response as JSON:
{
  "predictions": [{ "year": YYYY, "value": NUMBER }, ...],
  "reasoning": "Your brief analysis here..."
}`;

    // Call Gemini API via backend
    const backendUrl = process.env.NEXT_PUBLIC_PORT || "http://localhost:2710";
    const res = await fetch(`${backendUrl}/ai/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      // Fallback: use simple linear regression if backend fails
      const { slope, intercept } = linearRegression(
        values.map((_, i) => i),
        values
      );
      const predictions = Array.from({ length: horizon }, (_, i) => ({
        year: latestYear + i + 1,
        value: slope * (values.length + i) + intercept,
      }));
      return NextResponse.json({
        predictions,
        reasoning: `Linear trend: ${slope > 0 ? "rising" : slope < 0 ? "falling" : "stable"} (slope: ${slope.toFixed(3)}/record)`,
        source: "fallback_regression",
      });
    }

    const aiResponse = await res.json();
    return NextResponse.json(aiResponse);
  } catch (error) {
    console.error("Predict error:", error);
    return NextResponse.json(
      { error: "Failed to generate prediction" },
      { status: 500 }
    );
  }
}

function linearRegression(xs: number[], ys: number[]) {
  const n = xs.length;
  if (n === 0) return { slope: 0, intercept: 0 };
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - meanX) * (ys[i] - meanY);
    den += (xs[i] - meanX) ** 2;
  }
  const slope = den === 0 ? 0 : num / den;
  const intercept = meanY - slope * meanX;
  return { slope, intercept };
}
