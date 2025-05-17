import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Select,
  MenuItem,
  TextField,
  Grid,
  Checkbox,
  InputLabel,
  Paper,
  Chip,
  Button,
  Tooltip,
  IconButton,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export interface SchedulePattern {
  type: 'once' | 'daily' | 'weekly' | 'monthly' | 'custom';
  dailyPattern?: {
    everyNDays: number;
    workdaysOnly: boolean;
  };
  weeklyPattern?: {
    everyNWeeks: number;
    daysOfWeek: number[];
  };
  monthlyPattern?: {
    type: 'dayOfMonth' | 'dayOfWeek';
    dayOfMonth?: number;
    weekOccurrence?: 'first' | 'second' | 'third' | 'fourth' | 'last';
    dayOfWeek?: number;
    months: number[];
  };
  customPattern?: {
    cron: string;
  };
  timeZone: string;
  startDate: string;
  endDate?: string;
  times: string[];
  excludeDates: string[];
}

interface SchedulePatternProps {
  pattern: SchedulePattern;
  onChange: (pattern: SchedulePattern) => void;
}

export const SchedulePattern: React.FC<SchedulePatternProps> = ({
  pattern,
  onChange,
}) => {
  const [newTime, setNewTime] = useState('');
  const [newExcludeDate, setNewExcludeDate] = useState('');

  const handleChange = (field: string, value: any) => {
    onChange({
      ...pattern,
      [field]: value,
    });
  };

  const addTime = () => {
    if (newTime && !pattern.times.includes(newTime)) {
      handleChange('times', [...pattern.times, newTime]);
      setNewTime('');
    }
  };

  const removeTime = (time: string) => {
    handleChange(
      'times',
      pattern.times.filter((t) => t !== time)
    );
  };

  const addExcludeDate = () => {
    if (newExcludeDate && !pattern.excludeDates.includes(newExcludeDate)) {
      handleChange('excludeDates', [...pattern.excludeDates, newExcludeDate]);
      setNewExcludeDate('');
    }
  };

  const removeExcludeDate = (date: string) => {
    handleChange(
      'excludeDates',
      pattern.excludeDates.filter((d) => d !== date)
    );
  };

  return (
    <Box>
      {/* Pattern Type Selection */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Schedule Pattern
        </Typography>
        <RadioGroup
          value={pattern.type}
          onChange={(e) => handleChange('type', e.target.value)}
        >
          <FormControlLabel value="once" control={<Radio />} label="Once" />
          <FormControlLabel value="daily" control={<Radio />} label="Daily" />
          <FormControlLabel value="weekly" control={<Radio />} label="Weekly" />
          <FormControlLabel value="monthly" control={<Radio />} label="Monthly" />
          <FormControlLabel value="custom" control={<Radio />} label="Custom (Cron)" />
        </RadioGroup>
      </Paper>

      {/* Pattern Details */}
      <Paper sx={{ p: 2, mb: 2 }}>
        {pattern.type === 'daily' && (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Every N Days"
                value={pattern.dailyPattern?.everyNDays || 1}
                onChange={(e) =>
                  handleChange('dailyPattern', {
                    ...pattern.dailyPattern,
                    everyNDays: parseInt(e.target.value),
                  })
                }
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={pattern.dailyPattern?.workdaysOnly || false}
                    onChange={(e) =>
                      handleChange('dailyPattern', {
                        ...pattern.dailyPattern,
                        workdaysOnly: e.target.checked,
                      })
                    }
                  />
                }
                label="Workdays Only (Mon-Fri)"
              />
            </Grid>
          </Grid>
        )}

        {pattern.type === 'weekly' && (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Every N Weeks"
                value={pattern.weeklyPattern?.everyNWeeks || 1}
                onChange={(e) =>
                  handleChange('weeklyPattern', {
                    ...pattern.weeklyPattern,
                    everyNWeeks: parseInt(e.target.value),
                  })
                }
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Days of Week
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                  (day, index) => (
                    <Chip
                      key={day}
                      label={day}
                      onClick={() => {
                        const days = pattern.weeklyPattern?.daysOfWeek || [];
                        const newDays = days.includes(index)
                          ? days.filter((d) => d !== index)
                          : [...days, index];
                        handleChange('weeklyPattern', {
                          ...pattern.weeklyPattern,
                          daysOfWeek: newDays,
                        });
                      }}
                      color={
                        pattern.weeklyPattern?.daysOfWeek?.includes(index)
                          ? 'primary'
                          : 'default'
                      }
                    />
                  )
                )}
              </Box>
            </Grid>
          </Grid>
        )}

        {pattern.type === 'monthly' && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <RadioGroup
                value={pattern.monthlyPattern?.type || 'dayOfMonth'}
                onChange={(e) =>
                  handleChange('monthlyPattern', {
                    ...pattern.monthlyPattern,
                    type: e.target.value,
                  })
                }
              >
                <FormControlLabel
                  value="dayOfMonth"
                  control={<Radio />}
                  label="Day of Month"
                />
                <FormControlLabel
                  value="dayOfWeek"
                  control={<Radio />}
                  label="Day of Week"
                />
              </RadioGroup>
            </Grid>

            {pattern.monthlyPattern?.type === 'dayOfMonth' ? (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Day of Month"
                  value={pattern.monthlyPattern?.dayOfMonth || 1}
                  onChange={(e) =>
                    handleChange('monthlyPattern', {
                      ...pattern.monthlyPattern,
                      dayOfMonth: parseInt(e.target.value),
                    })
                  }
                  InputProps={{ inputProps: { min: 1, max: 31 } }}
                />
              </Grid>
            ) : (
              <Grid item xs={12} container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Week Occurrence</InputLabel>
                    <Select
                      value={pattern.monthlyPattern?.weekOccurrence || 'first'}
                      onChange={(e) =>
                        handleChange('monthlyPattern', {
                          ...pattern.monthlyPattern,
                          weekOccurrence: e.target.value,
                        })
                      }
                      label="Week Occurrence"
                    >
                      <MenuItem value="first">First</MenuItem>
                      <MenuItem value="second">Second</MenuItem>
                      <MenuItem value="third">Third</MenuItem>
                      <MenuItem value="fourth">Fourth</MenuItem>
                      <MenuItem value="last">Last</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Day of Week</InputLabel>
                    <Select
                      value={pattern.monthlyPattern?.dayOfWeek || 0}
                      onChange={(e) =>
                        handleChange('monthlyPattern', {
                          ...pattern.monthlyPattern,
                          dayOfWeek: e.target.value as number,
                        })
                      }
                      label="Day of Week"
                    >
                      <MenuItem value={0}>Sunday</MenuItem>
                      <MenuItem value={1}>Monday</MenuItem>
                      <MenuItem value={2}>Tuesday</MenuItem>
                      <MenuItem value={3}>Wednesday</MenuItem>
                      <MenuItem value={4}>Thursday</MenuItem>
                      <MenuItem value={5}>Friday</MenuItem>
                      <MenuItem value={6}>Saturday</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            )}

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Months
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {[
                  'Jan',
                  'Feb',
                  'Mar',
                  'Apr',
                  'May',
                  'Jun',
                  'Jul',
                  'Aug',
                  'Sep',
                  'Oct',
                  'Nov',
                  'Dec',
                ].map((month, index) => (
                  <Chip
                    key={month}
                    label={month}
                    onClick={() => {
                      const months = pattern.monthlyPattern?.months || [];
                      const newMonths = months.includes(index + 1)
                        ? months.filter((m) => m !== index + 1)
                        : [...months, index + 1];
                      handleChange('monthlyPattern', {
                        ...pattern.monthlyPattern,
                        months: newMonths,
                      });
                    }}
                    color={
                      pattern.monthlyPattern?.months?.includes(index + 1)
                        ? 'primary'
                        : 'default'
                    }
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        )}

        {pattern.type === 'custom' && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Cron Expression"
                value={pattern.customPattern?.cron || ''}
                onChange={(e) =>
                  handleChange('customPattern', {
                    cron: e.target.value,
                  })
                }
                placeholder="* * * * *"
                helperText="Cron format: minute hour day-of-month month day-of-week"
              />
            </Grid>
          </Grid>
        )}
      </Paper>

      {/* Time Selection */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Execution Times
          <Tooltip title="Add multiple execution times for each scheduled day">
            <IconButton size="small">
              <HelpOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            size="small"
          />
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={addTime}
            disabled={!newTime}
          >
            Add
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {pattern.times.map((time) => (
            <Chip
              key={time}
              label={time}
              onDelete={() => removeTime(time)}
              size="small"
            />
          ))}
        </Box>
      </Paper>

      {/* Date Range and Exclusions */}
      <Paper sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="Start Date"
              value={pattern.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="End Date (Optional)"
              value={pattern.endDate || ''}
              onChange={(e) => handleChange('endDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Exclude Dates
              <Tooltip title="Add dates to exclude from the schedule (e.g., holidays)">
                <IconButton size="small">
                  <HelpOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                type="date"
                value={newExcludeDate}
                onChange={(e) => setNewExcludeDate(e.target.value)}
                size="small"
                InputLabelProps={{ shrink: true }}
              />
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={addExcludeDate}
                disabled={!newExcludeDate}
              >
                Add
              </Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {pattern.excludeDates.map((date) => (
                <Chip
                  key={date}
                  label={date}
                  onDelete={() => removeExcludeDate(date)}
                  size="small"
                />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Time Zone</InputLabel>
              <Select
                value={pattern.timeZone}
                onChange={(e) => handleChange('timeZone', e.target.value)}
                label="Time Zone"
              >
                <MenuItem value="UTC">UTC</MenuItem>
                <MenuItem value="America/New_York">Eastern Time</MenuItem>
                <MenuItem value="America/Chicago">Central Time</MenuItem>
                <MenuItem value="America/Denver">Mountain Time</MenuItem>
                <MenuItem value="America/Los_Angeles">Pacific Time</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};
