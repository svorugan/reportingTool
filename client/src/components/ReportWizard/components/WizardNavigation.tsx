import React from 'react';
import {
  Box,
  Button,
  LinearProgress,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

interface WizardNavigationProps {
  onNext?: () => void;
  onBack?: () => void;
  isLastStep?: boolean;
  isFirstStep?: boolean;
  loading?: boolean;
  nextDisabled?: boolean;
  nextLabel?: string;
}

export const WizardNavigation: React.FC<WizardNavigationProps> = ({
  onNext,
  onBack,
  isLastStep = false,
  isFirstStep = false,
  loading = false,
  nextDisabled = false,
  nextLabel,
}) => {
  return (
    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
      <Button
        variant="outlined"
        onClick={onBack}
        disabled={isFirstStep || loading}
        startIcon={<NavigateBeforeIcon />}
      >
        Back
      </Button>
      <Button
        variant="contained"
        onClick={onNext}
        disabled={nextDisabled || loading}
        endIcon={<NavigateNextIcon />}
      >
        {isLastStep && !nextLabel ? 'Finish' : (nextLabel || 'Next')}
      </Button>
      {loading && (
        <LinearProgress
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          }}
        />
      )}
    </Box>
  );
};
