import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface Column {
  name: string;
  alias?: string;
  include: boolean;
  displayName: string;
  isParameter: boolean;
  parameterConfig?: {
    label: string;
    type: 'exact' | 'contains' | 'startsWith' | 'endsWith';
    required: boolean;
    defaultValue?: string;
  };
}

interface ColumnConfigurationProps {
  columns: Array<{ name: string; alias?: string }>;
  onUpdate: (columns: Column[]) => void;
}

export const ColumnConfiguration: React.FC<ColumnConfigurationProps> = ({
  columns: initialColumns,
  onUpdate,
}) => {
  const [columns, setColumns] = useState<Column[]>(() =>
    initialColumns.map(col => ({
      name: col.name,
      alias: col.alias,
      include: true,
      displayName: col.alias || col.name,
      isParameter: false,
    }))
  );

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(columns);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setColumns(items);
    onUpdate(items);
  };

  const handleColumnChange = (index: number, changes: Partial<Column>) => {
    const updatedColumns = columns.map((col, i) => {
      if (i === index) {
        const updated = { ...col, ...changes };
        // Initialize parameter config when column is marked as parameter
        if (changes.isParameter && !col.isParameter) {
          updated.parameterConfig = {
            label: col.displayName,
            type: 'contains',
            required: false,
          };
        }
        // Remove parameter config when column is unmarked as parameter
        if (changes.isParameter === false && col.isParameter) {
          delete updated.parameterConfig;
        }
        return updated;
      }
      return col;
    });
    setColumns(updatedColumns);
    onUpdate(updatedColumns);
  };

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h6">Column Configuration</Typography>
        <Tooltip title="Configure columns and parameters for your report">
          <HelpOutlineIcon color="action" />
        </Tooltip>
      </Box>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="columns">
          {(provided) => (
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell width={30} />
                    <TableCell>Column</TableCell>
                    <TableCell>Display Name</TableCell>
                    <TableCell align="center">Include</TableCell>
                    <TableCell align="center">Parameter</TableCell>
                    <TableCell>Parameter Options</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                  {columns.map((column, index) => (
                    <Draggable
                      key={column.name}
                      draggableId={column.name}
                      index={index}
                    >
                      {(provided) => (
                        <TableRow
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <TableCell>
                            <IconButton
                              size="small"
                              {...provided.dragHandleProps}
                            >
                              <DragIndicatorIcon />
                            </IconButton>
                          </TableCell>
                          <TableCell>{column.name}</TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              value={column.displayName}
                              onChange={(e) =>
                                handleColumnChange(index, { displayName: e.target.value })
                              }
                              fullWidth
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Switch
                              checked={column.include}
                              onChange={(e) =>
                                handleColumnChange(index, { include: e.target.checked })
                              }
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Switch
                              checked={column.isParameter}
                              onChange={(e) =>
                                handleColumnChange(index, { isParameter: e.target.checked })
                              }
                            />
                          </TableCell>
                          <TableCell>
                            {column.isParameter && column.parameterConfig && (
                              <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                  size="small"
                                  label="Label"
                                  value={column.parameterConfig.label}
                                  onChange={(e) =>
                                    handleColumnChange(index, {
                                      parameterConfig: {
                                        ...column.parameterConfig!,
                                        label: e.target.value,
                                      },
                                    })
                                  }
                                />
                                <FormControl size="small">
                                  <InputLabel>Match Type</InputLabel>
                                  <Select
                                    value={column.parameterConfig.type}
                                    label="Match Type"
                                    onChange={(e) =>
                                      handleColumnChange(index, {
                                        parameterConfig: {
                                          ...column.parameterConfig!,
                                          type: e.target.value as any,
                                        },
                                      })
                                    }
                                  >
                                    <MenuItem value="exact">Exact Match</MenuItem>
                                    <MenuItem value="contains">Contains</MenuItem>
                                    <MenuItem value="startsWith">Starts With</MenuItem>
                                    <MenuItem value="endsWith">Ends With</MenuItem>
                                  </Select>
                                </FormControl>
                                <Switch
                                  checked={column.parameterConfig.required}
                                  onChange={(e) =>
                                    handleColumnChange(index, {
                                      parameterConfig: {
                                        ...column.parameterConfig!,
                                        required: e.target.checked,
                                      },
                                    })
                                  }
                                />
                              </Box>
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Droppable>
      </DragDropContext>

      <Paper sx={{ mt: 3, p: 2 }} variant="outlined">
        <Typography variant="subtitle2" color="text.secondary">
          Configuration Guide:
        </Typography>
        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li>Drag rows to reorder columns in the report</li>
          <li>Toggle Include to show/hide columns in the report</li>
          <li>Enable Parameter to allow users to filter by this column</li>
          <li>For parameters, configure:
            <ul>
              <li>Label: What users will see when entering values</li>
              <li>Match Type: How the parameter value will filter results</li>
              <li>Required: Whether users must provide a value</li>
            </ul>
          </li>
        </ul>
      </Paper>
    </Box>
  );
};
