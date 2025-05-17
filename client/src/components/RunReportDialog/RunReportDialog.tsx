import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  LinearProgress,
  Typography,
  Box,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Stack,
  Tooltip,
} from '@mui/material';
import {
  Download as DownloadIcon,
  ContentCopy as CopyIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

interface RunReportDialogProps {
  open: boolean;
  onClose: () => void;
  report: {
    id: string;
    name: string;
    query: string;
  };
}

export const RunReportDialog: React.FC<RunReportDialogProps> = ({
  open,
  onClose,
  report,
}) => {
  const [status, setStatus] = useState<'running' | 'completed' | 'error'>('running');
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any[] | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [rowCount, setRowCount] = useState<number>(0);

  useEffect(() => {
    if (open) {
      runReport();
    }
  }, [open, report.id]);

  const runReport = async () => {
    setStatus('running');
    setError(null);
    setResults(null);
    setExecutionTime(null);

    try {
      // TODO: Replace with actual API call
      const startTime = performance.now();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock results
      const mockResults = [
        { id: 1, name: 'John Doe', email: 'john@example.com', department: 'Sales' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', department: 'Marketing' },
        { id: 3, name: 'Bob Wilson', email: 'bob@example.com', department: 'Engineering' },
      ];

      const endTime = performance.now();
      setExecutionTime(endTime - startTime);
      setResults(mockResults);
      setColumns(Object.keys(mockResults[0]));
      setRowCount(mockResults.length);
      setStatus('completed');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run report');
      setStatus('error');
    }
  };

  const handleDownload = () => {
    if (!results) return;

    const csv = [
      columns.join(','),
      ...results.map(row => columns.map(col => row[col]).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.name.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleCopyToClipboard = async () => {
    if (!results) return;
    
    try {
      const csv = [
        columns.join('\t'),
        ...results.map(row => columns.map(col => row[col]).join('\t'))
      ].join('\n');
      
      await navigator.clipboard.writeText(csv);
      // TODO: Show success toast
    } catch (err) {
      // TODO: Show error toast
      console.error('Failed to copy to clipboard:', err);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { height: '80vh' }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Running Report: {report.name}</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {status === 'running' && (
          <Box sx={{ width: '100%', mt: 2 }}>
            <LinearProgress />
            <Typography sx={{ mt: 1 }} align="center">
              Executing report...
            </Typography>
          </Box>
        )}

        {status === 'error' && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error || 'An error occurred while running the report'}
          </Alert>
        )}

        {status === 'completed' && results && (
          <Box>
            <Box sx={{ mb: 2 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  {rowCount} rows
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  •
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Executed in {(executionTime! / 1000).toFixed(2)} seconds
                </Typography>
              </Stack>
            </Box>

            <TableContainer component={Paper} sx={{ maxHeight: '60vh' }}>
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
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between', px: 2, py: 1.5 }}>
        <Box>
          {status === 'completed' && (
            <>
              <Tooltip title="Download as CSV">
                <IconButton onClick={handleDownload} size="small">
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Copy to Clipboard">
                <IconButton onClick={handleCopyToClipboard} size="small">
                  <CopyIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
        <Box>
          <Button onClick={onClose}>Close</Button>
          {status !== 'running' && (
            <Button
              variant="contained"
              onClick={runReport}
              sx={{ ml: 1 }}
            >
              Run Again
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};
