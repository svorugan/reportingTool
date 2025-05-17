import React from 'react';
import { Container } from '@mui/material';
import { ScheduledReportList } from '../components/ScheduledReportList/ScheduledReportList';

export const ScheduledReportsPage: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <ScheduledReportList />
    </Container>
  );
};
