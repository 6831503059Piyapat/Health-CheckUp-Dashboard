# LifeMarkers

LifeMarkers is a comprehensive health-tracking platform designed to transform static medical reports into actionable insights. Using AI-driven data extraction and predictive modeling, LifeMarkers empowers users to monitor their biometrics, understand health trends, and visualize future wellness trajectories.

## Table of Contents

- Preview
- Features
- Tech Stack
- Project Structure
- Installation
- Run Server
- Environment Variables

## Preview

Live Demo: https://health-check-up-dashboard.vercel.app

## Features

- User Authentication
- Dashboard Analytics
- Responsive Design
- Trendline Prediction
- History upload
- Upload File
- API Integration

---

## Tech Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- Heroui

### Backend
- Node.js
- NestJS / Express.js

### Database

- MongoDB

### Deployment

- Vercel
- Render

---

## Project Structure

```bash
frontend/
|-- .env
|-- .gitignore
|-- README.md
|-- app/
|   |-- api/
|   |   |-- predict/
|   |   |   `-- route.ts
|   |   `-- send-email/
|   |       `-- route.ts
|   |-- auth/
|   |   |-- components/
|   |   |   `-- AuthNavbar.tsx
|   |   |-- forgot-password/
|   |   |   `-- page.tsx
|   |   |-- login/
|   |   |   |-- components/
|   |   |   |   `-- pendingState.tsx
|   |   |   `-- page.tsx
|   |   `-- register/
|   |       |-- components/
|   |       |   |-- Checkpassword.tsx
|   |       |   `-- pendingCreate.tsx
|   |       `-- page.tsx
|   |-- calendar/
|   |   `-- page.tsx
|   |-- components/
|   |   |-- Appointment.tsx
|   |   |-- ChartLadingPre.tsx
|   |   |-- ChartLanding.tsx
|   |   |-- FilterSelect.tsx
|   |   |-- HealthcareRec.tsx
|   |   |-- LocalNavbar.tsx
|   |   |-- Navbar.tsx
|   |   |-- NavItem.tsx
|   |   |-- PaginationBtn.tsx
|   |   `-- Pathname.tsx
|   |-- dashboard/
|   |   |-- components/
|   |   |   |-- CardStatus.tsx
|   |   |   |-- ChartDashboard.tsx
|   |   |   |-- dropDown.tsx
|   |   |   `-- Result.tsx
|   |   `-- page.tsx
|   |-- history/
|   |   |-- components/
|   |   |   |-- ComparisonBar.tsx
|   |   |   `-- historyitem.tsx
|   |   `-- page.tsx
|   |-- predict/
|   |   |-- components/
|   |   |   `-- PredictChart.tsx
|   |   `-- page.tsx
|   |-- profile/
|   |   `-- page.tsx
|   |-- upload/
|   |   `-- page.tsx
|   |-- favicon.ico
|   |-- globals.css
|   |-- layout.tsx
|   |-- not-found.tsx
|   `-- page.tsx
|-- eslint.config.mjs
|-- lib/
|-- next-env.d.ts
|-- next.config.ts
|-- package-lock.json
|-- package.json
|-- patientDATA.json
|-- postcss.config.mjs
|-- public/
|   |-- file.svg
|   |-- globe.svg
|   |-- GpahFloat.png
|   |-- Graph.png
|   |-- LifeMaker.png
|   |-- LifeMarkerLogo.png
|   |-- next.svg
|   |-- Upload.png
|   |-- vercel.svg
|   `-- window.svg
`-- tsconfig.json

```

## Installation

```bash
git clone https://github.com/PiyapatCode/LifeMarkers.git
cd LifeMarkers
```

## Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

## Run Server

```bash
npm run dev
```

## Open Browser

http://localhost:3000

## Environment Variables

```bash
NEXT_PUBLIC_PORT =http://localhost:2710
```