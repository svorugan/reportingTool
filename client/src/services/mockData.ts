import { Report } from '../types/Report';

// Generate mock reports
export const generateMockReports = (count: number): Report[] => {
  const categories = ['Finance', 'HR', 'Operations', 'Sales', 'Marketing'];
  const owners = ['John Doe', 'Jane Smith', 'Bob Wilson', 'Alice Brown'];
  const statuses: Array<'active' | 'draft' | 'archived'> = ['active', 'draft', 'archived'];
  const tags = ['Monthly', 'Weekly', 'Daily', 'KPI', 'Executive', 'Department', 'Summary'];

  return Array.from({ length: count }, (_, i) => ({
    id: `report-${i + 1}`,
    name: `Report ${i + 1} - ${categories[Math.floor(Math.random() * categories.length)]}`,
    description: `This is a sample report description for Report ${i + 1}. It contains important metrics and KPIs.`,
    category: categories[Math.floor(Math.random() * categories.length)],
    owner: owners[Math.floor(Math.random() * owners.length)],
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    updatedAt: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
    lastRun: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 1000000000).toISOString() : undefined,
    schedule: Math.random() > 0.5 ? '0 9 * * 1-5' : undefined,
    tags: Array.from(
      { length: Math.floor(Math.random() * 3) + 1 },
      () => tags[Math.floor(Math.random() * tags.length)]
    ),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    permissions: {
      canView: true,
      canEdit: Math.random() > 0.3,
      canDelete: Math.random() > 0.5,
      canSchedule: Math.random() > 0.4,
    },
  }));
};
