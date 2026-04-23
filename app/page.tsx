'use client'
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  Check,
  ChevronDown,
  FileUp,
  HeartPulse,
  LineChart,
  Lock,
  Quote,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Star,
  Users,
  Zap,
} from "lucide-react";
import ChartLanding from "./components/ChartLanding";
import ChartLandingPre from "./components/ChartLadingPre";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export default function Home() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <main className="bg-white min-h-screen text-slate-900 overflow-x-hidden">
      {/* Background decorations */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-[520px] w-[520px] rounded-full bg-cyan-200/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-[360px] w-[360px] rounded-full bg-indigo-200/30 blur-3xl" />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 lg:px-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/30">
              <HeartPulse className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[20px] font-bold tracking-tight text-blue-800">
              LifeMarkers
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-slate-600 transition hover:text-slate-900">Features</a>
            <a href="#how" className="text-sm text-slate-600 transition hover:text-slate-900">How it works</a>
            <a href="#pricing" className="text-sm text-slate-600 transition hover:text-slate-900">Pricing</a>
            <a href="#faq" className="text-sm text-slate-600 transition hover:text-slate-900">FAQ</a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/auth/login")}
              className="hidden cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 sm:inline-flex"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/auth/register")}
              className="group inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 px-4 py-2 text-sm font-medium text-white shadow-md shadow-blue-600/25 transition hover:shadow-lg hover:shadow-blue-600/40"
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-6 pt-16 pb-20 lg:px-10 lg:pt-24 lg:pb-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.div
              variants={fadeUp}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700"
            >
              <Sparkles className="h-3.5 w-3.5" />
              AI-powered health intelligence
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
            >
              Your clinical data,{" "}
              <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 bg-clip-text text-transparent">
                beautifully mastered
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-5 max-w-xl text-lg text-slate-600">
              Transform complex health records into clear, actionable insights. Upload a lab
              report and LifeMarkers decodes trends, predicts risks, and guides your next step.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => router.push("/auth/register")}
                className="group inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-blue-600/30 transition hover:shadow-2xl hover:shadow-blue-600/40"
              >
                Start Free Trial
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                See Sample Report
              </button>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-8 flex items-center gap-6 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                HIPAA-ready
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-emerald-600" />
                End-to-end encrypted
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-emerald-600" />
                Results in seconds
              </div>
            </motion.div>
          </motion.div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-blue-500/20 via-cyan-400/20 to-transparent blur-2xl" />

            <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-2xl shadow-blue-900/10 backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
                <span className="text-xs font-medium text-slate-400">health-score.app</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-slate-100 bg-white p-3">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Health Score</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    82<span className="text-sm font-medium text-slate-400">/100</span>
                  </p>
                  <p className="mt-1 text-xs font-medium text-emerald-600">+6 this month</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-white p-3">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Glucose</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    94<span className="text-sm font-medium text-slate-400"> mg/dL</span>
                  </p>
                  <p className="mt-1 text-xs font-medium text-blue-600">Normal range</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-white p-3">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">BP</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    118<span className="text-sm font-medium text-slate-400">/76</span>
                  </p>
                  <p className="mt-1 text-xs font-medium text-emerald-600">Optimal</p>
                </div>
              </div>

              <div className="mt-3 h-56 rounded-xl border border-slate-100 bg-white p-2">
                <ChartLanding />
              </div>
            </div>

            {/* Floating cards */}
            <motion.div
              initial={{ opacity: 0, x: -20, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute -left-6 bottom-10 hidden rounded-2xl border border-slate-100 bg-white p-3 shadow-xl shadow-slate-900/10 sm:block"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50">
                  <Activity className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Risk detected</p>
                  <p className="text-sm font-semibold text-slate-900">Low LDL trend ✓</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute -right-4 -top-6 hidden rounded-2xl border border-slate-100 bg-white p-3 shadow-xl shadow-slate-900/10 sm:block"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50">
                  <BrainCircuit className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">AI insight</p>
                  <p className="text-sm font-semibold text-slate-900">Hydration +12%</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 border-y border-slate-100 py-8"
        >
          <p className="text-center text-xs font-medium uppercase tracking-widest text-slate-400">
            Trusted by clinicians and health-first teams
          </p>
          <div className="mt-5 grid grid-cols-2 gap-6 text-center text-sm font-semibold text-slate-400 sm:grid-cols-3 md:grid-cols-6">
            <span>MediCore</span>
            <span>NovaLabs</span>
            <span>Cardio+</span>
            <span>PulseAI</span>
            <span>Vitalix</span>
            <span>HealthOS</span>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-10">
        <div className="grid grid-cols-2 gap-4 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 sm:p-10 md:grid-cols-4">
          {[
            { k: "120k+", v: "Reports analyzed" },
            { k: "98.4%", v: "Lab-grade accuracy" },
            { k: "42", v: "Biomarkers tracked" },
            { k: "< 8s", v: "Avg. analysis time" },
          ].map((s) => (
            <div key={s.v} className="text-center">
              <p className="bg-gradient-to-br from-blue-700 to-cyan-500 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                {s.k}
              </p>
              <p className="mt-1 text-sm text-slate-500">{s.v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-600">Features</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Everything you need to understand your health
          </h2>
          <p className="mt-4 text-slate-600">
            A complete toolkit — from raw lab PDFs to beautiful, longitudinal insights.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
          className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {[
            {
              icon: FileUp,
              title: "One-click upload",
              desc: "Drop any lab report PDF or image. We extract, normalize, and structure every value automatically.",
              color: "from-blue-500 to-cyan-500",
            },
            {
              icon: LineChart,
              title: "Longitudinal trends",
              desc: "Track every biomarker over years on one timeline, with clinical reference ranges.",
              color: "from-indigo-500 to-blue-500",
            },
            {
              icon: BrainCircuit,
              title: "AI risk prediction",
              desc: "Our models flag early warning signs and predict how markers will move in 6–12 months.",
              color: "from-violet-500 to-fuchsia-500",
            },
            {
              icon: Stethoscope,
              title: "Doctor-ready exports",
              desc: "Generate a clean, shareable report your physician can review in under two minutes.",
              color: "from-emerald-500 to-teal-500",
            },
            {
              icon: ShieldCheck,
              title: "Private by design",
              desc: "Your data is encrypted in transit and at rest. You own it — export or delete anytime.",
              color: "from-amber-500 to-orange-500",
            },
            {
              icon: Users,
              title: "Family accounts",
              desc: "Monitor your parents and kids from one dashboard with role-based access.",
              color: "from-rose-500 to-pink-500",
            },
          ].map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-xl hover:shadow-slate-900/5"
            >
              <div
                className={`mb-4 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${f.color} text-white shadow-md`}
              >
                <f.icon className="h-5 w-5" strokeWidth={2.2} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.desc}</p>
              <div className="pointer-events-none absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-gradient-to-br from-blue-100/0 to-blue-100/0 transition group-hover:from-blue-100/60 group-hover:to-cyan-100/40" />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How it works */}
      <section id="how" className="relative bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-600">How it works</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              From report to insight in three steps
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Upload your reports",
                desc: "Drag in PDFs or photos of any blood work, urinalysis, or imaging summary.",
                icon: FileUp,
              },
              {
                step: "02",
                title: "AI decodes the data",
                desc: "We normalize values across labs, compare to reference ranges, and build your timeline.",
                icon: BrainCircuit,
              },
              {
                step: "03",
                title: "Act with confidence",
                desc: "Get personalized recommendations, share with your doctor, and track progress.",
                icon: Activity,
              },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-black text-slate-100">{s.step}</span>
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600">
                    <s.icon className="h-5 w-5" strokeWidth={2.2} />
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live demo band */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-600">See it live</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Predict tomorrow&apos;s health, today
            </h2>
            <p className="mt-4 text-slate-600">
              LifeMarkers projects where your biomarkers are headed — so you can intervene early,
              not react late. Solid line is historical, dashed is our AI forecast.
            </p>

            <ul className="mt-6 space-y-3">
              {[
                "Forecast biomarkers 6–12 months ahead",
                "Simulate lifestyle changes on your trajectory",
                "Share a beautiful PDF with your physician",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-5 w-5 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <span className="text-sm text-slate-700">{t}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => router.push("/predict")}
              className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Try the predictor
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-blue-200/40 to-cyan-200/40 blur-2xl" />
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest text-slate-400">Forecast</p>
                  <p className="text-lg font-bold text-slate-900">Health Score · 2023 → 2027</p>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  AI preview
                </span>
              </div>
              <div className="mt-4 h-72">
                <ChartLandingPre />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-600">Loved by users</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Why people stay with LifeMarkers
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                quote:
                  "I finally understand what my labs mean. The trend chart caught a rising A1C before my doctor did.",
                name: "Aisha M.",
                role: "Product Designer",
              },
              {
                quote:
                  "Uploading 4 years of reports took minutes. The AI summary is genuinely clinical-grade.",
                name: "Dr. Rohan P.",
                role: "General Physician",
              },
              {
                quote:
                  "The family view is a lifesaver for tracking my parents' checkups from across the country.",
                name: "Liam K.",
                role: "Software Engineer",
              },
            ].map((t, i) => (
              <motion.figure
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <Quote className="h-6 w-6 text-blue-200" />
                <blockquote className="mt-3 text-sm leading-relaxed text-slate-700">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-sm font-semibold text-white">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-600">Pricing</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Simple plans that grow with you
          </h2>
          <p className="mt-4 text-slate-600">Start free. Upgrade when you need more power.</p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            {
              name: "Starter",
              price: "$0",
              period: "forever",
              features: ["3 reports / month", "Basic trends", "PDF export", "Email support"],
              cta: "Start free",
              highlight: false,
            },
            {
              name: "Pro",
              price: "$9",
              period: "/month",
              features: [
                "Unlimited uploads",
                "AI predictions",
                "42+ biomarkers",
                "Priority support",
              ],
              cta: "Go Pro",
              highlight: true,
            },
            {
              name: "Family",
              price: "$19",
              period: "/month",
              features: [
                "Up to 5 members",
                "Shared timeline",
                "Doctor sharing links",
                "Dedicated support",
              ],
              cta: "Choose Family",
              highlight: false,
            },
          ].map((p) => (
            <div
              key={p.name}
              className={`relative flex flex-col rounded-2xl border p-8 shadow-sm transition ${
                p.highlight
                  ? "border-blue-600 bg-slate-900 text-white shadow-xl shadow-blue-900/20"
                  : "border-slate-200 bg-white text-slate-900"
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-3 py-1 text-xs font-semibold text-white shadow-md">
                  Most Popular
                </span>
              )}
              <h3 className={`text-lg font-semibold ${p.highlight ? "text-white" : "text-slate-900"}`}>
                {p.name}
              </h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{p.price}</span>
                <span className={`text-sm ${p.highlight ? "text-slate-300" : "text-slate-500"}`}>
                  {p.period}
                </span>
              </div>
              <ul className={`mt-6 space-y-3 text-sm ${p.highlight ? "text-slate-200" : "text-slate-700"}`}>
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check
                      className={`mt-0.5 h-4 w-4 ${p.highlight ? "text-cyan-300" : "text-emerald-600"}`}
                      strokeWidth={3}
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => router.push("/auth/register")}
                className={`mt-8 inline-flex cursor-pointer items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition ${
                  p.highlight
                    ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white hover:opacity-95"
                    : "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                }`}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-6 pb-24 lg:px-10">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-600">FAQ</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>

        <div className="mt-10 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
          {[
            {
              q: "Is my health data safe?",
              a: "Absolutely. All data is encrypted in transit with TLS 1.3 and at rest with AES-256. You control access and can permanently delete your data at any time.",
            },
            {
              q: "Which lab reports are supported?",
              a: "Most major labs including Quest, LabCorp, Apollo, SRL, and Thyrocare. We support PDFs, photos, and structured exports.",
            },
            {
              q: "Is LifeMarkers a replacement for my doctor?",
              a: "No — LifeMarkers helps you understand trends and prepare better questions, but medical decisions should always involve your physician.",
            },
            {
              q: "Can I cancel my subscription anytime?",
              a: "Yes. You can cancel with one click from your account settings and keep access until the end of the billing period.",
            },
          ].map((item, i) => {
            const open = openFaq === i;
            return (
              <button
                key={item.q}
                onClick={() => setOpenFaq(open ? null : i)}
                className="flex w-full cursor-pointer flex-col px-6 py-5 text-left"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-slate-900">{item.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-500 transition ${open ? "rotate-180" : ""}`}
                  />
                </div>
                <motion.div
                  initial={false}
                  animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <p className="pt-3 text-sm leading-relaxed text-slate-600">{item.a}</p>
                </motion.div>
              </button>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-10 text-center shadow-2xl shadow-blue-900/30 sm:p-16">
          <div aria-hidden className="absolute inset-0">
            <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />
          </div>
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Take control of your health story
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-blue-50">
              Join thousands turning lab reports into lifelong clarity. Your first upload is on us.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => router.push("/auth/register")}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-blue-700 shadow-lg transition hover:bg-blue-50"
              >
                Create free account
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                View live demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
          <div className="grid gap-10 md:grid-cols-4">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500">
                  <HeartPulse className="h-5 w-5 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-[20px] font-bold tracking-tight text-blue-800">LifeMarkers</span>
              </Link>
              <p className="mt-4 max-w-sm text-sm text-slate-600">
                The smartest way to understand your health history. Built for patients, loved by
                doctors.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">Product</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li><a href="#features" className="hover:text-slate-900">Features</a></li>
                <li><a href="#pricing" className="hover:text-slate-900">Pricing</a></li>
                <li><Link href="/dashboard" className="hover:text-slate-900">Dashboard</Link></li>
                <li><Link href="/predict" className="hover:text-slate-900">Predictor</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">Company</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li><a href="#faq" className="hover:text-slate-900">FAQ</a></li>
                <li><a href="#" className="hover:text-slate-900">Privacy</a></li>
                <li><a href="#" className="hover:text-slate-900">Terms</a></li>
                <li><a href="#" className="hover:text-slate-900">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-6 text-xs text-slate-500 sm:flex-row">
            <p>© {new Date().getFullYear()} LifeMarkers. All rights reserved.</p>
            <p>Made with care for healthier lives.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
