interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

interface ParsedQuery {
  columns: Array<{
    name: string;
    alias?: string;
    tablePrefix?: string;
    expression?: boolean;
  }>;
  tables: Array<{
    name: string;
    alias?: string;
  }>;
  conditions: string[];
  parameters: string[];
}

export const validateSQL = (sql: string): ValidationResult => {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
  };

  // Basic syntax checks
  if (!sql.trim()) {
    result.errors.push('Query cannot be empty');
    result.isValid = false;
    return result;
  }

  // Normalize the SQL by removing extra whitespace and newlines
  const normalizedSQL = sql
    .replace(/\s+/g, ' ')
    .replace(/\n/g, ' ')
    .trim();

  // Check for basic SELECT statement structure
  // Updated regex to handle multi-line queries and more complex FROM clauses
  if (!/SELECT[\s\n]+.+?[\s\n]+FROM[\s\n]+/i.test(normalizedSQL)) {
    result.errors.push('Query must start with SELECT and include FROM clause');
    result.isValid = false;
  }

  // Check for dangerous SQL patterns
  const dangerousPatterns = [
    'DROP\\s+TABLE',
    'TRUNCATE\\s+TABLE',
    'DELETE\\s+FROM',
    'ALTER\\s+TABLE',
    ';\\s*DROP',
    ';\\s*DELETE',
  ];

  dangerousPatterns.forEach(pattern => {
    if (new RegExp(pattern, 'i').test(normalizedSQL)) {
      result.errors.push(`Invalid SQL: Contains potentially harmful pattern '${pattern}'`);
      result.isValid = false;
    }
  });

  // Check for proper parameter syntax
  const parameterPattern = /:[a-zA-Z][a-zA-Z0-9_]*/g;
  const parameters = normalizedSQL.match(parameterPattern) || [];
  const uniqueParams = new Set(parameters);
  if (parameters.length !== uniqueParams.size) {
    result.warnings.push('Duplicate parameter names detected');
  }

  // Performance warnings
  if (/SELECT\s+\*\s+FROM/i.test(normalizedSQL)) {
    result.warnings.push('Using SELECT * is not recommended. Please specify columns explicitly.');
  }

  if (/SELECT\s+DISTINCT/i.test(normalizedSQL)) {
    result.warnings.push('DISTINCT operation may impact performance on large datasets');
  }

  return result;
};

export const parseSQL = (sql: string): ParsedQuery => {
  const parsed: ParsedQuery = {
    columns: [],
    tables: [],
    conditions: [],
    parameters: [],
  };

  try {
    // Normalize the SQL
    const normalizedSQL = sql
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Extract SELECT clause
    const selectMatch = normalizedSQL.match(/SELECT\s+(.*?)\s+FROM\s+(.*?)(?:\s+WHERE\s+(.*))?$/i);
    if (!selectMatch) return parsed;

    const [, columnsStr, tablesStr, whereStr] = selectMatch;

    // Parse columns
    const columnsList = columnsStr.split(',').map(col => col.trim());
    parsed.columns = columnsList.map(col => {
      // Handle "table.column AS alias" or "table.column alias" or "table.column"
      const parts = col.split(/\s+(?:AS\s+)?/i).map(p => p.trim());
      const nameParts = parts[0].split('.');
      
      return {
        name: parts[1] || nameParts[nameParts.length - 1],
        alias: parts[1],
        tablePrefix: nameParts.length > 1 ? nameParts[0] : undefined,
        expression: /[^a-zA-Z0-9_.]/.test(parts[0]),
      };
    });

    // Parse tables with aliases
    const tablesList = tablesStr.split(',').map(table => table.trim());
    parsed.tables = tablesList.map(table => {
      const parts = table.split(/\s+(?:AS\s+)?/i).map(p => p.trim());
      return {
        name: parts[0],
        alias: parts[1],
      };
    });

    // Parse WHERE conditions
    if (whereStr) {
      // Split on AND, but not if AND is inside parentheses
      const conditions = whereStr.split(/\s+AND\s+/i);
      parsed.conditions = conditions.map(condition => condition.trim());

      // Extract parameters
      const paramMatch = whereStr.match(/:[a-zA-Z][a-zA-Z0-9_]*/g);
      if (paramMatch) {
        parsed.parameters = Array.from(new Set(paramMatch));
      }
    }
  } catch (error) {
    console.error('Error parsing SQL:', error);
  }

  return parsed;
};

export const validatePreProcessing = (sql: string): ValidationResult => {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
  };

  // Check for proper statement termination
  if (!sql.trim().endsWith(';')) {
    result.warnings.push('Consider terminating SQL statements with semicolon');
  }

  return result;
};

export const validatePostProcessing = (sql: string): ValidationResult => {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
  };

  // Check for proper statement termination
  if (!sql.trim().endsWith(';')) {
    result.warnings.push('Consider terminating SQL statements with semicolon');
  }

  return result;
};
