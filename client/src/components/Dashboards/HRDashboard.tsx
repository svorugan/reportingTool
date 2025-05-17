import React, { useState } from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { DashboardMetric } from '../../types/Dashboard';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';

// Sample data for department distribution
const departmentData = [
  { name: 'Engineering', value: 120 },
  { name: 'Sales', value: 80 },
  { name: 'Marketing', value: 40 },
  { name: 'HR', value: 20 },
  { name: 'Finance', value: 30 },
  { name: 'Operations', value: 50 }
];

// Sample data for hiring trends
const hiringTrendsData = [
  { month: 'Jan', hires: 12, attrition: 8 },
  { month: 'Feb', hires: 15, attrition: 10 },
  { month: 'Mar', hires: 18, attrition: 7 },
  { month: 'Apr', hires: 20, attrition: 12 },
  { month: 'May', hires: 25, attrition: 9 },
  { month: 'Jun', hires: 22, attrition: 11 }
];

// Sample data for employee tenure
const tenureData = [
  { range: '0-1 yr', count: 45 },
  { range: '1-2 yrs', count: 65 },
  { range: '2-5 yrs', count: 85 },
  { range: '5-10 yrs', count: 35 },
  { range: '10+ yrs', count: 15 }
];

// Sample data for salary distribution
const salaryData = [
  { range: '30-50k', count: 25 },
  { range: '50-70k', count: 45 },
  { range: '70-90k', count: 60 },
  { range: '90-110k', count: 40 },
  { range: '110k+', count: 20 }
];

// Sample data for performance ratings
const performanceData = [
  { rating: 1, count: 5 },
  { rating: 2, count: 15 },
  { rating: 3, count: 85 },
  { rating: 4, count: 95 },
  { rating: 5, count: 45 }
];

// Sample data for experience vs salary correlation
const experienceSalaryData = [
  { experience: 1, salary: 45000, department: 'Engineering', count: 5 },
  { experience: 2, salary: 55000, department: 'Engineering', count: 8 },
  { experience: 5, salary: 85000, department: 'Engineering', count: 12 },
  { experience: 1, salary: 40000, department: 'Marketing', count: 4 },
  { experience: 3, salary: 65000, department: 'Marketing', count: 6 },
  { experience: 6, salary: 95000, department: 'Marketing', count: 3 },
  { experience: 2, salary: 50000, department: 'Sales', count: 7 },
  { experience: 4, salary: 75000, department: 'Sales', count: 9 },
  { experience: 7, salary: 105000, department: 'Sales', count: 4 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const hrMetrics: DashboardMetric[] = [
  {
    id: '1',
    name: 'Headcount',
    value: 245,
    trend: 5.2
  },
  {
    id: '2',
    name: 'Turnover Rate',
    value: '4.2%',
    trend: -1.5
  },
  {
    id: '3',
    name: 'Time to Hire',
    value: '28 days',
    trend: -2.3
  }
];

const locations = ['All', 'New York', 'San Francisco', 'London', 'Singapore'];
const departments = ['All', 'Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations'];
const jobLevels = ['All', 'Entry', 'Mid', 'Senior', 'Lead', 'Manager', 'Director'];

export const HRDashboard: React.FC = () => {
  const [location, setLocation] = useState('All');
  const [department, setDepartment] = useState('All');
  const [jobLevel, setJobLevel] = useState('All');

  const handleFilterChange = (event: SelectChangeEvent, filterType: string) => {
    const value = event.target.value;
    switch (filterType) {
      case 'location':
        setLocation(value);
        break;
      case 'department':
        setDepartment(value);
        break;
      case 'jobLevel':
        setJobLevel(value);
        break;
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        HR Analytics Dashboard
      </Typography>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Location</InputLabel>
            <Select
              value={location}
              label="Location"
              onChange={(e) => handleFilterChange(e, 'location')}
            >
              {locations.map((loc) => (
                <MenuItem key={loc} value={loc}>{loc}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Department</InputLabel>
            <Select
              value={department}
              label="Department"
              onChange={(e) => handleFilterChange(e, 'department')}
            >
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>{dept}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Job Level</InputLabel>
            <Select
              value={jobLevel}
              label="Job Level"
              onChange={(e) => handleFilterChange(e, 'jobLevel')}
            >
              {jobLevels.map((level) => (
                <MenuItem key={level} value={level}>{level}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {hrMetrics.map((metric) => (
          <Grid item xs={12} md={4} key={metric.id}>
            <Paper sx={{ p: 3 }}>
              <Typography color="text.secondary" gutterBottom>
                {metric.name}
              </Typography>
              <Typography variant="h4">
                {metric.value}
              </Typography>
              <Typography 
                color={metric.trend >= 0 ? 'success.main' : 'error.main'}
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                {metric.trend > 0 ? '+' : ''}{metric.trend}%
              </Typography>
            </Paper>
          </Grid>
        ))}
        
        {/* Department Distribution Pie Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Employee Distribution by Department
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Hiring Trends Bar Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Hiring vs Attrition Trends
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={hiringTrendsData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="hires" name="New Hires" fill="#82ca9d" />
                <Bar dataKey="attrition" name="Attrition" fill="#ff8042" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Employee Tenure Bar Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Employee Tenure Distribution
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={tenureData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Employees" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Salary Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Salary Distribution
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salaryData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Employees" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Performance Ratings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Performance Rating Distribution
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={performanceData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rating" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" name="Employees" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Experience vs Salary Correlation */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Experience vs Salary Correlation
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="experience" name="Years of Experience" unit=" years" />
                <YAxis dataKey="salary" name="Salary" unit="$" />
                <ZAxis dataKey="count" range={[50, 400]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Legend />
                <Scatter name="Engineering" data={experienceSalaryData.filter(d => d.department === 'Engineering')} fill="#8884d8" />
                <Scatter name="Marketing" data={experienceSalaryData.filter(d => d.department === 'Marketing')} fill="#82ca9d" />
                <Scatter name="Sales" data={experienceSalaryData.filter(d => d.department === 'Sales')} fill="#ffc658" />
              </ScatterChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
