import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Switch,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface QueryInputProps {
  query: string;
  onUpdate: (query: string, columns: Array<{ name: string; alias?: string }>) => void;
}

export const QueryInput: React.FC<QueryInputProps> = ({ 
  query, 
  onUpdate,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isQueryValid, setIsQueryValid] = useState(false);
  const [preQuery, setPreQuery] = useState('');
  const [postQuery, setPostQuery] = useState('');
  const [viewName, setViewName] = useState('');
  const [replaceExisting, setReplaceExisting] = useState(false);
  const [saveAsView, setSaveAsView] = useState(false);

  const validateSqlSyntax = (sql: string): { isValid: boolean; error?: string } => {
    try {
      // Remove comments and normalize whitespace
      const normalizedSql = sql
        .replace(/--.*$/gm, '') // Remove single line comments
        .replace(/\/\*[\s\S]*?\*\//gm, '') // Remove multi-line comments
        .replace(/\s+/g, ' ')
        .trim();

      // Basic structure validation
      if (!normalizedSql.toLowerCase().startsWith('select')) {
        return { isValid: false, error: 'Query must start with SELECT' };
      }

      // Extract main parts of the query
      const fromMatch = normalizedSql.match(/\sFROM\s/i);
      if (!fromMatch) {
        return { isValid: false, error: 'Query must contain FROM clause' };
      }

      // Get the SELECT part
      const selectPart = normalizedSql.substring(6, fromMatch.index).trim();
      if (!selectPart) {
        return { isValid: false, error: 'No columns specified after SELECT' };
      }

      // Validate column list syntax
      const columns = selectPart.split(',').map(col => col.trim());
      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        if (!col) {
          return { 
            isValid: false, 
            error: `Empty column found at position ${i + 1}. Check for extra commas or invalid syntax.` 
          };
        }
        
        // Check for invalid characters or syntax in column names
        if (/[^a-zA-Z0-9_.\s()/*+-]/.test(col)) {
          return { 
            isValid: false, 
            error: `Invalid character in column: "${col}". Only letters, numbers, underscores, and basic operators are allowed.` 
          };
        }
      }

      // Validate basic query structure
      const parts = normalizedSql.toLowerCase().split(/\s+/);
      const hasWhere = parts.includes('where');
      const hasGroupBy = parts.includes('group');
      const hasOrderBy = parts.includes('order');

      // If there's a WHERE, make sure it's after FROM
      if (hasWhere) {
        const whereIndex = normalizedSql.toLowerCase().indexOf(' where ');
        const fromIndex = fromMatch.index;
        if (whereIndex < fromIndex) {
          return { isValid: false, error: 'WHERE clause must come after FROM clause' };
        }
      }

      // If there's an ORDER BY, make sure it's at the end
      if (hasOrderBy) {
        const orderIndex = normalizedSql.toLowerCase().indexOf(' order ');
        if (hasGroupBy && orderIndex < normalizedSql.toLowerCase().indexOf(' group ')) {
          return { isValid: false, error: 'ORDER BY must come after GROUP BY' };
        }
      }

      // Check for unmatched parentheses
      const openParens = (normalizedSql.match(/\(/g) || []).length;
      const closeParens = (normalizedSql.match(/\)/g) || []).length;
      if (openParens !== closeParens) {
        return { isValid: false, error: 'Unmatched parentheses in query' };
      }

      return { isValid: true };
    } catch (err) {
      return { isValid: false, error: 'Invalid SQL syntax' };
    }
  };

  const extractColumns = (sql: string): Array<{ name: string; alias?: string }> => {
    try {
      // Remove comments and normalize whitespace
      const normalizedSql = sql
        .replace(/--.*$/gm, '')
        .replace(/\/\*[\s\S]*?\*\//gm, '')
        .replace(/\s+/g, ' ')
        .trim();

      // Get the part between SELECT and FROM
      const fromIndex = normalizedSql.toLowerCase().indexOf(' from ');
      if (fromIndex === -1) return [];

      const selectPart = normalizedSql.substring(6, fromIndex).trim();
      
      // Split by commas, but respect parentheses
      const columns: Array<{ name: string; alias?: string }> = [];
      let currentColumn = '';
      let parenCount = 0;

      for (let i = 0; i < selectPart.length; i++) {
        const char = selectPart[i];
        
        if (char === '(') parenCount++;
        else if (char === ')') parenCount--;
        else if (char === ',' && parenCount === 0) {
          if (currentColumn.trim()) {
            const columnInfo = parseColumnExpression(currentColumn.trim());
            if (columnInfo) columns.push(columnInfo);
          }
          currentColumn = '';
          continue;
        }
        
        currentColumn += char;
      }

      // Don't forget the last column
      if (currentColumn.trim()) {
        const columnInfo = parseColumnExpression(currentColumn.trim());
        if (columnInfo) columns.push(columnInfo);
      }

      return columns;
    } catch (err) {
      console.error('Error parsing columns:', err);
      return [];
    }
  };

  const parseColumnExpression = (expr: string): { name: string; alias?: string } | null => {
    try {
      // Handle cases with AS keyword
      const asMatch = expr.match(/^(.*?)\s+AS\s+(\w+)$/i);
      if (asMatch) {
        return {
          name: asMatch[1].trim(),
          alias: asMatch[2].trim()
        };
      }

      // Handle cases with space-separated alias
      const spaceMatch = expr.match(/^(.*?)\s+(\w+)$/);
      if (spaceMatch && !spaceMatch[1].match(/^(SELECT|FROM|WHERE|GROUP|ORDER|BY|HAVING|UNION|INTERSECT|EXCEPT)$/i)) {
        return {
          name: spaceMatch[1].trim(),
          alias: spaceMatch[2].trim()
        };
      }

      // No alias
      return { name: expr.trim() };
    } catch (err) {
      return null;
    }
  };

  const validateQuery = async (sql: string) => {
    setIsValidating(true);
    setError(null);
    setIsQueryValid(false);

    try {
      if (!sql.trim()) {
        throw new Error('Query cannot be empty');
      }

      // Validate SQL syntax
      const syntaxValidation = validateSqlSyntax(sql);
      if (!syntaxValidation.isValid) {
        throw new Error(syntaxValidation.error || 'Invalid SQL syntax');
      }

      // Extract and validate columns
      const columns = extractColumns(sql);
      if (columns.length === 0) {
        throw new Error('No valid columns found in the query');
      }

      onUpdate(sql, columns);
      setIsQueryValid(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to validate query');
      setIsQueryValid(false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleSaveAsView = async () => {
    if (!viewName.trim()) {
      setError('View name is required');
      return;
    }

    // Basic view name validation
    if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(viewName)) {
      setError('View name must start with a letter and contain only letters, numbers, and underscores');
      return;
    }

    try {
      const response = await fetch('/api/database/views', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: viewName,
          query,
          replace: replaceExisting,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create view');
      }

      setError(null);
      // Optionally show success message
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create view');
    }
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    onUpdate(newQuery, extractColumns(newQuery));
  };

  // Validate query when component mounts or query changes
  useEffect(() => {
    if (query) {
      validateQuery(query);
    } else {
      setIsQueryValid(false);
      onUpdate('', []); // Clear columns when query is empty
    }
  }, [query]);

  return (
    <Box>
      {/* Pre-Query Section */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Pre-Query Steps</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            SQL statements to execute before the main query (e.g., temporary tables, variables)
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={preQuery}
            onChange={(e) => setPreQuery(e.target.value)}
            placeholder="-- Enter pre-query SQL statements here"
            sx={{ 
              fontFamily: 'monospace',
              '& .MuiInputBase-input': {
                fontFamily: 'monospace',
              }
            }}
          />
        </AccordionDetails>
      </Accordion>

      {/* Main Query Section */}
      <Box sx={{ my: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          SQL Query
        </Typography>
        <TextField
          fullWidth
          required
          multiline
          rows={8}
          value={query}
          onChange={handleQueryChange}
          error={Boolean(error)}
          helperText={error}
          placeholder="SELECT column1, column2 FROM table"
          sx={{ 
            fontFamily: 'monospace',
            '& .MuiInputBase-input': {
              fontFamily: 'monospace',
            }
          }}
        />

        {/* Save as View Section */}
        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={saveAsView}
                onChange={(e) => setSaveAsView(e.target.checked)}
                disabled={!isQueryValid}
              />
            }
            label="Save as View"
          />
          
          {saveAsView && (
            <Box sx={{ mt: 1, display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                label="View Name"
                value={viewName}
                onChange={(e) => setViewName(e.target.value)}
                size="small"
                error={!!error && error.includes('View name')}
                helperText={error && error.includes('View name') ? error : ''}
                sx={{ flexGrow: 1 }}
              />
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={replaceExisting}
                    onChange={(e) => setReplaceExisting(e.target.checked)}
                  />
                }
                label="Replace if exists"
              />
              <Button
                variant="contained"
                size="small"
                onClick={handleSaveAsView}
                disabled={!viewName.trim() || !isQueryValid}
              >
                Create View
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* Post-Query Section */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Post-Query Steps</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            SQL statements to execute after the main query (e.g., cleanup, temporary table drops)
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={postQuery}
            onChange={(e) => setPostQuery(e.target.value)}
            placeholder="-- Enter post-query SQL statements here"
            sx={{ 
              fontFamily: 'monospace',
              '& .MuiInputBase-input': {
                fontFamily: 'monospace',
              }
            }}
          />
        </AccordionDetails>
      </Accordion>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<PlayArrowIcon />}
          onClick={() => validateQuery(query)}
          disabled={isValidating || !query.trim()}
        >
          {isValidating ? 'Validating...' : 'Validate Query'}
        </Button>
      </Box>

      <Paper sx={{ mt: 3, p: 2 }} variant="outlined">
        <Typography variant="subtitle2" color="text.secondary">
          Query Guidelines:
        </Typography>
        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li>Query must be a SELECT statement</li>
          <li>Specify column names explicitly instead of using SELECT *</li>
          <li>Use pre-query for setup (temp tables, variables)</li>
          <li>Use post-query for cleanup operations</li>
          <li>Consider performance implications for large datasets</li>
        </ul>
      </Paper>
    </Box>
  );
};
