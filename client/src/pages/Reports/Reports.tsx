import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as RunIcon,
} from '@mui/icons-material';
import { ReportWizard } from '../../components/ReportWizard/ReportWizard';

const dummyReports = [
  {
    id: 1,
    name: 'Monthly Sales Report',
    description: 'Detailed analysis of monthly sales performance',
    category: 'Sales',
    createdAt: '2024-01-01',
    lastRun: '2024-01-10',
  },
  {
    id: 2,
    name: 'Customer Analytics',
    description: 'Customer behavior and engagement metrics',
    category: 'Analytics',
    createdAt: '2024-01-05',
    lastRun: '2024-01-09',
  },
  // Add more dummy reports
];

export const Reports: React.FC = () => {
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const handleCreateReport = () => {
    setIsWizardOpen(true);
  };

  const handleCloseWizard = () => {
    setIsWizardOpen(false);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Reports</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateReport}
        >
          Create Report
        </Button>
      </Box>

      <Grid container spacing={3}>
        {dummyReports.map((report) => (
          <Grid item xs={12} md={6} lg={4} key={report.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {report.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Category: {report.category}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1.5 }}>
                  {report.description}
                </Typography>
                <Typography variant="caption" display="block">
                  Last Run: {report.lastRun}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton size="small" title="Run Report">
                  <RunIcon />
                </IconButton>
                <IconButton size="small" title="Edit Report">
                  <EditIcon />
                </IconButton>
                <IconButton size="small" title="Delete Report">
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <ReportWizard
        open={isWizardOpen}
        onClose={handleCloseWizard}
      />
    </Box>
  );
};
