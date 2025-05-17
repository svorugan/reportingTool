import React, { useState } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Divider,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';

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
      id={`settings-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [settings, setSettings] = useState({
    // General Settings
    theme: 'system',
    language: 'en',
    timeZone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    
    // Notification Settings
    emailNotifications: true,
    reportCompletion: true,
    reportError: true,
    scheduleReminders: true,
    
    // Export Settings
    defaultFormat: 'pdf',
    includeTimestamp: true,
    compressionEnabled: false,
    
    // Display Settings
    rowsPerPage: '25',
    defaultView: 'list',
    showPreview: true,
  });

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // TODO: Save settings to backend
    console.log('Saving settings:', settings);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleChange}>
            <Tab label="General" />
            <Tab label="Notifications" />
            <Tab label="Export" />
            <Tab label="Display" />
          </Tabs>
        </Box>

        {/* General Settings */}
        <TabPanel value={activeTab} index={0}>
          <Typography variant="h6" gutterBottom>General Settings</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Theme</InputLabel>
              <Select
                value={settings.theme}
                onChange={(e) => handleSettingChange('theme', e.target.value)}
                label="Theme"
              >
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
                <MenuItem value="system">System</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Language</InputLabel>
              <Select
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                label="Language"
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="es">Spanish</MenuItem>
                <MenuItem value="fr">French</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Time Zone</InputLabel>
              <Select
                value={settings.timeZone}
                onChange={(e) => handleSettingChange('timeZone', e.target.value)}
                label="Time Zone"
              >
                <MenuItem value="UTC">UTC</MenuItem>
                <MenuItem value="EST">Eastern Time</MenuItem>
                <MenuItem value="PST">Pacific Time</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Date Format</InputLabel>
              <Select
                value={settings.dateFormat}
                onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                label="Date Format"
              >
                <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </TabPanel>

        {/* Notification Settings */}
        <TabPanel value={activeTab} index={1}>
          <Typography variant="h6" gutterBottom>Notification Settings</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.emailNotifications}
                  onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                />
              }
              label="Enable Email Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.reportCompletion}
                  onChange={(e) => handleSettingChange('reportCompletion', e.target.checked)}
                />
              }
              label="Report Completion Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.reportError}
                  onChange={(e) => handleSettingChange('reportError', e.target.checked)}
                />
              }
              label="Report Error Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.scheduleReminders}
                  onChange={(e) => handleSettingChange('scheduleReminders', e.target.checked)}
                />
              }
              label="Schedule Reminders"
            />
          </Box>
        </TabPanel>

        {/* Export Settings */}
        <TabPanel value={activeTab} index={2}>
          <Typography variant="h6" gutterBottom>Export Settings</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Default Export Format</InputLabel>
              <Select
                value={settings.defaultFormat}
                onChange={(e) => handleSettingChange('defaultFormat', e.target.value)}
                label="Default Export Format"
              >
                <MenuItem value="pdf">PDF</MenuItem>
                <MenuItem value="excel">Excel</MenuItem>
                <MenuItem value="csv">CSV</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={settings.includeTimestamp}
                  onChange={(e) => handleSettingChange('includeTimestamp', e.target.checked)}
                />
              }
              label="Include Timestamp in Filename"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.compressionEnabled}
                  onChange={(e) => handleSettingChange('compressionEnabled', e.target.checked)}
                />
              }
              label="Enable File Compression"
            />
          </Box>
        </TabPanel>

        {/* Display Settings */}
        <TabPanel value={activeTab} index={3}>
          <Typography variant="h6" gutterBottom>Display Settings</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Rows Per Page</InputLabel>
              <Select
                value={settings.rowsPerPage}
                onChange={(e) => handleSettingChange('rowsPerPage', e.target.value)}
                label="Rows Per Page"
              >
                <MenuItem value="10">10</MenuItem>
                <MenuItem value="25">25</MenuItem>
                <MenuItem value="50">50</MenuItem>
                <MenuItem value="100">100</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Default View</InputLabel>
              <Select
                value={settings.defaultView}
                onChange={(e) => handleSettingChange('defaultView', e.target.value)}
                label="Default View"
              >
                <MenuItem value="list">List</MenuItem>
                <MenuItem value="grid">Grid</MenuItem>
                <MenuItem value="table">Table</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={settings.showPreview}
                  onChange={(e) => handleSettingChange('showPreview', e.target.checked)}
                />
              }
              label="Show Report Preview"
            />
          </Box>
        </TabPanel>

        <Divider />
        
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined">Reset to Defaults</Button>
          <Button variant="contained" onClick={handleSave}>Save Changes</Button>
        </Box>
      </Paper>
    </Container>
  );
};
