import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert,
  Divider,
} from '@mui/material';
import TableChartIcon from '@mui/icons-material/TableChart';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import KeyIcon from '@mui/icons-material/Key';
import WarningIcon from '@mui/icons-material/Warning';

interface Column {
  name: string;
  alias?: string;
  tablePrefix?: string;
  expression?: boolean;
}

interface Table {
  name: string;
  alias?: string;
}

interface QueryPreviewProps {
  columns: Column[];
  tables: Table[];
  parameters: string[];
  warnings: string[];
}

export const QueryPreview: React.FC<QueryPreviewProps> = ({
  columns,
  tables,
  parameters,
  warnings,
}) => {
  return (
    <Paper variant="outlined" sx={{ mt: 3, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Query Analysis
      </Typography>

      {/* Warnings Section */}
      {warnings.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="warning.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningIcon fontSize="small" />
            Warnings
          </Typography>
          <List dense>
            {warnings.map((warning, index) => (
              <ListItem key={index}>
                <Alert severity="warning" sx={{ width: '100%' }}>
                  {warning}
                </Alert>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* Columns Section */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ViewColumnIcon fontSize="small" />
          Columns ({columns.length})
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
          {columns.map((column, index) => (
            <Chip
              key={index}
              label={
                column.tablePrefix
                  ? `${column.tablePrefix}.${column.name}`
                  : column.name
              }
              variant={column.expression ? "outlined" : "filled"}
              color={column.expression ? "warning" : "default"}
              size="small"
            />
          ))}
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Tables Section */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TableChartIcon fontSize="small" />
          Referenced Tables ({tables.length})
        </Typography>
        <List dense>
          {tables.map((table, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={table.name}
                secondary={table.alias ? `Alias: ${table.alias}` : null}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Parameters Section */}
      {parameters.length > 0 && (
        <Box>
          <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <KeyIcon fontSize="small" />
            Parameters ({parameters.length})
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {parameters.map((param, index) => (
              <Chip
                key={index}
                label={param}
                variant="outlined"
                color="info"
                size="small"
              />
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
};
