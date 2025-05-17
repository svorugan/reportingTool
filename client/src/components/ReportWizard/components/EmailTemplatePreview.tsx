import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { styled } from '@mui/material/styles';

interface EmailTemplatePreviewProps {
  open: boolean;
  onClose: () => void;
  templateType: 'success' | 'failure';
  reportName: string;
  recipientCount: number;
  scheduleInfo?: string;
  onSaveTemplate: (template: EmailTemplate) => void;
}

export interface EmailTemplate {
  subject: string;
  body: string;
  type: 'success' | 'failure';
  variables: {
    [key: string]: string;
  };
}

const PreviewContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
  backgroundColor: '#f8f9fa',
  fontFamily: 'Arial, sans-serif',
}));

const EmailHeader = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(1, 0),
  marginBottom: theme.spacing(2),
}));

const VariableChip = styled(Button)(({ theme }) => ({
  margin: theme.spacing(0.5),
  textTransform: 'none',
  fontSize: '0.8rem',
}));

export const EmailTemplatePreview: React.FC<EmailTemplatePreviewProps> = ({
  open,
  onClose,
  templateType,
  reportName,
  recipientCount,
  scheduleInfo,
  onSaveTemplate,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [template, setTemplate] = useState<EmailTemplate>({
    subject: templateType === 'success' 
      ? `Report "${reportName}" completed successfully`
      : `Report "${reportName}" execution failed`,
    body: getDefaultTemplate(templateType, reportName, scheduleInfo),
    type: templateType,
    variables: {
      reportName,
      executionDate: '{{executionDate}}',
      executionTime: '{{executionTime}}',
      rowCount: '{{rowCount}}',
      errorDetails: '{{errorDetails}}',
      downloadLink: '{{downloadLink}}',
      scheduleInfo: scheduleInfo || '',
    },
  });

  const handleVariableClick = (variable: string) => {
    const textField = document.getElementById('email-body') as HTMLTextAreaElement;
    if (textField) {
      const start = textField.selectionStart;
      const end = textField.selectionEnd;
      const currentBody = template.body;
      const newBody = 
        currentBody.substring(0, start) +
        `{{${variable}}}` +
        currentBody.substring(end);
      
      setTemplate({
        ...template,
        body: newBody,
      });
    }
  };

  const renderPreview = () => {
    let previewContent = template.body;
    Object.entries(template.variables).forEach(([key, value]) => {
      previewContent = previewContent.replace(
        new RegExp(`{{${key}}}`, 'g'),
        value
      );
    });

    return previewContent;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Email Template - {templateType === 'success' ? 'Success' : 'Failure'} Notification
      </DialogTitle>
      <DialogContent>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="Edit" />
          <Tab label="Preview" />
        </Tabs>

        {activeTab === 0 ? (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Subject"
              value={template.subject}
              onChange={(e) => setTemplate({ ...template, subject: e.target.value })}
              margin="normal"
            />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Available Variables:
              </Typography>
              {Object.keys(template.variables).map((variable) => (
                <VariableChip
                  key={variable}
                  size="small"
                  onClick={() => handleVariableClick(variable)}
                  variant="outlined"
                >
                  {`{{${variable}}}`}
                </VariableChip>
              ))}
            </Box>

            <TextField
              id="email-body"
              fullWidth
              multiline
              rows={12}
              label="Email Body"
              value={template.body}
              onChange={(e) => setTemplate({ ...template, body: e.target.value })}
              margin="normal"
            />
          </Box>
        ) : (
          <PreviewContainer>
            <EmailHeader>
              <Typography variant="subtitle2" color="text.secondary">
                From: Reporting System &lt;reports@company.com&gt;
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                To: {recipientCount} recipient{recipientCount !== 1 ? 's' : ''}
              </Typography>
              <Typography variant="subtitle2">
                Subject: {template.subject}
              </Typography>
            </EmailHeader>
            <Typography
              component="div"
              sx={{ whiteSpace: 'pre-wrap' }}
            >
              {renderPreview()}
            </Typography>
          </PreviewContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={() => {
            onSaveTemplate(template);
            onClose();
          }}
        >
          Save Template
        </Button>
      </DialogActions>
    </Dialog>
  );
};

function getDefaultTemplate(
  type: 'success' | 'failure',
  reportName: string,
  scheduleInfo?: string
): string {
  if (type === 'success') {
    return `Hello,

The report "${reportName}" has been generated successfully.

Execution Details:
- Date: {{executionDate}}
- Time: {{executionTime}}
- Records Generated: {{rowCount}}
${scheduleInfo ? `- Schedule: ${scheduleInfo}` : ''}

You can download the report using the following link:
{{downloadLink}}

Note: This link will expire in 7 days.

Best regards,
Reporting System`;
  } else {
    return `Hello,

The report "${reportName}" execution has failed.

Execution Details:
- Date: {{executionDate}}
- Time: {{executionTime}}
${scheduleInfo ? `- Schedule: ${scheduleInfo}` : ''}

Error Details:
{{errorDetails}}

Please contact the system administrator if this issue persists.

Best regards,
Reporting System`;
  }
}
