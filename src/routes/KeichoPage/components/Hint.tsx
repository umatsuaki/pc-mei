// src/components/Hint.js
import React from 'react';
import { Box, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const Hint = ({ hint }) => {
  return (
    <Box mt={2} display="flex" alignItems="center">
      <InfoOutlinedIcon color="info" />
      <Typography variant="caption" color="textSecondary" sx={{ marginLeft: 1 }}>
        {hint}
      </Typography>
    </Box>
  );
};

export default Hint;
