export interface Report {
  id: string;
  name: string;
  description: string;
  category: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
  lastRun?: string;
  schedule?: string;
  tags: string[];
  status: 'active' | 'draft' | 'archived';
  permissions: {
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canSchedule: boolean;
  };
}
