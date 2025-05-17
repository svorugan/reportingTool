import React, { useState } from 'react';
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
  Typography,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Error as ErrorIcon,
  CheckCircle as SuccessIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

interface ReportHistory {
  id: string;
  reportId: string;
  name: string;
  runDate: string;
  duration: string;
  status: 'success' | 'error' | 'running';
  type: 'manual' | 'scheduled';
  format: 'pdf' | 'excel' | 'csv';
  size: string;
  user: string;
  isFavorite: boolean;
}

interface FilterState {
  status: string;
  type: string;
  format: string;
}

export const HistoryList: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    status: '',
    type: '',
    format: '',
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedHistory, setSelectedHistory] = useState<ReportHistory | null>(null);

  // Mock data
  const generateMockHistory = (count: number): ReportHistory[] => {
    const statuses: Array<'success' | 'error' | 'running'> = ['success', 'error', 'running'];
    const formats: Array<'pdf' | 'excel' | 'csv'> = ['pdf', 'excel', 'csv'];
    const users = ['John Doe', 'Jane Smith', 'Bob Wilson'];

    return Array.from({ length: count }, (_, i) => ({
      id: `hist-${i + 1}`,
      reportId: `report-${Math.floor(Math.random() * 10) + 1}`,
      name: `Report Run ${i + 1}`,
      runDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      duration: `${Math.floor(Math.random() * 60)} seconds`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      type: Math.random() > 0.5 ? 'manual' : 'scheduled',
      format: formats[Math.floor(Math.random() * formats.length)],
      size: `${Math.floor(Math.random() * 1000)} KB`,
      user: users[Math.floor(Math.random() * users.length)],
      isFavorite: Math.random() > 0.7,
    }));
  };

  const history = generateMockHistory(100)
    .filter(item => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!item.name.toLowerCase().includes(query) &&
            !item.user.toLowerCase().includes(query)) {
          return false;
        }
      }
      if (filters.status && item.status !== filters.status) return false;
      if (filters.type && item.type !== filters.type) return false;
      if (filters.format && item.format !== filters.format) return false;
      return true;
    })
    .slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, historyItem: ReportHistory) => {
    setAnchorEl(event.currentTarget);
    setSelectedHistory(historyItem);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedHistory(null);
  };

  const getStatusIcon = (status: ReportHistory['status']) => {
    switch (status) {
      case 'success':
        return <SuccessIcon fontSize="small" color="success" />;
      case 'error':
        return <ErrorIcon fontSize="small" color="error" />;
      case 'running':
        return <RefreshIcon fontSize="small" color="primary" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Report History</Typography>
      </Box>

      {/* Search and Filters */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search history..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            input={<OutlinedInput label="Status" />}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="success">Success</MenuItem>
            <MenuItem value="error">Error</MenuItem>
            <MenuItem value="running">Running</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            input={<OutlinedInput label="Type" />}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="manual">Manual</MenuItem>
            <MenuItem value="scheduled">Scheduled</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Format</InputLabel>
          <Select
            value={filters.format}
            onChange={(e) => setFilters(prev => ({ ...prev, format: e.target.value }))}
            input={<OutlinedInput label="Format" />}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pdf">PDF</MenuItem>
            <MenuItem value="excel">Excel</MenuItem>
            <MenuItem value="csv">CSV</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* History Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="medium">
          <TableHead>
            <TableRow>
              <TableCell>Report Name</TableCell>
              <TableCell>Run Date</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Format</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>User</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                      size="small"
                      color={item.isFavorite ? 'warning' : 'default'}
                    >
                      {item.isFavorite ? <StarIcon /> : <StarBorderIcon />}
                    </IconButton>
                    {item.name}
                  </Box>
                </TableCell>
                <TableCell>{formatDate(item.runDate)}</TableCell>
                <TableCell>{item.duration}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getStatusIcon(item.status)}
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {item.status}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    icon={item.type === 'scheduled' ? <ScheduleIcon /> : undefined}
                    label={item.type}
                    color={item.type === 'scheduled' ? 'secondary' : 'default'}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={item.format.toUpperCase()}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{item.size}</TableCell>
                <TableCell>{item.user}</TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    {item.status === 'success' && (
                      <Tooltip title="Download">
                        <IconButton size="small" color="primary">
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="More Actions">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, item)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={100}
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
        <MenuItem onClick={handleMenuClose}>Run Again</MenuItem>
        <MenuItem onClick={handleMenuClose}>View Report</MenuItem>
        {selectedHistory?.status === 'success' && (
          <MenuItem onClick={handleMenuClose}>Download</MenuItem>
        )}
        {selectedHistory?.isFavorite ? (
          <MenuItem onClick={handleMenuClose}>Remove from Favorites</MenuItem>
        ) : (
          <MenuItem onClick={handleMenuClose}>Add to Favorites</MenuItem>
        )}
      </Menu>
    </Box>
  );
};
