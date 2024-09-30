import React from 'react';
import { Box, Paper } from '@mui/material';
import { styled } from '@mui/system';

const Iframe = styled('iframe')({
  width: '100%',
  height: '600px',
  border: 'none',
});

const PageEmbed = ({ url }) => {
  return (
    <Box mt={4}>
      <Paper elevation={3}>
        <Iframe src={url}>
          ページを表示できませんでした
        </Iframe>
      </Paper>
    </Box>
  );
};

export default PageEmbed;
