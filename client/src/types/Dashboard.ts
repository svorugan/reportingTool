export type DomainType = 'HR' | 'Finance' | 'Operations' | 'Sales' | 'Marketing';

export interface DashboardMetric {
  id: string;
  name: string;
  value: number | string;
  trend?: number;
  unit?: string;
  comparison?: {
    value: number;
    period: string;
  };
}

export interface DashboardChart {
  id: string;
  type: 'line' | 'bar' | 'pie' | 'area';
  title: string;
  data: any[];
  config: {
    xAxis?: string;
    yAxis?: string;
    series: string[];
  };
}

export interface DomainDashboard {
  domain: DomainType;
  metrics: DashboardMetric[];
  charts: DashboardChart[];
  reports: string[]; // References to related reports
  lastUpdated: string;
}
