import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  Button,
  Typography,
  Tooltip,
  InputAdornment,
  Select,
  FormControl,
  InputLabel,
  OutlinedInput,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayArrowIcon,
  Schedule as ScheduleIcon,
  MoreVert as MoreVertIcon,
  Pause as PauseIcon,
  CalendarToday as CalendarIcon,
  PlayCircleOutline as PlayCircleOutlineIcon,
} from '@mui/icons-material';

interface ScheduledReport {
  id: string;
  name: string;
  description: string;
  schedule: string;
  nextRun: string;
  lastRun?: string;
  status: 'active' | 'paused' | 'error';
  recipients: string[];
  format: 'pdf' | 'excel' | 'csv';
  owner: string;
}

interface FilterState {
  status: string;
  frequency: string;
  format: string;
}

export const ScheduledReportList: React.FC = () => {
  const [reports, setReports] = useState<ScheduledReport[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    status: '',
    frequency: '',
    format: '',
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedReport, setSelectedReport] = useState<ScheduledReport | null>(null);
  const [totalReports, setTotalReports] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Mock data generation
  const generateMockReports = (count: number): ScheduledReport[] => {
    const frequencies = ['Daily', 'Weekly', 'Monthly', 'Quarterly'];
    const formats = ['pdf', 'excel', 'csv'] as const;
    const statuses: Array<'active' | 'paused' | 'error'> = ['active', 'paused', 'error'];
    const owners = ['John Doe', 'Jane Smith', 'Bob Wilson'];

    return Array.from({ length: count }, (_, i) => ({
      id: `sr-${i + 1}`,
      name: `Scheduled Report ${i + 1}`,
      description: `This is a ${frequencies[i % frequencies.length]} report for ${['Sales', 'Marketing', 'Operations', 'Finance'][i % 4]}`,
      schedule: `${frequencies[i % frequencies.length]} at 9:00 AM`,
      nextRun: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      lastRun: Math.random() > 0.2 ? new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString() : undefined,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      recipients: Array.from(
        { length: Math.floor(Math.random() * 3) + 1 },
        () => `user${Math.floor(Math.random() * 10)}@example.com`
      ),
      format: formats[Math.floor(Math.random() * formats.length)],
      owner: owners[Math.floor(Math.random() * owners.length)],
    }));
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      // For now, use mock data
      const mockReports = generateMockReports(100);
      
      // Apply filters
      let filteredReports = mockReports;
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredReports = filteredReports.filter(report => 
          report.name.toLowerCase().includes(query) ||
          report.description.toLowerCase().includes(query) ||
          report.schedule.toLowerCase().includes(query)
        );
      }

      if (filters.status) {
        filteredReports = filteredReports.filter(report => 
          report.status === filters.status
        );
      }

      if (filters.frequency) {
        filteredReports = filteredReports.filter(report => 
          report.schedule.toLowerCase().includes(filters.frequency.toLowerCase())
        );
      }

      if (filters.format) {
        filteredReports = filteredReports.filter(report => 
          report.format === filters.format
        );
      }

      // Apply pagination
      const start = page * rowsPerPage;
      const paginatedReports = filteredReports.slice(start, start + rowsPerPage);

      setReports(paginatedReports);
      setTotalReports(filteredReports.length);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [page, rowsPerPage, searchQuery, filters]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, report: ScheduledReport) => {
    setAnchorEl(event.currentTarget);
    setSelectedReport(report);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReport(null);
  };

  const getStatusColor = (status: ScheduledReport['status']) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'paused':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Scheduled Reports</Typography>
        <Button
          variant="contained"
          startIcon={<ScheduleIcon />}
          onClick={() => navigate('/reports/new?type=scheduled')}
        >
          Schedule New Report
        </Button>
      </Box>

      {/* Search and Filters */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search reports..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1 }}
        />
        
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            input={<OutlinedInput label="Status" />}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="paused">Paused</MenuItem>
            <MenuItem value="error">Error</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Frequency</InputLabel>
          <Select
            value={filters.frequency}
            onChange={(e) => handleFilterChange('frequency', e.target.value)}
            input={<OutlinedInput label="Frequency" />}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="quarterly">Quarterly</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Format</InputLabel>
          <Select
            value={filters.format}
            onChange={(e) => handleFilterChange('format', e.target.value)}
            input={<OutlinedInput label="Format" />}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pdf">PDF</MenuItem>
            <MenuItem value="excel">Excel</MenuItem>
            <MenuItem value="csv">CSV</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Reports Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="medium">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Schedule</TableCell>
              <TableCell>Next Run</TableCell>
              <TableCell>Last Run</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Format</TableCell>
              <TableCell>Recipients</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report) => (
              <TableRow
                key={report.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Box>
                    <Typography variant="body1">{report.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {report.description}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarIcon fontSize="small" color="action" />
                    {report.schedule}
                  </Box>
                </TableCell>
                <TableCell>{formatDate(report.nextRun)}</TableCell>
                <TableCell>
                  {report.lastRun ? formatDate(report.lastRun) : 'Never'}
                </TableCell>
                <TableCell>
                  <Chip
                    label={report.status}
                    color={getStatusColor(report.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={report.format.toUpperCase()}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title={report.recipients.join(', ')}>
                    <Typography variant="body2">
                      {report.recipients.length} recipient{report.recipients.length !== 1 ? 's' : ''}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Tooltip title={report.status === 'active' ? 'Pause' : 'Resume'}>
                      <IconButton size="small" color={report.status === 'active' ? 'warning' : 'success'}>
                        {report.status === 'active' ? <PauseIcon /> : <PlayArrowIcon />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Run Now">
                      <IconButton size="small" color="primary">
                        <PlayCircleOutlineIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Schedule">
                      <IconButton size="small">
                        <ScheduleIcon />
                      </IconButton>
                    </Tooltip>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, report)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {reports.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography color="text.secondary">
                    {loading ? 'Loading reports...' : 'No scheduled reports found'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={totalReports}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 25, 50, 100]}
      />

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
        <MenuItem onClick={handleMenuClose}>Edit Report</MenuItem>
        <MenuItem onClick={handleMenuClose}>Edit Schedule</MenuItem>
        <MenuItem onClick={handleMenuClose}>View History</MenuItem>
        <MenuItem onClick={handleMenuClose}>Clone</MenuItem>
        <MenuItem
          onClick={handleMenuClose}
          sx={{ color: 'error.main' }}
        >
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};
