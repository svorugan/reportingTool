import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Storage as StorageIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

interface DataSource {
  id: string;
  name: string;
  type: string;
  status?: 'connected' | 'error';
  description?: string;
  lastUsed?: string;
}

interface DataSourceSelectionProps {
  selectedDataSource: {
    id: string;
    name: string;
    type: string;
  };
  onChange: (dataSource: { id: string; name: string; type: string }) => void;
}

export const DataSourceSelection: React.FC<DataSourceSelectionProps> = ({
  selectedDataSource,
  onChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dataSources, setDataSources] = useState<DataSource[]>([]);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockDataSources: DataSource[] = [
      {
        id: '1',
        name: 'Production Database',
        type: 'postgresql',
        status: 'connected',
        description: 'Main production PostgreSQL database',
        lastUsed: '2025-01-11T10:00:00',
      },
      {
        id: '2',
        name: 'Analytics DB',
        type: 'mysql',
        status: 'connected',
        description: 'Analytics data warehouse',
        lastUsed: '2025-01-10T15:30:00',
      },
      {
        id: '3',
        name: 'Legacy System',
        type: 'sqlserver',
        status: 'error',
        description: 'Legacy SQL Server database',
        lastUsed: '2025-01-09T09:15:00',
      },
    ];

    setDataSources(mockDataSources.filter(ds => 
      !searchQuery || 
      ds.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ds.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ));
  }, [searchQuery]);

  const handleSelect = (dataSource: DataSource) => {
    // Only select if the data source is connected
    if (dataSource.status === 'connected') {
      onChange({
        id: dataSource.id,
        name: dataSource.name,
        type: dataSource.type,
      });
    }
  };

  const getStatusIcon = (status?: 'connected' | 'error') => {
    switch (status) {
      case 'connected':
        return <CheckCircleIcon color="success" />;
      case 'error':
        return <ErrorIcon color="error" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select Data Source
      </Typography>
      
      {/* Search */}
      <TextField
        fullWidth
        placeholder="Search data sources..."
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

      {/* Data Sources Grid */}
      <Grid container spacing={2}>
        {dataSources.map((source) => (
          <Grid item xs={12} sm={6} md={4} key={source.id}>
            <Card 
              sx={{ 
                height: '100%',
                bgcolor: source.status === 'error' ? 'error.lighter' : 
                        selectedDataSource.id === source.id ? 'primary.lighter' : 
                        'background.paper',
                opacity: source.status === 'error' ? 0.7 : 1,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: source.status === 'error' ? 'none' : 'translateY(-4px)',
                  boxShadow: source.status === 'error' ? 1 : 4,
                }
              }}
            >
              <CardActionArea
                onClick={() => handleSelect(source)}
                disabled={source.status === 'error'}
                sx={{ height: '100%' }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <StorageIcon color="primary" />
                      <Typography variant="h6">
                        {source.name}
                      </Typography>
                    </Box>
                    <Tooltip title={source.status === 'connected' ? 'Connected' : 'Connection Error'}>
                      <IconButton size="small">
                        {getStatusIcon(source.status)}
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    {source.description}
                  </Typography>

                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Chip
                      label={source.type.toUpperCase()}
                      size="small"
                      variant="outlined"
                    />
                    {selectedDataSource.id === source.id && (
                      <Chip
                        label="Selected"
                        size="small"
                        color="primary"
                      />
                    )}
                  </Box>

                  <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                    Last used: {formatDate(source.lastUsed)}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {dataSources.length === 0 && (
        <Alert severity="info">
          No data sources found. Please check your search query or add a new data source.
        </Alert>
      )}

      {selectedDataSource.id && (
        <Alert severity="success" sx={{ mt: 3 }}>
          Selected data source: {selectedDataSource.name}
        </Alert>
      )}
    </Box>
  );
};
