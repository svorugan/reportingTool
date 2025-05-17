import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { DashboardMetric } from '../../types/Dashboard';

const financeMetrics: DashboardMetric[] = [
  {
    id: '1',
    name: 'Revenue',
    value: '$2.5M',
    trend: 8.5,
    comparison: {
      value: 15,
      period: 'vs last quarter'
    }
  },
  {
    id: '2',
    name: 'Operating Expenses',
    value: '$1.2M',
    trend: -2.3,
    comparison: {
      value: -5,
      period: 'vs last quarter'
    }
  },
  {
    id: '3',
    name: 'Profit Margin',
    value: '28.5%',
    trend: 3.2,
    comparison: {
      value: 2,
      period: 'vs last quarter'
    }
  },
  {
    id: '4',
    name: 'Cash Flow',
    value: '$850K',
    trend: 12.1,
    comparison: {
      value: 10,
      period: 'vs last quarter'
    }
  }
];

export const FinanceDashboard: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Financial Analytics Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {financeMetrics.map((metric) => (
          <Grid item xs={12} md={3} key={metric.id}>
            <Paper sx={{ p: 3 }}>
              <Typography color="text.secondary" gutterBottom>
                {metric.name}
              </Typography>
              <Typography variant="h4">
                {metric.value}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <Typography 
                  color={metric.trend >= 0 ? 'success.main' : 'error.main'}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  {metric.trend > 0 ? '+' : ''}{metric.trend}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {metric.comparison?.value > 0 ? '+' : ''}{metric.comparison?.value}% {metric.comparison?.period}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
        
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Revenue Trends
            </Typography>
            {/* Add revenue trend chart here */}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Expense Distribution
            </Typography>
            {/* Add expense pie chart here */}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
