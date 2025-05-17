import React from 'react';
import {
  Grid,
  TextField,
  MenuItem,
} from '@mui/material';

const categories = ['Sales', 'Analytics', 'Operations', 'Finance', 'Marketing'];

interface BasicDetailsProps {
  data: {
    name: string;
    description: string;
    category: string;
  };
  onUpdate: (data: BasicDetailsProps['data']) => void;
}

export const BasicDetails: React.FC<BasicDetailsProps> = ({ data, onUpdate }) => {
  const handleChange = (field: keyof typeof data) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onUpdate({
      ...data,
      [field]: event.target.value,
    });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          required
          label="Report Name"
          value={data.name}
          onChange={handleChange('name')}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Description"
          multiline
          rows={3}
          value={data.description}
          onChange={handleChange('description')}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          required
          select
          label="Category"
          value={data.category}
          onChange={handleChange('category')}
        >
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </Grid>
  );
};
