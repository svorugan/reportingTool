import React from 'react';
import { Container } from '@mui/material';
import { HistoryList } from '../components/HistoryList/HistoryList';

export const HistoryPage: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <HistoryList />
    </Container>
  );
};
