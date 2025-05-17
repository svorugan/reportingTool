import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Search as SearchIcon,
  Schedule as ScheduleIcon,
  PlayCircleOutline as RunIcon,
  MoreVert as MoreVertIcon,
  History as HistoryIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

interface FavoriteReport {
  id: string;
  name: string;
  description: string;
  type: 'regular' | 'scheduled';
  lastRun?: string;
  nextRun?: string;
  category: string;
  runCount: number;
}

export const FavoritesList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedReport, setSelectedReport] = useState<FavoriteReport | null>(null);
  const navigate = useNavigate();

  // Mock data
  const favorites: FavoriteReport[] = [
    {
      id: '1',
      name: 'Monthly Sales Report',
      description: 'Overview of sales performance and metrics',
      type: 'scheduled',
      lastRun: '2025-01-10T15:30:00',
      nextRun: '2025-02-01T09:00:00',
      category: 'Sales',
      runCount: 24,
    },
    {
      id: '2',
      name: 'Customer Feedback Analysis',
      description: 'Analysis of customer satisfaction surveys',
      type: 'regular',
      lastRun: '2025-01-11T10:15:00',
      category: 'Customer Service',
      runCount: 15,
    },
    // Add more mock data as needed
  ].filter(report => 
    searchQuery === '' || 
    report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, report: FavoriteReport) => {
    setAnchorEl(event.currentTarget);
    setSelectedReport(report);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReport(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Favorite Reports</Typography>
      </Box>

      {/* Search */}
      <TextField
        fullWidth
        placeholder="Search favorites..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      {/* Favorites Grid */}
      <Grid container spacing={3}>
        {favorites.map((report) => (
          <Grid item xs={12} sm={6} md={4} key={report.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {report.name}
                    </Typography>
                    <Typography color="text.secondary" variant="body2" gutterBottom>
                      {report.description}
                    </Typography>
                  </Box>
                  <IconButton size="small" color="warning">
                    <StarIcon />
                  </IconButton>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Chip
                    size="small"
                    label={report.category}
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    size="small"
                    label={report.type === 'scheduled' ? 'Scheduled' : 'Regular'}
                    color={report.type === 'scheduled' ? 'secondary' : 'default'}
                  />
                </Box>

                {report.type === 'scheduled' && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Next Run: {report.nextRun ? formatDate(report.nextRun) : 'Not scheduled'}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Last Run: {report.lastRun ? formatDate(report.lastRun) : 'Never'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Run Count: {report.runCount}
                  </Typography>
                </Box>
              </CardContent>

              <CardActions sx={{ justifyContent: 'flex-end', gap: 1 }}>
                <Tooltip title="Run Now">
                  <IconButton size="small" color="primary">
                    <RunIcon />
                  </IconButton>
                </Tooltip>
                {report.type === 'scheduled' && (
                  <Tooltip title="View Schedule">
                    <IconButton size="small">
                      <ScheduleIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="View History">
                  <IconButton size="small">
                    <HistoryIcon />
                  </IconButton>
                </Tooltip>
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuOpen(e, report)}
                >
                  <MoreVertIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
        <MenuItem onClick={handleMenuClose}>Edit Report</MenuItem>
        <MenuItem onClick={handleMenuClose}>View History</MenuItem>
        <MenuItem onClick={handleMenuClose}>Remove from Favorites</MenuItem>
        <MenuItem onClick={handleMenuClose}>Clone</MenuItem>
      </Menu>
    </Box>
  );
};
