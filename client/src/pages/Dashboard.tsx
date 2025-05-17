import React from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Card, 
  CardContent, 
  Box 
} from '@mui/material';
import {
  Description as ReportIcon,
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

export const Dashboard: React.FC = () => {
  const stats = [
    { title: 'Total Reports', value: '156', icon: <ReportIcon fontSize="large" color="primary" /> },
    { title: 'Scheduled Reports', value: '45', icon: <ScheduleIcon fontSize="large" color="secondary" /> },
    { title: 'Reports Run Today', value: '23', icon: <RefreshIcon fontSize="large" color="success" /> }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Welcome Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Welcome to Reporting Tool
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create, manage, and schedule your reports all in one place
            </Typography>
          </Paper>
        </Grid>

        {/* Stats Cards */}
        {stats.map((stat) => (
          <Grid item xs={12} sm={4} key={stat.title}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                {stat.icon}
                <Typography variant="h4" component="div" sx={{ mt: 2 }}>
                  {stat.value}
                </Typography>
                <Typography color="text.secondary">
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Recent Reports */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Reports
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography color="text.secondary">
                Your recently accessed reports will appear here
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Stats
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle1">Most Used Report</Typography>
                <Typography color="text.secondary">Sales Dashboard</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle1">Last Report Run</Typography>
                <Typography color="text.secondary">2 hours ago</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle1">Next Scheduled Report</Typography>
                <Typography color="text.secondary">Daily KPI Report (Tomorrow 9 AM)</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};
