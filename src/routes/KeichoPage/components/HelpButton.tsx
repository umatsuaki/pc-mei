import React, { useState } from 'react';
import { Box, Button, Typography, Collapse, Paper } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const HelpButton = ({ content }) => {
  const [open, setOpen] = useState(false);

  return (
    <Box mt={2} textAlign="center">
      <Button
        variant="outlined"
        startIcon={<HelpOutlineIcon />}
        onClick={() => setOpen(!open)}
      >
        Help
      </Button>
      <Collapse in={open}>
        <Paper elevation={3} sx={{ mt: 2, p: 2 }}>
          <Typography variant="body2">{content}</Typography>
        </Paper>
      </Collapse>
    </Box>
  );
};

export default HelpButton;
