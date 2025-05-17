import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Stack,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  CircularProgress,
  Breadcrumbs,
  Link,
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Download as DownloadIcon,
  PlayArrow as RunIcon,
} from '@mui/icons-material';

interface Parameter {
  name: string;
  type: 'text' | 'number' | 'date' | 'select';
  defaultValue?: string;
  options?: string[]; // For select type
}

interface Report {
  id: string;
  name: string;
  description: string;
  query: string;
  parameters: Parameter[];
  dataSource: {
    id: string;
    name: string;
    type: string;
  };
}

export const RunReportPage: React.FC = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  
  const [report, setReport] = useState<Report | null>(null);
  const [paramValues, setParamValues] = useState<Record<string, any>>({});
  const [results, setResults] = useState<any[] | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [executing, setExecuting] = useState(false);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchReport = async () => {
      setLoading(true);
      try {
        // Mock data
        const mockReport: Report = {
          id: reportId!,
          name: 'Monthly Sales Report',
          description: 'Overview of monthly sales performance',
          query: 'SELECT date, product_name, quantity, amount FROM sales WHERE date >= :start_date AND date <= :end_date',
          parameters: [
            {
              name: 'start_date',
              type: 'date',
              defaultValue: new Date().toISOString().split('T')[0],
            },
            {
              name: 'end_date',
              type: 'date',
              defaultValue: new Date().toISOString().split('T')[0],
            },
            {
              name: 'product_category',
              type: 'select',
              options: ['Electronics', 'Clothing', 'Food', 'All'],
              defaultValue: 'All',
            },
          ],
          dataSource: {
            id: '1',
            name: 'Production DB',
            type: 'postgresql',
          },
        };

        setReport(mockReport);
        // Initialize parameter values with defaults
        const initialValues: Record<string, any> = {};
        mockReport.parameters.forEach(param => {
          initialValues[param.name] = param.defaultValue || '';
        });
        setParamValues(initialValues);
      } catch (err) {
        setError('Failed to load report details');
      } finally {
        setLoading(false);
      }
    };

    if (reportId) {
      fetchReport();
    }
  }, [reportId]);

  const handleParamChange = (name: string, value: any) => {
    setParamValues(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const executeReport = async () => {
    setExecuting(true);
    setError(null);
    setResults(null);

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock results
      const mockResults = [
        { date: '2025-01-01', product_name: 'Laptop', quantity: 5, amount: 5000 },
        { date: '2025-01-02', product_name: 'Mouse', quantity: 10, amount: 300 },
        { date: '2025-01-03', product_name: 'Keyboard', quantity: 7, amount: 700 },
      ];

      setResults(mockResults);
      setColumns(Object.keys(mockResults[0]));
    } catch (err) {
      setError('Failed to execute report');
    } finally {
      setExecuting(false);
    }
  };

  const downloadResults = () => {
    if (!results) return;

    const csv = [
      columns.join(','),
      ...results.map(row => columns.map(col => row[col]).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report?.name.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!report) {
    return (
      <Alert severity="error">Report not found</Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <IconButton onClick={() => navigate('/reports')}>
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Breadcrumbs>
              <Link 
                component="button"
                variant="body1" 
                onClick={() => navigate('/reports')}
                sx={{ cursor: 'pointer' }}
              >
                Reports
              </Link>
              <Typography color="text.primary">{report.name}</Typography>
            </Breadcrumbs>
            <Typography variant="h5" sx={{ mt: 1 }}>{report.name}</Typography>
          </Box>
        </Stack>
        <Typography color="text.secondary">{report.description}</Typography>
      </Box>

      {/* Parameters Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Parameters</Typography>
        <Grid container spacing={3}>
          {report.parameters.map((param) => (
            <Grid item xs={12} sm={6} md={4} key={param.name}>
              {param.type === 'date' ? (
                <TextField
                  fullWidth
                  label={param.name}
                  type="date"
                  value={paramValues[param.name]}
                  onChange={(e) => handleParamChange(param.name, e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              ) : param.type === 'select' ? (
                <TextField
                  select
                  fullWidth
                  label={param.name}
                  value={paramValues[param.name]}
                  onChange={(e) => handleParamChange(param.name, e.target.value)}
                >
                  {param.options?.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              ) : (
                <TextField
                  fullWidth
                  label={param.name}
                  type={param.type}
                  value={paramValues[param.name]}
                  onChange={(e) => handleParamChange(param.name, e.target.value)}
                />
              )}
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={executeReport}
            disabled={executing}
            startIcon={executing ? <CircularProgress size={20} /> : <RunIcon />}
          >
            {executing ? 'Executing...' : 'Run Report'}
          </Button>
        </Box>
      </Paper>

      {/* Results Section */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      )}

      {results && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Results</Typography>
            <Tooltip title="Download as CSV">
              <IconButton onClick={downloadResults}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <TableContainer sx={{ maxHeight: '60vh' }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column}>{column}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map((row, index) => (
                  <TableRow key={index}>
                    {columns.map((column) => (
                      <TableCell key={column}>{row[column]}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
};
