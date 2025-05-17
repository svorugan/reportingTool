import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Box,
} from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const dummyReports = [
  {
    id: 1,
    name: 'Monthly Sales Report',
    lastRun: '2024-01-10',
    status: 'success',
    category: 'Sales',
  },
  {
    id: 2,
    name: 'Customer Analytics',
    lastRun: '2024-01-09',
    status: 'failed',
    category: 'Analytics',
  },
  // Add more dummy reports as needed
];

const columnDefs = [
  { field: 'name', headerName: 'Report Name', flex: 2 },
  { field: 'category', headerName: 'Category', flex: 1 },
  { field: 'lastRun', headerName: 'Last Run', flex: 1 },
  { field: 'status', headerName: 'Status', flex: 1 },
];

export const Dashboard: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Reports
              </Typography>
              <Typography variant="h5">
                24
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Reports Run Today
              </Typography>
              <Typography variant="h5">
                8
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Success Rate
              </Typography>
              <Typography variant="h5">
                95%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Recent Reports
        </Typography>
        <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
          <AgGridReact
            rowData={dummyReports}
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={10}
          />
        </div>
      </Paper>
    </Box>
  );
};
