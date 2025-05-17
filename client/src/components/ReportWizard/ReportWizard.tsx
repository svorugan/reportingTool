import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { BasicDetails } from './steps/BasicDetails';
import { QueryInput } from './steps/QueryInput';
import { ColumnSelection } from './steps/ColumnSelection';
import { DeliveryOptions } from './steps/DeliveryOptions';
import { DataSourceSelection } from './steps/DataSourceSelection';

const steps = ['Data Source', 'Basic Details', 'SQL Query', 'Column Configuration', 'Delivery Options'];

interface ReportWizardProps {
  onClose: () => void;
}

export const ReportWizard: React.FC<ReportWizardProps> = ({ onClose }) => {
  const [activeStep, setActiveStep] = useState(0);

  const initialState = {
    dataSource: {
      id: '',
      name: '',
      type: '',
    },
    basicDetails: {
      name: '',
      description: '',
      category: '',
    },
    query: '',
    columns: [] as Array<{
      name: string;
      include: boolean;
      isParameter: boolean;
      parameterType?: 'text' | 'number' | 'date' | 'select';
      parameterDefault?: string;
      alias?: string;
    }>,
  };

  const [reportData, setReportData] = useState(initialState);
  const [isStepValid, setIsStepValid] = useState(false);

  useEffect(() => {
    validateCurrentStep();
  }, [activeStep, reportData]);

  const validateCurrentStep = () => {
    let isValid = false;
    switch (activeStep) {
      case 0: // Data Source
        isValid = Boolean(reportData.dataSource.id);
        break;
      case 1: // Basic Details
        isValid = Boolean(reportData.basicDetails.name && reportData.basicDetails.category);
        break;
      case 2: // Query
        isValid = Boolean(reportData.query);
        break;
      case 3: // Columns
        isValid = reportData.columns.some(col => col.include);
        break;
      case 4: // Delivery
        isValid = true; // Delivery options are optional
        break;
      default:
        isValid = false;
    }
    setIsStepValid(isValid);
  };

  const handleNext = () => {
    if (isStepValid) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleFinish = () => {
    // TODO: Save report data
    console.log('Report Data:', reportData);
    onClose();
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <DataSourceSelection
            selectedDataSource={reportData.dataSource}
            onChange={(dataSource) => {
              setReportData((prev) => ({ ...prev, dataSource }));
              // Automatically advance to next step when data source is selected
              if (dataSource.id) {
                handleNext();
              }
            }}
          />
        );
      case 1:
        return (
          <BasicDetails
            data={reportData.basicDetails}
            onUpdate={(basicDetails) =>
              setReportData((prev) => ({ ...prev, basicDetails }))
            }
          />
        );
      case 2:
        return (
          <QueryInput
            query={reportData.query}
            dataSource={reportData.dataSource}
            onUpdate={(query, columns) =>
              setReportData((prev) => ({ 
                ...prev, 
                query,
                columns: columns.map(col => ({
                  name: col.name,
                  include: true,
                  isParameter: false,
                  alias: col.alias
                }))
              }))
            }
          />
        );
      case 3:
        return (
          <ColumnSelection
            columns={reportData.columns}
            onUpdate={(columns) =>
              setReportData((prev) => ({ ...prev, columns }))
            }
          />
        );
      case 4:
        return <DeliveryOptions />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Box sx={{ mt: 2, mb: 4 }}>
        {getStepContent(activeStep)}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Back
        </Button>
        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleFinish}
            disabled={!isStepValid}
          >
            Finish
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!isStepValid}
          >
            Next
          </Button>
        )}
      </Box>
    </Box>
  );
};
