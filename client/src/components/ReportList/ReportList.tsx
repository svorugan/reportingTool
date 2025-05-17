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
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Tooltip,
  Stack,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as RunIcon,
  Schedule as ScheduleIcon,
  MoreVert as MoreVertIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';

interface Report {
  id: string;
  name: string;
  description: string;
  category: string;
  dataSource: {
    id: string;
    name: string;
    type: string;
    status: 'connected' | 'error';
  };
  lastRun?: string;
  createdBy: string;
  isFavorite: boolean;
  query: string;
}

interface FilterState {
  category: string;
  dataSource: string;
}

export const ReportList: React.FC = () => {
  // State
  const [reports, setReports] = useState<Report[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    dataSource: '',
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [totalReports, setTotalReports] = useState(0);
  const [loading, setLoading] = useState(false);

  // Mock data
  const mockReports: Report[] = [
    {
      id: '1',
      name: 'Monthly Sales Report',
      description: 'Overview of monthly sales performance',
      category: 'Sales',
      dataSource: {
        id: '1',
        name: 'Production DB',
        type: 'postgresql',
        status: 'connected',
      },
      lastRun: '2025-01-10T15:30:00',
      createdBy: 'John Doe',
      isFavorite: true,
      query: 'SELECT date, product_name, quantity, amount FROM sales WHERE date >= date_trunc(\'month\', current_date)',
    },
    {
      id: '2',
      name: 'Customer Analytics',
      description: 'Customer behavior analysis',
      category: 'Analytics',
      dataSource: {
        id: '2',
        name: 'Analytics DB',
        type: 'mysql',
        status: 'connected',
      },
      lastRun: '2025-01-11T09:15:00',
      createdBy: 'Jane Smith',
      isFavorite: false,
      query: 'SELECT customer_id, purchase_date, product_name, amount FROM customer_purchases WHERE purchase_date >= date_trunc(\'month\', current_date)',
    },
    {
      id: '3',
      name: 'Inventory Status',
      description: 'Current inventory levels',
      category: 'Operations',
      dataSource: {
        id: '1',
        name: 'Production DB',
        type: 'postgresql',
        status: 'connected',
      },
      lastRun: '2025-01-11T10:00:00',
      createdBy: 'John Doe',
      isFavorite: false,
      query: 'SELECT product_name, quantity, unit_price FROM inventory WHERE quantity > 0',
    },
  ];

  // Fetch reports with pagination, search, and filters
  const fetchReports = async () => {
    setLoading(true);
    try {
      // Filter reports based on search and filters
      const filteredReports = mockReports.filter(report => {
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          if (!report.name.toLowerCase().includes(query) &&
              !report.description.toLowerCase().includes(query)) {
            return false;
          }
        }
        if (filters.category && report.category !== filters.category) return false;
        if (filters.dataSource && report.dataSource.id !== filters.dataSource) return false;
        return true;
      });

      // Apply pagination
      const start = page * rowsPerPage;
      const paginatedReports = filteredReports.slice(start, start + rowsPerPage);

      setReports(paginatedReports);
      setTotalReports(filteredReports.length);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      // TODO: Show error message to user
    } finally {
      setLoading(false);
    }
  };

  // Fetch reports when dependencies change
  useEffect(() => {
    fetchReports();
  }, [page, rowsPerPage, searchQuery, filters]);

  // Handlers
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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, report: Report) => {
    setAnchorEl(event.currentTarget);
    setSelectedReport(report);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReport(null);
  };

  const handleRunReport = (report: Report) => {
    navigate(`/reports/${report.id}/run`);
  };

  const navigate = useNavigate();

  // Get unique categories and data sources for filters
  const categories = Array.from(new Set(mockReports.map(r => r.category)));
  const dataSources = Array.from(
    new Set(mockReports.map(r => JSON.stringify(r.dataSource)))
  ).map(ds => JSON.parse(ds));

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Reports</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/reports/new')}
        >
          New Report
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
          <InputLabel>Category</InputLabel>
          <Select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            input={<OutlinedInput label="Category" />}
          >
            <MenuItem value="">All</MenuItem>
            {categories.map(category => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Data Source</InputLabel>
          <Select
            value={filters.dataSource}
            onChange={(e) => handleFilterChange('dataSource', e.target.value)}
            input={<OutlinedInput label="Data Source" />}
          >
            <MenuItem value="">All</MenuItem>
            {dataSources.map(ds => (
              <MenuItem key={ds.id} value={ds.id}>{ds.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Reports Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="medium">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Data Source</TableCell>
              <TableCell>Last Run</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Tags</TableCell>
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                      size="small"
                      color={report.isFavorite ? 'warning' : 'default'}
                    >
                      {report.isFavorite ? <StarIcon /> : <StarBorderIcon />}
                    </IconButton>
                    <Box>
                      <Typography variant="body1">{report.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {report.description}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={report.category}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <StorageIcon 
                      fontSize="small" 
                      color={report.dataSource.status === 'connected' ? 'success' : 'error'} 
                    />
                    <Box>
                      <Typography variant="body2">{report.dataSource.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {report.dataSource.type.toUpperCase()}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>{formatDate(report.lastRun)}</TableCell>
                <TableCell>{report.createdBy}</TableCell>
                <TableCell>
                  {/* No tags in the mock data */}
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Tooltip title="Run Report">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleRunReport(report)}
                      >
                        <RunIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Schedule">
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
                <TableCell colSpan={7} align="center">
                  <Typography color="text.secondary">
                    {loading ? 'Loading reports...' : 'No reports found'}
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
        <MenuItem onClick={handleMenuClose}>Clone</MenuItem>
        <MenuItem onClick={handleMenuClose}>Export</MenuItem>
        <MenuItem onClick={handleMenuClose}>View History</MenuItem>
        {selectedReport?.isFavorite ? (
          <MenuItem onClick={handleMenuClose}>Remove from Favorites</MenuItem>
        ) : (
          <MenuItem onClick={handleMenuClose}>Add to Favorites</MenuItem>
        )}
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};
