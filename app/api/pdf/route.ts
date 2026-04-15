export const runtime = "nodejs";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import { parseISO,format } from "date-fns";
export async function POST(req:Request) {
   const data = await req.json();
  try {
    const isDev = process.env.NODE_ENV === "development";
const browser = await puppeteer.launch({
  args: isDev ? [] : chromium.args,
  executablePath: isDev
    ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    : await chromium.executablePath(),
  headless: true,
});


   

    const page = await browser.newPage();
function formatDate(d: any) {
      if (!d) return 'N/A';
      try {
        const dt = typeof d === 'string' ? parseISO(d) : (d instanceof Date ? d : new Date(d));
        return format(dt, 'dd MMM yyyy');
      } catch (e) {
        return String(d);
      }
    }
    await page.setContent( `
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      background: #fff;
    }

    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 20mm;
      margin: auto;
      box-sizing: border-box;
    }

    .header {
      border-bottom: 3px solid #f4c542;
      margin-bottom: 10px;
      padding-bottom: 10px;
      justify-content: space-between;
      display:flex;
    }

    .header h1 {
      margin: 0;
      color: #1f4e79;
    }

    .info {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      margin-bottom: 15px;
    }

    .info div {
      width: 48%;
    }

    .section-title {
      text-align: center;
      font-weight: bold;
      margin: 10px 0 10px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }

    th, td {
      border: 1px solid #ccc;
      padding: 6px;
    }

    th {
      background: #f2f2f2;
    }

    .subsection {
      background: #eee;
      font-weight: bold;
    }
    .LifeMarkersText{
      color:#0062ff;
    }
    .footer {
      margin-top: 20px;
      font-size: 12px;
      color: #ff0000;
      border-top: 1px solid #ccc;
      padding-top: 10px;
    }
  </style>
</head>

<body>
<div class="page">

  <!-- HEADER -->
  <div class="header">
    <h1>Health Checkup Report</h1>
    <p class="LifeMarkersText">LIFEMARKERS</p>
  </div>

  <!-- PATIENT INFO -->
  <div class="info">
    <div>
      <p><b>Name:</b> ${data.fullName || "-"}</p>
      <p><b>Age:</b> ${data.age || "-"}</p>
      <p><b>Gender:</b> ${data.gender || "-"}</p>
      <p><b>Doctor:</b> ${data.provide || "-"}</p>
    </div>

    <div>
      <p><b>Date Lab:</b> ${formatDate(data.dateFile) || "-"}</p>
      <p><b>Date File:</b> ${formatDate(new Date().toISOString().split('T')[0]) || "-"}</p>
       <div class="footer">
       *If results are abnormal, please consult your doctor.
       </div>

    </div>
  </div>

  <div class="section-title">Test Report</div>

  <table>
    <tr>
      <th>Test Name</th>
      <th>Result</th>
      <th>Units</th>
      <th>Reference</th>
    </tr>

    <!-- VITALS -->
    <tr class="subsection"><td colspan="4">Vitals</td></tr>
    <tr><td>Blood Pressure</td><td>${data.bloodPressure || "-"}</td><td>mmHg</td><td>120/80</td></tr>
    <tr><td>Heart Rate</td><td>${data.heartRate || "-"}</td><td>bpm</td><td>60-100</td></tr>
    <tr><td>Respiratory Rate</td><td>${data.respiratoryRate || "-"}</td><td>breaths/min</td><td>12-20</td></tr>
    <tr><td>Temperature</td><td>${data.temperature || "-"}</td><td>°C</td><td>36.5-37.5</td></tr>
    <tr><td>SpO2</td><td>${data.spo2 || "-"}</td><td>%</td><td>>95</td></tr>
    <tr><td>BMI</td><td>${data.bmi || "-"}</td><td>kg/m²</td><td>18.5-24.9</td></tr>
    <tr><td>FBS</td><td>${data.fbs || "-"}</td><td>mg/dL</td><td>70-99</td></tr>
    <tr><td>HbA1c</td><td>${data.hba1c || "-"}</td><td>%</td><td><5.7</td></tr>
    <tr><td>Total Cholesterol</td><td>${data.cholesterol || "-"}</td><td>mg/dL</td><td><200</td></tr>
    <tr><td>HDL</td><td>${data.hdl || "-"}</td><td>mg/dL</td><td>>40</td></tr>
    <tr><td>LDL</td><td>${data.ldl || "-"}</td><td>mg/dL</td><td><100</td></tr>
    <tr><td>Triglycerides</td><td>${data.triglycerides || "-"}</td><td>mg/dL</td><td><150</td></tr>
    <tr><td>ALT (SGPT)</td><td>${data.sgpt || "-"}</td><td>U/L</td><td><40</td></tr>
    <tr><td>AST (SGOT)</td><td>${data.sgot || "-"}</td><td>U/L</td><td><40</td></tr>
    <tr><td>ALP</td><td>${data.alp || "-"}</td><td>U/L</td><td>30-120</td></tr>
    <tr><td>GGT</td><td>${data.ggt || "-"}</td><td>U/L</td><td><55</td></tr>
    <tr><td>Total Bilirubin</td><td>${data.total_bilirubin || "-"}</td><td>mg/dL</td><td>0.2-1.2</td></tr>
    <tr><td>Direct Bilirubin</td><td>${data.direct_bilirubin || "-"}</td><td>mg/dL</td><td><0.3</td></tr>
    <tr><td>Creatinine</td><td>${data.creatinine || "-"}</td><td>mg/dL</td><td>0.5-1.2</td></tr>
    <tr><td>Hemoglobin</td><td>${data.hemoglobin || "-"}</td><td>g/dL</td><td>13-17</td></tr>
    <tr><td>WBC</td><td>${data.wbc || "-"}</td><td>cells/uL</td><td>4000-11000</td></tr>
    <tr><td>RBC</td><td>${data.rbc || "-"}</td><td>cells/uL</td><td>4.5-5.9 M</td></tr>
    <tr><td>Platelet</td><td>${data.platelets || "-"}</td><td>cells/uL</td><td>150000-450000</td></tr>
    <tr><td>Hematocrit</td><td>${data.hematocrit || "-"}</td><td>%</td><td>40-50</td></tr>
    <tr><td>MCV</td><td>${data.mcv || "-"}</td><td>fL</td><td>80-100</td></tr>
    <tr><td>Albumin</td><td>${data.albumin || "-"}</td><td>g/dL</td><td>3.5-5.0</td></tr>

  </table>

 
</div>
</body>
</html>
    
    `);

    const pdfBuffer = await page.pdf({
      format: "A4",
    });

    await browser.close();
const buffer = Buffer.from(pdfBuffer);
    return new Response(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=test.pdf",
      },
    });
  } catch (error) {
    console.error("PDF ERROR:", error);
    return new Response("Failed to generate PDF", { status: 500 });
  }
}






