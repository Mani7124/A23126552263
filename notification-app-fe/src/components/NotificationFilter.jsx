// src/components/NotificationFilter.jsx
import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const NotificationFilter = ({ topN, setTopN, filterType, setFilterType }) => {
  return (
    <Box display="flex" gap={2} mb={3}>
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Top N</InputLabel>
        <Select value={topN} label="Top N" onChange={(e) => setTopN(e.target.value)}>
          <MenuItem value={5}>Top 5</MenuItem>
          <MenuItem value={10}>Top 10</MenuItem>
          <MenuItem value={15}>Top 15</MenuItem>
          <MenuItem value={20}>Top 20</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Filter Type</InputLabel>
        <Select value={filterType} label="Filter Type" onChange={(e) => setFilterType(e.target.value)}>
          <MenuItem value="All">All Types</MenuItem>
          <MenuItem value="Placement">Placements Only</MenuItem>
          <MenuItem value="Result">Results Only</MenuItem>
          <MenuItem value="Event">Events Only</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default NotificationFilter;
