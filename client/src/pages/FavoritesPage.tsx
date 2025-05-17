import React from 'react';
import { Container } from '@mui/material';
import { FavoritesList } from '../components/FavoritesList/FavoritesList';

export const FavoritesPage: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <FavoritesList />
    </Container>
  );
};
