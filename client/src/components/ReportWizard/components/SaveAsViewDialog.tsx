import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Alert,
  Box,
  FormControlLabel,
  Switch,
} from '@mui/material';

interface SaveAsViewDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (viewName: string, replaceExisting: boolean) => Promise<void>;
  query: string;
}

export const SaveAsViewDialog: React.FC<SaveAsViewDialogProps> = ({
  open,
  onClose,
  onSave,
  query,
}) => {
  const [viewName, setViewName] = useState('');
  const [replaceExisting, setReplaceExisting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!viewName.trim()) {
      setError('View name is required');
      return;
    }

    // Basic view name validation
    if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(viewName)) {
      setError('View name must start with a letter and contain only letters, numbers, and underscores');
      return;
    }

    setError(null);
    setIsSaving(true);

    try {
      await onSave(viewName, replaceExisting);
      setViewName('');
      setReplaceExisting(false);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create view');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Save as Database View</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Create a database view from your query for easier reuse and better performance.
          </Typography>

          <TextField
            fullWidth
            label="View Name"
            value={viewName}
            onChange={(e) => setViewName(e.target.value)}
            margin="normal"
            error={!!error}
            helperText={error}
            disabled={isSaving}
          />

          <FormControlLabel
            control={
              <Switch
                checked={replaceExisting}
                onChange={(e) => setReplaceExisting(e.target.checked)}
                disabled={isSaving}
              />
            }
            label="Replace if view exists"
          />

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
            Preview:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={`CREATE ${replaceExisting ? 'OR REPLACE ' : ''}VIEW ${viewName} AS\n${query}`}
            InputProps={{ readOnly: true }}
            sx={{
              fontFamily: 'monospace',
              '& .MuiInputBase-input': {
                fontFamily: 'monospace',
              }
            }}
          />

          <Alert severity="info" sx={{ mt: 2 }}>
            View names must start with a letter and can only contain letters, numbers, and underscores.
          </Alert>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={isSaving || !viewName.trim()}
        >
          {isSaving ? 'Creating View...' : 'Create View'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
