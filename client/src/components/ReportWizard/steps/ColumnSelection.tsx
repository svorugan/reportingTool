import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Typography,
  Switch,
} from '@mui/material';

interface Column {
  name: string;
  include: boolean;
  isParameter: boolean;
  parameterType?: 'text' | 'number' | 'date' | 'select';
  parameterDefault?: string;
}

interface ColumnSelectionProps {
  columns: Column[];
  onUpdate: (columns: Column[]) => void;
}

export const ColumnSelection: React.FC<ColumnSelectionProps> = ({
  columns,
  onUpdate,
}) => {
  const handleToggleInclude = (index: number) => {
    const newColumns = [...columns];
    newColumns[index] = {
      ...newColumns[index],
      include: !newColumns[index].include,
    };
    onUpdate(newColumns);
  };

  const handleToggleParameter = (index: number) => {
    const newColumns = [...columns];
    newColumns[index] = {
      ...newColumns[index],
      isParameter: !newColumns[index].isParameter,
      parameterType: !newColumns[index].isParameter ? 'text' : undefined,
      parameterDefault: !newColumns[index].isParameter ? '' : undefined,
    };
    onUpdate(newColumns);
  };

  const handleParameterTypeChange = (index: number, type: Column['parameterType']) => {
    const newColumns = [...columns];
    newColumns[index] = {
      ...newColumns[index],
      parameterType: type,
      parameterDefault: '',
    };
    onUpdate(newColumns);
  };

  const handleDefaultValueChange = (index: number, value: string) => {
    const newColumns = [...columns];
    newColumns[index] = {
      ...newColumns[index],
      parameterDefault: value,
    };
    onUpdate(newColumns);
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Configure columns and parameters:
      </Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Include</TableCell>
              <TableCell>Column Name</TableCell>
              <TableCell>Parameter</TableCell>
              <TableCell>Parameter Type</TableCell>
              <TableCell>Default Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {columns.map((column, index) => (
              <TableRow key={column.name}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={column.include}
                    onChange={() => handleToggleInclude(index)}
                  />
                </TableCell>
                <TableCell>{column.name}</TableCell>
                <TableCell>
                  <Switch
                    checked={column.isParameter}
                    onChange={() => handleToggleParameter(index)}
                  />
                </TableCell>
                <TableCell>
                  {column.isParameter && (
                    <FormControl fullWidth size="small">
                      <Select
                        value={column.parameterType || 'text'}
                        onChange={(e) =>
                          handleParameterTypeChange(index, e.target.value as Column['parameterType'])
                        }
                      >
                        <MenuItem value="text">Text</MenuItem>
                        <MenuItem value="number">Number</MenuItem>
                        <MenuItem value="date">Date</MenuItem>
                        <MenuItem value="select">Select</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                </TableCell>
                <TableCell>
                  {column.isParameter && (
                    <TextField
                      size="small"
                      fullWidth
                      value={column.parameterDefault || ''}
                      onChange={(e) =>
                        handleDefaultValueChange(index, e.target.value)
                      }
                      placeholder={
                        column.parameterType === 'select'
                          ? 'Comma-separated values'
                          : 'Default value'
                      }
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          * For parameters of type 'select', provide comma-separated values in the default value field
        </Typography>
      </Box>
    </Box>
  );
};
