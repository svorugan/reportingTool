import React from 'react';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { DomainType } from '../types/Dashboard';
import { HRDashboard } from '../components/Dashboards/HRDashboard';
import { FinanceDashboard } from '../components/Dashboards/FinanceDashboard';

const domainConfig: Record<DomainType, { title: string; description: string }> = {
  HR: {
    title: 'HR Analytics Dashboard',
    description: 'Key metrics for workforce management and employee performance'
  },
  Finance: {
    title: 'Financial Analytics Dashboard',
    description: 'Financial performance and key business metrics'
  },
  Operations: {
    title: 'Operations Dashboard',
    description: 'Operational efficiency and process metrics'
  },
  Sales: {
    title: 'Sales Analytics',
    description: 'Sales performance and revenue metrics'
  },
  Marketing: {
    title: 'Marketing Analytics',
    description: 'Campaign performance and marketing ROI'
  }
};

const DashboardCard: React.FC<{ domain: DomainType }> = ({ domain }) => {
  const navigate = useNavigate();
  const config = domainConfig[domain];

  return (
    <Paper
      sx={{
        p: 3,
        cursor: 'pointer',
        '&:hover': { backgroundColor: 'action.hover' }
      }}
      onClick={() => navigate(`/dashboards/${domain.toLowerCase()}`)}
    >
      <Typography variant="h5" gutterBottom>
        {config.title}
      </Typography>
      <Typography color="text.secondary">
        {config.description}
      </Typography>
    </Paper>
  );
};

export const DashboardsPage: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Typography variant="h4" gutterBottom>
                Analytics Dashboards
              </Typography>
              <Grid container spacing={3}>
                {Object.keys(domainConfig).map((domain) => (
                  <Grid item xs={12} md={6} lg={4} key={domain}>
                    <DashboardCard domain={domain as DomainType} />
                  </Grid>
                ))}
              </Grid>
            </>
          }
        />
        <Route path="/hr" element={<HRDashboard />} />
        <Route path="/finance" element={<FinanceDashboard />} />
      </Routes>
    </Container>
  );
};
