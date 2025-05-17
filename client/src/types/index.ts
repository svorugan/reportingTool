export interface Report {
    id: number;
    name: string;
    description: string;
    category: string;
    createdAt: string;
    lastRun?: string;
    status?: 'active' | 'draft' | 'archived';
}

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface ReportExecution {
    id: number;
    reportId: number;
    startTime: string;
    endTime?: string;
    status: 'success' | 'failed' | 'running';
    parameters?: Record<string, any>;
    rowCount?: number;
}
