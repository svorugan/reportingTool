import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Dialog,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { WizardNavigation } from '../components/WizardNavigation';
import { AdvancedExportOptions, ExportOptions } from '../components/AdvancedExportOptions';
import { EmailTemplatePreview, EmailTemplate } from '../components/EmailTemplatePreview';
import { SchedulePattern } from '../components/SchedulePattern';
import type { SchedulePattern as SchedulePatternType } from '../components/SchedulePattern';

interface DeliveryOptionsProps {
  onNext: () => void;
  onBack: () => void;
  reportName: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`delivery-tabpanel-${index}`}
      aria-labelledby={`delivery-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const DeliveryOptions: React.FC<DeliveryOptionsProps> = ({
  onNext,
  onBack,
  reportName,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [emailTemplateOpen, setEmailTemplateOpen] = useState(false);
  const [emailTemplateType, setEmailTemplateType] = useState<'success' | 'failure'>('success');
  const [recipients, setRecipients] = useState<Array<{
    email: string;
    name?: string;
    type: 'to' | 'cc' | 'bcc';
  }>>([]);
  const [newRecipient, setNewRecipient] = useState({
    email: '',
    name: '',
    type: 'to' as const,
  });

  // State for export options
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    excel: {
      includeFilters: true,
      autoFitColumns: true,
      addTotalRow: false,
      freezeHeaderRow: true,
      includeCharts: false,
      sheetName: 'Report',
      dateFormat: 'YYYY-MM-DD',
      numberFormat: '#,##0.00',
    },
    pdf: {
      pageSize: 'A4',
      orientation: 'portrait',
      includePageNumbers: true,
      compress: true,
    },
    csv: {
      delimiter: ',',
      includeHeaders: true,
      encoding: 'UTF-8',
      quoteStrings: true,
      lineEnding: 'CRLF',
    },
    html: {
      includeStyles: true,
      responsive: true,
      darkMode: false,
    },
    json: {
      pretty: true,
      includeMetadata: true,
      dateFormat: 'YYYY-MM-DD',
    },
  });

  // State for schedule pattern
  const [schedulePattern, setSchedulePattern] = useState<SchedulePatternType>({
    type: 'once',
    timeZone: 'UTC',
    startDate: new Date().toISOString().split('T')[0],
    times: ['09:00'],
    excludeDates: [],
  });

  // State for email templates
  const [emailTemplates, setEmailTemplates] = useState<{
    success: EmailTemplate;
    failure: EmailTemplate;
  }>({
    success: {
      subject: `Report "${reportName}" completed successfully`,
      body: '',
      type: 'success',
      variables: {},
    },
    failure: {
      subject: `Report "${reportName}" execution failed`,
      body: '',
      type: 'failure',
      variables: {},
    },
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleEmailTemplateOpen = (type: 'success' | 'failure') => {
    setEmailTemplateType(type);
    setEmailTemplateOpen(true);
  };

  const handleEmailTemplateSave = (template: EmailTemplate) => {
    setEmailTemplates({
      ...emailTemplates,
      [template.type]: template,
    });
    setEmailTemplateOpen(false);
  };

  const isConfigurationValid = () => {
    // Add validation logic here
    return true;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Delivery Configuration
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} aria-label="delivery options tabs">
        <Tab label="Export Options" />
        <Tab label="Schedule" />
        <Tab label="Notifications" />
      </Tabs>

      <TabPanel value={activeTab} index={0}>
        <AdvancedExportOptions
          options={exportOptions}
          onChange={setExportOptions}
          selectedFormats={['excel', 'pdf', 'csv']} // Add logic to manage selected formats
        />
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <SchedulePattern
          pattern={schedulePattern}
          onChange={setSchedulePattern}
        />
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Recipients Management */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Recipients
            </Typography>
            
            {/* Add New Recipient Form */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <TextField
                label="Email"
                value={newRecipient.email}
                onChange={(e) => setNewRecipient(prev => ({ ...prev, email: e.target.value }))}
                size="small"
                type="email"
                sx={{ flexGrow: 1, minWidth: '200px' }}
              />
              <TextField
                label="Name (Optional)"
                value={newRecipient.name}
                onChange={(e) => setNewRecipient(prev => ({ ...prev, name: e.target.value }))}
                size="small"
                sx={{ flexGrow: 1, minWidth: '200px' }}
              />
              <FormControl size="small" sx={{ minWidth: '120px' }}>
                <InputLabel>Type</InputLabel>
                <Select
                  value={newRecipient.type}
                  onChange={(e) => setNewRecipient(prev => ({ ...prev, type: e.target.value as 'to' | 'cc' | 'bcc' }))}
                  label="Type"
                >
                  <MenuItem value="to">To</MenuItem>
                  <MenuItem value="cc">CC</MenuItem>
                  <MenuItem value="bcc">BCC</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                onClick={() => {
                  if (newRecipient.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newRecipient.email)) {
                    setRecipients(prev => [...prev, newRecipient]);
                    setNewRecipient({ email: '', name: '', type: 'to' });
                  }
                }}
                disabled={!newRecipient.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newRecipient.email)}
              >
                Add Recipient
              </Button>
            </Box>

            {/* Recipients List */}
            {recipients.length > 0 ? (
              <Box>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Recipients List
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Type</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recipients.map((recipient, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Chip
                              label={recipient.type.toUpperCase()}
                              size="small"
                              color={recipient.type === 'to' ? 'primary' : 'default'}
                            />
                          </TableCell>
                          <TableCell>{recipient.name || '-'}</TableCell>
                          <TableCell>{recipient.email}</TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setRecipients(prev => prev.filter((_, i) => i !== index));
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            ) : (
              <Typography color="textSecondary" align="center">
                No recipients added yet
              </Typography>
            )}
          </Paper>

          {/* Email Template Configuration */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Email Templates
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => handleEmailTemplateOpen('success')}
                fullWidth
              >
                Configure Success Email
              </Button>
              <Button
                variant="outlined"
                onClick={() => handleEmailTemplateOpen('failure')}
                fullWidth
              >
                Configure Failure Email
              </Button>
            </Box>
          </Paper>
        </Box>
      </TabPanel>

      {/* Email Template Dialog */}
      <Dialog
        open={emailTemplateOpen}
        onClose={() => setEmailTemplateOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <EmailTemplatePreview
          open={emailTemplateOpen}
          onClose={() => setEmailTemplateOpen(false)}
          templateType={emailTemplateType}
          reportName={reportName}
          recipientCount={recipients.length} // Add logic to get recipient count
          scheduleInfo={schedulePattern.type !== 'once' ? 'Scheduled report' : undefined}
          onSaveTemplate={handleEmailTemplateSave}
        />
      </Dialog>

      {/* Removing WizardNavigation since it's handled by parent */}
    </Box>
  );
};
