import React from 'react';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Slider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface FilterConfig {
  id: string;
  type: string;
  label: string;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number[];
}

interface FilterBarProps {
  filters: {
    search: string;
    category: string;
    priceRange: number[];
    company: string;
  };
  filtersConfig: FilterConfig[];
  onFilterChange: (filterId: string, value: any) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, filtersConfig, onFilterChange }) => {
  const { t } = useTranslation();

  const handleFilterChange = (filterId: string, value: any) => {
    onFilterChange(filterId, value);
  };

  const renderFilter = (filter: FilterConfig) => {
    switch (filter.type) {
      case 'text':
        return (
          <TextField
            fullWidth
            label={t(filter.label)}
            value={filters[filter.id as keyof typeof filters] || ''}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
          />
        );
      case 'select':
        return (
          <FormControl fullWidth>
            <InputLabel>{t(filter.label)}</InputLabel>
            <Select
              value={filters[filter.id as keyof typeof filters] || ''}
              onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            >
              {filter.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {t(option.label)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case 'range':
        return (
          <Box>
            <Typography gutterBottom>{t(filter.label)}</Typography>
            <Slider
              key={filter.id}
              value={filters[filter.id as keyof typeof filters] || filter.defaultValue}
              onChange={(_, newValue) => handleFilterChange(filter.id, newValue)}
              valueLabelDisplay="auto"
              min={filter.min}
              max={filter.max}
              step={filter.step}
            />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: `repeat(${filtersConfig.length}, 1fr)`, 
      gap: 2, 
      mb: 2 
    }}>
      {filtersConfig.map((filter) => (
        <Box key={filter.id}>
          {renderFilter(filter)}
        </Box>
      ))}
    </Box>
  );
};

export default FilterBar;