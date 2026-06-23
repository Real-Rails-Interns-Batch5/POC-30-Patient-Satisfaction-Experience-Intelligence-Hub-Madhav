"use client";

import { useEffect, useState } from "react";
import { Activity, ArrowDownRight, ArrowUpRight, Minus, Sparkles } from "lucide-react";
import fallback from "@/public/mock_data.json";
import { getDashboard } from "@/lib/api";
import type { DashboardData, Metric } from "@/lib/types";
import { CorrelationScatter, DomainRadar, NpsWaterfall, ResponsivenessHeatmap, SatisfactionTrend } from "./charts";
import { IntelligenceSidebar } from "./intelligence-sidebar";
import { Card } from "./ui/card";

const initial = fallback as DashboardData;
const initialFilters = { hospital: "All Hospitals", department: "All Departments", month: "All Months" };

function MetricCard({ metric }: { metric: Metric }) {
  const Icon = metric.direction === "up" ? ArrowUpRight : metric.direction === "down" ? ArrowDownRight : Minus;
  const tone = metric.direction === "down" ? "text-amber-400" : metric.direction === "up" ? "text-rail" : "text-slate-400";
  return <Card className="min-w-0 p-4"><div className="flex items-center justify-between text-[0.625rem] uppercase tracking-[.14em] text-slate-300"><span>{metric.label}</span><Icon size={16} className={tone} /></div><div className="mt-3 text-3xl font-semibold tabular-nums text-white">{metric.value}</div><p className="mt-1 truncate text-[0.625rem] text-slate-400">{metric.detail}</p></Card>;
}

function ChartCard({ title, eyebrow, children, className = "" }: { title: string; eyebrow: string; children: React.ReactNode; className?: string }) {
  return <Card className={`min-h-0 p-4 ${className}`}><div className="mb-2 flex items-center justify-between"><div><p className="text-[0.5625rem] font-semibold uppercase tracking-[.17em] text-rail">{eyebrow}</p><h2 className="mt-1 text-base font-medium text-slate-100">{title}</h2></div><Activity size={16} className="text-slate-400" /></div><div className="h-[calc(100%-42px)] min-h-[180px]">{children}</div></Card>;
}

function SignalLegend() {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-lg border border-stroke bg-surface/70 px-4 py-2 text-[0.625rem] text-slate-200" aria-label="Chart legend">
      <span className="font-semibold uppercase tracking-[.15em] text-slate-300">Legend</span>
      <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-rail" />Current score</span>
      <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-indigo" />Benchmark / comparison</span>
      <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-amber-500" />Watch</span>
      <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-red-800" />Priority</span>
    </div>
  );
}

export function Dashboard() {
  const [data, setData] = useState<DashboardData>(initial);
  const [filters, setFilters] = useState(initialFilters);
  const [isFallback, setFallback] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    getDashboard(filters, controller.signal).then((result) => { setData(result.data); setFallback(result.isFallback); setLoading(false); }).catch(() => setLoading(false));
    return () => controller.abort();
  }, [filters]);

  const onFilter = (key: keyof typeof filters, value: string) => setFilters((current) => ({ ...current, [key]: value }));
  return (
    <main className="flex min-h-screen flex-col bg-obsidian lg:h-screen lg:flex-row lg:overflow-hidden">
      <section className="terminal-grid scrollbar flex min-h-screen flex-col overflow-y-auto px-5 py-5 lg:h-screen lg:w-[70%] lg:min-w-0 lg:px-6">
        <header className="mb-4 flex items-center justify-between">
          <div><div className="flex items-center gap-2 text-[0.625rem] font-semibold uppercase tracking-[.2em] text-slate-300"><Sparkles size={14} className="text-rail" /> Experience signal room</div><h2 className="mt-1 text-xl font-medium text-white">Operational experience telemetry</h2></div>
          <div className="hidden items-center gap-2 text-[0.625rem] text-slate-300 sm:flex"><span className={`h-1.5 w-1.5 rounded-full ${loading ? "animate-pulse bg-amber-400" : "bg-emerald-400"}`} />{loading ? "Synchronizing" : "Signals current"}</div>
        </header>
        <div className="mb-4 grid grid-cols-2 gap-3 xl:grid-cols-4">{data.metrics.map((metric) => <MetricCard key={metric.label} metric={metric} />)}</div>
        <SignalLegend />
        <div className="grid flex-none auto-rows-[28rem] grid-cols-1 gap-4">
          <ChartCard eyebrow="HCAHPS domains" title={`Benchmark profile - ${data.selected_hospital}`}><DomainRadar data={data.domain_scores} /></ChartCard>
          <ChartCard eyebrow="Department signal" title="Satisfaction trend"><SatisfactionTrend data={data.trends} /></ChartCard>
          <ChartCard eyebrow="Cohort loyalty" title="NPS cohort waterfall"><NpsWaterfall data={data.nps_cohorts} /></ChartCard>
          <ChartCard eyebrow="Outcome linkage" title="Satisfaction vs readmission"><CorrelationScatter data={data.correlations} /></ChartCard>
          <ChartCard eyebrow="Service friction" title="Staff responsiveness heatmap"><ResponsivenessHeatmap data={data.responsiveness} /></ChartCard>
        </div>
      </section>
      <IntelligenceSidebar data={data} filters={filters} onFilter={onFilter} isFallback={isFallback} loading={loading} />
    </main>
  );
}
