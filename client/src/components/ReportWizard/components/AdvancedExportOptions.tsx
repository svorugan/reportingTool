import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  TextField,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export interface ExportOptions {
  excel: {
    includeFilters: boolean;
    autoFitColumns: boolean;
    addTotalRow: boolean;
    freezeHeaderRow: boolean;
    includeCharts: boolean;
    password?: string;
    sheetName: string;
    dateFormat: string;
    numberFormat: string;
  };
  pdf: {
    pageSize: 'A4' | 'A3' | 'Letter' | 'Legal';
    orientation: 'portrait' | 'landscape';
    includePageNumbers: boolean;
    headerText?: string;
    footerText?: string;
    watermark?: string;
    compress: boolean;
  };
  csv: {
    delimiter: ',' | ';' | '|' | 'tab';
    includeHeaders: boolean;
    encoding: 'UTF-8' | 'UTF-16' | 'ASCII';
    quoteStrings: boolean;
    lineEnding: 'CRLF' | 'LF';
  };
  html: {
    includeStyles: boolean;
    responsive: boolean;
    darkMode: boolean;
    template?: string;
  };
  json: {
    pretty: boolean;
    includeMetadata: boolean;
    dateFormat: string;
  };
}

interface AdvancedExportOptionsProps {
  options: ExportOptions;
  onChange: (options: ExportOptions) => void;
  selectedFormats: string[];
}

export const AdvancedExportOptions: React.FC<AdvancedExportOptionsProps> = ({
  options,
  onChange,
  selectedFormats,
}) => {
  const handleChange = (format: keyof ExportOptions, field: string, value: any) => {
    onChange({
      ...options,
      [format]: {
        ...options[format],
        [field]: value,
      },
    });
  };

  return (
    <Box>
      {/* Excel Options */}
      {selectedFormats.includes('excel') && (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Excel Options</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={options.excel.includeFilters}
                      onChange={(e) =>
                        handleChange('excel', 'includeFilters', e.target.checked)
                      }
                    />
                  }
                  label="Include Column Filters"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={options.excel.autoFitColumns}
                      onChange={(e) =>
                        handleChange('excel', 'autoFitColumns', e.target.checked)
                      }
                    />
                  }
                  label="Auto-fit Columns"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={options.excel.addTotalRow}
                      onChange={(e) =>
                        handleChange('excel', 'addTotalRow', e.target.checked)
                      }
                    />
                  }
                  label="Add Total Row"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={options.excel.includeCharts}
                      onChange={(e) =>
                        handleChange('excel', 'includeCharts', e.target.checked)
                      }
                    />
                  }
                  label="Include Charts"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Sheet Name"
                  value={options.excel.sheetName}
                  onChange={(e) => handleChange('excel', 'sheetName', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Password Protection (Optional)"
                  type="password"
                  value={options.excel.password || ''}
                  onChange={(e) => handleChange('excel', 'password', e.target.value)}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}

      {/* PDF Options */}
      {selectedFormats.includes('pdf') && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>PDF Options</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Page Size</InputLabel>
                  <Select
                    value={options.pdf.pageSize}
                    onChange={(e) => handleChange('pdf', 'pageSize', e.target.value)}
                    label="Page Size"
                  >
                    <MenuItem value="A4">A4</MenuItem>
                    <MenuItem value="A3">A3</MenuItem>
                    <MenuItem value="Letter">Letter</MenuItem>
                    <MenuItem value="Legal">Legal</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Orientation</InputLabel>
                  <Select
                    value={options.pdf.orientation}
                    onChange={(e) => handleChange('pdf', 'orientation', e.target.value)}
                    label="Orientation"
                  >
                    <MenuItem value="portrait">Portrait</MenuItem>
                    <MenuItem value="landscape">Landscape</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={options.pdf.includePageNumbers}
                      onChange={(e) =>
                        handleChange('pdf', 'includePageNumbers', e.target.checked)
                      }
                    />
                  }
                  label="Include Page Numbers"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Watermark (Optional)"
                  value={options.pdf.watermark || ''}
                  onChange={(e) => handleChange('pdf', 'watermark', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Header Text"
                  value={options.pdf.headerText || ''}
                  onChange={(e) => handleChange('pdf', 'headerText', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Footer Text"
                  value={options.pdf.footerText || ''}
                  onChange={(e) => handleChange('pdf', 'footerText', e.target.value)}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}

      {/* CSV Options */}
      {selectedFormats.includes('csv') && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>CSV Options</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Delimiter</InputLabel>
                  <Select
                    value={options.csv.delimiter}
                    onChange={(e) => handleChange('csv', 'delimiter', e.target.value)}
                    label="Delimiter"
                  >
                    <MenuItem value=",">Comma (,)</MenuItem>
                    <MenuItem value=";">Semicolon (;)</MenuItem>
                    <MenuItem value="|">Pipe (|)</MenuItem>
                    <MenuItem value="tab">Tab</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Encoding</InputLabel>
                  <Select
                    value={options.csv.encoding}
                    onChange={(e) => handleChange('csv', 'encoding', e.target.value)}
                    label="Encoding"
                  >
                    <MenuItem value="UTF-8">UTF-8</MenuItem>
                    <MenuItem value="UTF-16">UTF-16</MenuItem>
                    <MenuItem value="ASCII">ASCII</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={options.csv.includeHeaders}
                      onChange={(e) =>
                        handleChange('csv', 'includeHeaders', e.target.checked)
                      }
                    />
                  }
                  label="Include Headers"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={options.csv.quoteStrings}
                      onChange={(e) =>
                        handleChange('csv', 'quoteStrings', e.target.checked)
                      }
                    />
                  }
                  label="Quote String Values"
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}

      {/* JSON Options */}
      {selectedFormats.includes('json') && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>JSON Options</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={options.json.pretty}
                      onChange={(e) => handleChange('json', 'pretty', e.target.checked)}
                    />
                  }
                  label="Pretty Print"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={options.json.includeMetadata}
                      onChange={(e) =>
                        handleChange('json', 'includeMetadata', e.target.checked)
                      }
                    />
                  }
                  label="Include Metadata"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date Format"
                  value={options.json.dateFormat}
                  onChange={(e) => handleChange('json', 'dateFormat', e.target.value)}
                  placeholder="YYYY-MM-DD"
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}

      {/* HTML Options */}
      {selectedFormats.includes('html') && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>HTML Options</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={options.html.includeStyles}
                      onChange={(e) =>
                        handleChange('html', 'includeStyles', e.target.checked)
                      }
                    />
                  }
                  label="Include Styles"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={options.html.responsive}
                      onChange={(e) =>
                        handleChange('html', 'responsive', e.target.checked)
                      }
                    />
                  }
                  label="Responsive Design"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={options.html.darkMode}
                      onChange={(e) =>
                        handleChange('html', 'darkMode', e.target.checked)
                      }
                    />
                  }
                  label="Dark Mode Support"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Custom Template (HTML)"
                  value={options.html.template || ''}
                  onChange={(e) => handleChange('html', 'template', e.target.value)}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
};
