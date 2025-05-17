import React from 'react';
import { Container } from '@mui/material';
import { ReportList } from '../components/ReportList/ReportList';

export const ReportsPage: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <ReportList />
    </Container>
  );
};
