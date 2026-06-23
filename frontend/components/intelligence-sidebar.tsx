"use client";

import { Download, ExternalLink, FileJson, Landmark, Radio, Search, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import type { DashboardData } from "@/lib/types";
import { sampleDownloadUrls } from "@/lib/api";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Select } from "./ui/select";

interface Props {
  data: DashboardData;
  filters: { hospital: string; department: string; month: string };
  onFilter: (key: "hospital" | "department" | "month", value: string) => void;
  isFallback: boolean;
  loading: boolean;
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="mb-2 text-[0.625rem] font-semibold uppercase tracking-[.18em] text-slate-300">{children}</div>;
}

export function IntelligenceSidebar({ data, filters, onFilter, isFallback, loading }: Props) {
  const [search, setSearch] = useState("");
  const searchResults = useMemo(
      () => search.trim().length < 2 ? [] : data.filters.hospitals.filter((hospital) => hospital !== "All Hospitals" && hospital.toLowerCase().includes(search.toLowerCase())),
      [data.filters.hospitals, search],
  );

  const download = (format: "csv" | "json") => {
    if (isFallback) {
      const link = document.createElement("a");
      if (format === "json") {
        link.href = "/mock_data.json";
        link.download = "patient_experience_synthetic.json";
      } else {
        const header = "SYNTHETIC DATA - NOT REAL\ndomain,score_pct,benchmark_pct,delta_pct\n";
        const rows = data.domain_scores.map((item) => `${item.domain},${item.score},${item.benchmark},${item.delta}`).join("\n");
        link.href = URL.createObjectURL(new Blob([header + rows], { type: "text/csv" }));
        link.download = "patient_experience_synthetic.csv";
      }
      link.click();
      return;
    }
    window.location.href = sampleDownloadUrls[format];
  };
  return (
    <aside className="scrollbar flex h-screen flex-col overflow-y-auto border-l border-stroke bg-[#060b11]/95 px-5 py-6 lg:w-[30%] lg:min-w-[340px]">
      <section className="border-b border-stroke pb-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[0.625rem] font-semibold uppercase tracking-[.2em] text-rail"><Radio size={15} className="animate-pulse" /> Rail 30 / Live</div>
          <span className={`rounded-full border px-2 py-1 text-[0.5625rem] uppercase tracking-wider ${isFallback ? "border-amber-500/30 text-amber-400" : "border-emerald-500/30 text-emerald-400"}`}>{isFallback ? "Mock fallback" : "API connected"}</span>
        </div>
        <p className="mb-2 text-sm text-indigo">{data.sidebar.rail_category}</p>
        <h1 className="text-2xl font-semibold leading-tight text-white">{data.sidebar.title}</h1>
        <div className="mt-5 flex items-end justify-between rounded-lg border border-rail/25 bg-rail/[.055] p-4 shadow-pulse">
          <div><Label>{data.sidebar.headline_metric.label}</Label><div className="text-5xl font-semibold tabular-nums text-white">{data.sidebar.headline_metric.value}</div></div>
          <span className="text-sm font-medium text-rail">{data.sidebar.headline_metric.detail}</span>
        </div>
      </section>

      <section className="border-b border-stroke py-5">
        <Label>Why this matters</Label>
        <div className="flex gap-3"><ShieldCheck size={20} className="mt-0.5 shrink-0 text-rail" /><p className="text-sm leading-6 text-slate-200">{data.sidebar.why_this_matters}</p></div>
      </section>
      <section className="border-b border-stroke py-5">
        <Label>Who controls the rail</Label>
        <div className="flex gap-3"><Landmark size={20} className="mt-0.5 shrink-0 text-indigo" /><p className="text-sm leading-6 text-slate-200">{data.sidebar.who_controls}</p></div>
      </section>

      <section className="space-y-3 border-b border-stroke py-5">
        <div className="flex items-center justify-between"><Label>Functional filters</Label>{loading && <span className="text-[0.5625rem] text-rail">REFRESHING</span>}</div>
        <div className="relative">
          <Search size={15} className="pointer-events-none absolute left-3 top-3.5 text-slate-400" />
          <input aria-label="Search hospitals" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search hospitals..." className="h-11 w-full rounded-lg border border-stroke bg-[#070d13] pl-9 pr-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-400 focus:border-rail focus:shadow-pulse" />
          {searchResults.length > 0 && <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-stroke bg-[#070d13] shadow-xl">{searchResults.map((hospital) => <button key={hospital} className="block w-full px-3 py-2 text-left text-sm text-slate-200 hover:bg-rail/10 hover:text-rail" onClick={() => { onFilter("hospital", hospital); setSearch(""); }}>{hospital}</button>)}</div>}
        </div>
        <Select aria-label="Hospital" value={filters.hospital} onChange={(event) => onFilter("hospital", event.target.value)}>{data.filters.hospitals.map((value) => <option key={value}>{value}</option>)}</Select>
        <Select aria-label="Department" value={filters.department} onChange={(event) => onFilter("department", event.target.value)}>{data.filters.departments.map((value) => <option key={value}>{value}</option>)}</Select>
        <Select aria-label="Month" value={filters.month} onChange={(event) => onFilter("month", event.target.value)}>{data.filters.months.map((value) => <option key={value}>{value}</option>)}</Select>
      </section>

      <section className="border-b border-stroke py-5">
        <Label>Source quality</Label>
        <div className="space-y-2">{data.sidebar.sources.map((source) => <a key={source.name} href={source.url} target="_blank" rel="noreferrer" className="block rounded-lg border border-stroke bg-surface p-3 transition hover:border-rail/50"><div className="flex items-start justify-between gap-2"><span className="text-[0.6875rem] font-medium text-white">{source.name}</span><ExternalLink size={13} className="shrink-0 text-slate-400" /></div><div className="mt-2 flex items-center justify-between text-[0.5625rem] text-slate-300"><span>{source.authority} / {source.quality}</span><span>Refreshed {source.last_refreshed}</span></div><div className="mt-1 text-[0.5625rem] text-slate-400">Cadence: {source.refresh_cadence}</div></a>)}</div>
      </section>

      <section className="py-5">
        <Label>Signal brief</Label>
        <div className="space-y-2">{data.insights.map((insight, index) => <Card key={insight} className="flex gap-3 p-3"><span className="font-mono text-sm text-rail">0{index + 1}</span><p className="text-[0.6875rem] leading-5 text-slate-200">{insight}</p></Card>)}</div>
      </section>
      <div className="mt-auto grid grid-cols-2 gap-2 pt-2"><Button onClick={() => download("csv")}><Download size={16} /> CSV</Button><Button onClick={() => download("json")}><FileJson size={16} /> JSON</Button></div>
      <p className="mt-3 text-center text-[0.5625rem] text-slate-400">Synthetic HCAHPS-style demo data. No PHI.</p>
    </aside>
  );
}
