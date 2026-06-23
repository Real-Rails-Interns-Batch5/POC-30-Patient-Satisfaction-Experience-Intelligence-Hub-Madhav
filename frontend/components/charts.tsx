"use client";

import dynamic from "next/dynamic";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import type { DashboardData } from "@/lib/types";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });
const axis = { fill: "#cbd5e1", fontSize: 12 };
const tooltipStyle = { background: "#071019", border: "1px solid #1f2937", borderRadius: 8, color: "#e5e7eb", fontSize: 13 };

function WaterfallTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-stroke bg-surface/95 p-3 shadow-xl backdrop-blur-md">
        <p className="text-xs font-semibold text-white mb-1.5">{label}</p>
        <div className="text-[11px] text-slate-300">
          <span className="text-slate-400">NPS score: </span>
          <span className="font-semibold text-rail">{payload[0].value > 0 ? `+${payload[0].value}` : payload[0].value}</span>
        </div>
      </div>
    );
  }
  return null;
}

function ScatterTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const point = payload[0].payload;
    return (
      <div className="rounded-lg border border-stroke bg-surface/95 p-3 shadow-xl backdrop-blur-md">
        <p className="text-xs font-semibold text-white mb-1.5">{point.hospital}</p>
        <div className="space-y-0.5 text-[11px]">
          <div className="text-slate-300">
            <span className="text-slate-400">Satisfaction: </span>
            <span className="font-semibold text-rail">{point.satisfaction}%</span>
          </div>
          <div className="text-slate-300">
            <span className="text-slate-400">Readmission: </span>
            <span className="font-semibold text-indigo">{point.readmission_rate}%</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export function DomainRadar({ data }: { data: DashboardData["domain_scores"] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={data} outerRadius="70%">
        <PolarGrid stroke="#1f2937" />
        <PolarAngleAxis dataKey="domain" tick={{ ...axis, fontSize: 11 }} />
        <PolarRadiusAxis angle={30} domain={[40, 100]} tick={axis} axisLine={false} />
<Tooltip
  contentStyle={tooltipStyle}
  itemStyle={{ color: "#cbd5e1" }}
  labelStyle={{ color: "#ffffff", fontWeight: 600 }}
  formatter={(value: number, name: string) => [
    `${value.toFixed(1)}%`,
    name
  ]}
/>        <Radar name="Hospital" dataKey="score" stroke="#38BDF8" fill="#38BDF8" fillOpacity={0.24} strokeWidth={2} isAnimationActive />
        <Radar name="Benchmark" dataKey="benchmark" stroke="#818CF8" fill="#818CF8" fillOpacity={0.07} strokeDasharray="4 4" isAnimationActive />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export function SatisfactionTrend({ data }: { data: DashboardData["trends"] }) {
  const departments = Array.from(new Set(data.map((item) => item.department)));
  const colors = ["#38BDF8", "#818CF8", "#22d3ee", "#a78bfa", "#34d399"];
  const rows = Array.from(new Set(data.map((item) => item.month))).map((month) => {
    const row: Record<string, string | number> = { month: month.slice(5) };
    data.filter((item) => item.month === month).forEach((item) => { row[item.department] = item.score; });
    return row;
  });
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={rows} margin={{ top: 8, right: 10, left: -22, bottom: 0 }}>
        <CartesianGrid stroke="#16202b" vertical={false} />
        <XAxis dataKey="month" tick={axis} axisLine={false} tickLine={false} />
        <YAxis domain={[55, 90]} tick={axis} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#cbd5e1' }} labelStyle={{ color: '#ffffff', fontWeight: 600 }} />
        {departments.map((department, index) => <Line key={department} type="monotone" dataKey={department} stroke={colors[index % colors.length]} strokeWidth={2} dot={false} activeDot={{ r: 4 }} isAnimationActive />)}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function NpsWaterfall({ data }: { data: DashboardData["nps_cohorts"] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 8 }}>
        <CartesianGrid stroke="#16202b" vertical={false} />
        <XAxis dataKey="cohort" tick={{ ...axis, fontSize: 10 }} interval={0} tickFormatter={(value) => value.split(" ")[0]} axisLine={false} />
        <YAxis tick={axis} axisLine={false} />
        <Tooltip content={<WaterfallTooltip />} />
        <Bar dataKey="nps" radius={[4, 4, 0, 0]} isAnimationActive>{data.map((item) => <Cell key={item.cohort} fill={item.nps >= 35 ? "#38BDF8" : item.nps >= 25 ? "#818CF8" : "#f59e0b"} />)}</Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function CorrelationScatter({ data }: { data: DashboardData["correlations"] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 12, right: 12, left: -12, bottom: 4 }}>
        <CartesianGrid stroke="#16202b" />
        <XAxis type="number" dataKey="satisfaction" name="Satisfaction" unit="%" domain={[65, 86]} tick={axis} />
        <YAxis type="number" dataKey="readmission_rate" name="Readmission" unit="%" domain={[8, 18]} tick={axis} />
        <ZAxis range={[90, 90]} />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} content={<ScatterTooltip />} />
        <Scatter data={data} fill="#38BDF8" isAnimationActive>{data.map((item, index) => <Cell key={item.hospital} fill={["#38BDF8", "#67e8f9", "#818CF8", "#a78bfa"][index]} />)}</Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}

export function ResponsivenessHeatmap({ data }: { data: DashboardData["responsiveness"] }) {
  const months = Array.from(new Set(data.map((item) => item.month)));
  const departments = Array.from(new Set(data.map((item) => item.department)));
  const points = data.map((item) => [months.indexOf(item.month), departments.indexOf(item.department), item.score]);
  const option = {
    backgroundColor: "transparent",
    animation: true,
    animationDuration: 450,
    tooltip: { position: "top", backgroundColor: "#071019", borderColor: "#1f2937", textStyle: { color: "#e5e7eb", fontSize: 13 }, formatter: (params: { value: number[] }) => `${departments[params.value[1]]}<br/>${months[params.value[0]]}: <b>${params.value[2].toFixed(1)}%</b>` },
    grid: { left: 72, right: 20, top: 8, bottom: 32 },
    xAxis: { type: "category", data: months.map((month) => month.slice(5)), splitArea: { show: true }, axisLabel: { color: "#cbd5e1", fontSize: 11 }, axisLine: { lineStyle: { color: "#1f2937" } } },
    yAxis: { type: "category", data: departments, splitArea: { show: true }, axisLabel: { color: "#cbd5e1", fontSize: 11 }, axisLine: { lineStyle: { color: "#1f2937" } } },
    visualMap: { min: 60, max: 82, calculable: false, orient: "horizontal", left: "center", bottom: -5, show: false, inRange: { color: ["#7f1d1d", "#b45309", "#164e63", "#38BDF8"] } },
    series: [{ type: "heatmap", data: points, label: { show: true, color: "#e5e7eb", fontSize: 11, formatter: (params: { value: number[] }) => params.value[2].toFixed(0) }, emphasis: { itemStyle: { shadowBlur: 10, shadowColor: "rgba(56,189,248,.45)" } } }],
  };
  return <ReactECharts option={option} style={{ height: "100%", width: "100%" }} notMerge />;
}
