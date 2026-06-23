export type Direction = "up" | "down" | "neutral";
export interface Metric { label: string; value: string; detail: string; direction: Direction }
export interface DomainScore { domain: string; score: number; benchmark: number; delta: number }
export interface TrendPoint { month: string; department: string; score: number; benchmark: number }
export interface NpsCohort { cohort: string; promoters: number; passives: number; detractors: number; nps: number }
export interface CorrelationPoint { hospital: string; satisfaction: number; readmission_rate: number; quartile: string }
export interface HeatmapCell { department: string; month: string; score: number; status: "above" | "watch" | "priority" }
export interface SourceQuality { name: string; url: string; authority: string; quality: string; refresh_cadence: string; last_refreshed: string }
export interface DashboardData {
  generated_at: string;
  selected_hospital: string;
  selected_department: string;
  selected_month: string;
  filters: { hospitals: string[]; departments: string[]; months: string[] };
  sidebar: {
    title: string;
    rail_category: string;
    headline_metric: Metric;
    why_this_matters: string;
    who_controls: string;
    sources: SourceQuality[];
  };
  metrics: Metric[];
  domain_scores: DomainScore[];
  trends: TrendPoint[];
  nps_cohorts: NpsCohort[];
  correlations: CorrelationPoint[];
  responsiveness: HeatmapCell[];
  insights: string[];
}
