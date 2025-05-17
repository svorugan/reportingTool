import React from 'react';
import {
  Box,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Tooltip,
  IconButton,
  Paper,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface ProcessingOptionsProps {
  type: 'pre' | 'post';
  options: ProcessingConfig;
  onChange: (options: ProcessingConfig) => void;
}

export interface ProcessingConfig {
  sql: string;
  enableLogging: boolean;
  logLevel: 'debug' | 'info' | 'error';
  retryOnError: boolean;
  maxRetries: number;
  notifyOnCompletion: boolean;
  notificationEmail?: string;
  timeoutSeconds: number;
}

export const ProcessingOptions: React.FC<ProcessingOptionsProps> = ({
  type,
  options,
  onChange,
}) => {
  const handleChange = (field: keyof ProcessingConfig, value: any) => {
    onChange({
      ...options,
      [field]: value,
    });
  };

  const isPreProcessing = type === 'pre';

  return (
    <Box>
      {/* SQL Input */}
      <Paper variant="outlined" sx={{ mb: 3, p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          {isPreProcessing ? 'Pre-Processing SQL' : 'Post-Processing SQL'}
          <Tooltip title={isPreProcessing ? 
            "SQL statements to execute before the main query. You can prepare data, create tables, or perform any necessary setup." :
            "SQL statements to execute after the main query. Use this for cleanup, logging, or final data processing."
          }>
            <IconButton size="small" sx={{ ml: 1 }}>
              <HelpOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={6}
          value={options.sql}
          onChange={(e) => handleChange('sql', e.target.value)}
          placeholder={isPreProcessing ? 
            "-- Example pre-processing SQL:\n-- You can write any SQL statements here\n-- Such as:\n--   - Data preparation\n--   - Table creation\n--   - Setting up variables\n--   - Initial calculations" :
            "-- Example post-processing SQL:\n-- You can write any SQL statements here\n-- Such as:\n--   - Cleanup operations\n--   - Logging results\n--   - Final data updates"
          }
          sx={{ 
            fontFamily: 'monospace',
            '& .MuiInputBase-input': {
              fontFamily: 'monospace',
            }
          }}
        />
      </Paper>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {/* Logging Options */}
        <Box sx={{ minWidth: 200 }}>
          <FormControlLabel
            control={
              <Switch
                checked={options.enableLogging}
                onChange={(e) => handleChange('enableLogging', e.target.checked)}
              />
            }
            label="Enable Logging"
          />
          {options.enableLogging && (
            <FormControl fullWidth size="small" sx={{ mt: 1 }}>
              <InputLabel>Log Level</InputLabel>
              <Select
                value={options.logLevel}
                onChange={(e) => handleChange('logLevel', e.target.value)}
                label="Log Level"
              >
                <MenuItem value="debug">Debug</MenuItem>
                <MenuItem value="info">Info</MenuItem>
                <MenuItem value="error">Error</MenuItem>
              </Select>
            </FormControl>
          )}
        </Box>

        {/* Error Handling */}
        <Box sx={{ minWidth: 200 }}>
          <FormControlLabel
            control={
              <Switch
                checked={options.retryOnError}
                onChange={(e) => handleChange('retryOnError', e.target.checked)}
              />
            }
            label="Retry on Error"
          />
          {options.retryOnError && (
            <TextField
              fullWidth
              size="small"
              type="number"
              label="Max Retries"
              value={options.maxRetries}
              onChange={(e) => handleChange('maxRetries', parseInt(e.target.value))}
              sx={{ mt: 1 }}
            />
          )}
        </Box>

        {/* Notification Options */}
        <Box sx={{ minWidth: 200 }}>
          <FormControlLabel
            control={
              <Switch
                checked={options.notifyOnCompletion}
                onChange={(e) => handleChange('notifyOnCompletion', e.target.checked)}
              />
            }
            label="Notify on Completion"
          />
          {options.notifyOnCompletion && (
            <TextField
              fullWidth
              size="small"
              type="email"
              label="Notification Email"
              value={options.notificationEmail || ''}
              onChange={(e) => handleChange('notificationEmail', e.target.value)}
              sx={{ mt: 1 }}
            />
          )}
        </Box>

        {/* Timeout Setting */}
        <Box sx={{ minWidth: 200 }}>
          <Typography variant="subtitle2" gutterBottom>
            Timeout (seconds)
            <Tooltip title="Maximum execution time for this processing step">
              <IconButton size="small">
                <HelpOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Typography>
          <TextField
            fullWidth
            size="small"
            type="number"
            value={options.timeoutSeconds}
            onChange={(e) => handleChange('timeoutSeconds', parseInt(e.target.value))}
          />
        </Box>
      </Box>

      {/* Active Options Summary */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Active Options:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {options.enableLogging && (
            <Chip 
              label={`Logging (${options.logLevel})`}
              size="small"
              color="info"
            />
          )}
          {options.retryOnError && (
            <Chip 
              label={`Retry (max: ${options.maxRetries})`}
              size="small"
              color="warning"
            />
          )}
          {options.notifyOnCompletion && (
            <Chip 
              label="Notifications"
              size="small"
              color="success"
            />
          )}
          <Chip 
            label={`Timeout: ${options.timeoutSeconds}s`}
            size="small"
            variant="outlined"
          />
        </Box>
      </Box>
    </Box>
  );
};
