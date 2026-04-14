import puppeteer from "puppeteer";

export async function POST(request: Request) {
    const { data } = await request.json();
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // HTML to convert to PDF
    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial; padding: 20px; }
            h1 { color: #2563eb; }
            .card { border: 1px solid #ddd; padding: 16px; margin-top: 10px; border-radius: 8px; }
          </style>
        </head>
        <body>
          <h1>Report Health Checkup Summary </h1>
          <div class="card">
            <p>Name: ${data.fullName}</p>
            <p>Age: ${data.age}</p>
          </div>
        </body>
      </html>
    `;

    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

    await browser.close();

    const uint8 = new Uint8Array(pdfBuffer);
    return new Response(uint8, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=report.pdf',
        'Content-Length': String(uint8.byteLength),
      },
    });
  } catch (err: any) {
    // Return JSON error to avoid crashing the serverless function
    const msg = err?.message || String(err);
    return new Response(JSON.stringify({ error: 'Failed to generate PDF', message: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
