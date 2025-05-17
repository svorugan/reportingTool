import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Tooltip,
  Alert,
  Grid,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Check as CheckIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

interface DataSource {
  id: string;
  name: string;
  type: 'mysql' | 'postgresql' | 'sqlserver' | 'oracle' | 'mongodb';
  host: string;
  port: string;
  database: string;
  username: string;
  status: 'connected' | 'error' | 'disabled';
  lastChecked: string;
  isEncrypted: boolean;
}

export const DataSourcesPage: React.FC = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>([
    {
      id: '1',
      name: 'Production DB',
      type: 'postgresql',
      host: 'prod-db.example.com',
      port: '5432',
      database: 'maindb',
      username: 'admin',
      status: 'connected',
      lastChecked: new Date().toISOString(),
      isEncrypted: true,
    },
    // Add more mock data sources
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingSource, setEditingSource] = useState<DataSource | null>(null);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const [newDataSource, setNewDataSource] = useState<Partial<DataSource>>({
    type: 'postgresql',
    isEncrypted: true,
  });

  const handleAddNew = () => {
    setEditingSource(null);
    setNewDataSource({
      type: 'postgresql',
      isEncrypted: true,
    });
    setOpenDialog(true);
    setTestResult(null);
  };

  const handleEdit = (source: DataSource) => {
    setEditingSource(source);
    setNewDataSource(source);
    setOpenDialog(true);
    setTestResult(null);
  };

  const handleDelete = (id: string) => {
    // TODO: Add confirmation dialog
    setDataSources(prev => prev.filter(source => source.id !== id));
  };

  const handleTestConnection = () => {
    // Mock testing connection
    setTimeout(() => {
      const success = Math.random() > 0.3;
      setTestResult({
        success,
        message: success 
          ? 'Connection successful!' 
          : 'Failed to connect. Please check your credentials.',
      });
    }, 1000);
  };

  const handleSave = () => {
    if (editingSource) {
      setDataSources(prev =>
        prev.map(source =>
          source.id === editingSource.id
            ? { ...source, ...newDataSource }
            : source
        )
      );
    } else {
      setDataSources(prev => [
        ...prev,
        {
          ...newDataSource,
          id: Math.random().toString(36).substr(2, 9),
          status: 'connected',
          lastChecked: new Date().toISOString(),
        } as DataSource,
      ]);
    }
    setOpenDialog(false);
  };

  const getStatusChip = (status: DataSource['status']) => {
    const props = {
      connected: { color: 'success', icon: <CheckIcon /> },
      error: { color: 'error', icon: <ErrorIcon /> },
      disabled: { color: 'default', icon: undefined },
    }[status] as const;

    return (
      <Chip
        size="small"
        icon={props.icon}
        color={props.color}
        label={status}
      />
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Data Sources</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNew}
        >
          Add Data Source
        </Button>
      </Box>

      {/* Data Sources Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Host</TableCell>
              <TableCell>Database</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Checked</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataSources.map((source) => (
              <TableRow key={source.id}>
                <TableCell>{source.name}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={source.type}
                  />
                </TableCell>
                <TableCell>{source.host}</TableCell>
                <TableCell>{source.database}</TableCell>
                <TableCell>{getStatusChip(source.status)}</TableCell>
                <TableCell>{new Date(source.lastChecked).toLocaleString()}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Test Connection">
                      <IconButton size="small" color="primary">
                        <RefreshIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(source)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(source.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingSource ? 'Edit Data Source' : 'Add New Data Source'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                value={newDataSource.name || ''}
                onChange={(e) => setNewDataSource(prev => ({ ...prev, name: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={newDataSource.type || 'postgresql'}
                  onChange={(e) => setNewDataSource(prev => ({ ...prev, type: e.target.value as any }))}
                  label="Type"
                >
                  <MenuItem value="mysql">MySQL</MenuItem>
                  <MenuItem value="postgresql">PostgreSQL</MenuItem>
                  <MenuItem value="sqlserver">SQL Server</MenuItem>
                  <MenuItem value="oracle">Oracle</MenuItem>
                  <MenuItem value="mongodb">MongoDB</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Host"
                value={newDataSource.host || ''}
                onChange={(e) => setNewDataSource(prev => ({ ...prev, host: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Port"
                value={newDataSource.port || ''}
                onChange={(e) => setNewDataSource(prev => ({ ...prev, port: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Database"
                value={newDataSource.database || ''}
                onChange={(e) => setNewDataSource(prev => ({ ...prev, database: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Username"
                value={newDataSource.username || ''}
                onChange={(e) => setNewDataSource(prev => ({ ...prev, username: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="password"
                label="Password"
                onChange={(e) => setNewDataSource(prev => ({ ...prev, password: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={newDataSource.isEncrypted}
                    onChange={(e) => setNewDataSource(prev => ({ ...prev, isEncrypted: e.target.checked }))}
                  />
                }
                label="Encrypt Connection"
              />
            </Grid>
          </Grid>

          {testResult && (
            <Alert
              severity={testResult.success ? 'success' : 'error'}
              sx={{ mt: 2 }}
            >
              {testResult.message}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleTestConnection} color="info">
            Test Connection
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!newDataSource.name || !newDataSource.host}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
