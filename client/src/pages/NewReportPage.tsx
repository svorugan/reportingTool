import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { ReportWizard } from '../components/ReportWizard/ReportWizard';
import { useNavigate } from 'react-router-dom';

export const NewReportPage: React.FC = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/reports');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Create New Report
      </Typography>
      <Paper sx={{ p: 3 }}>
        <ReportWizard onClose={handleClose} />
      </Paper>
    </Box>
  );
};
