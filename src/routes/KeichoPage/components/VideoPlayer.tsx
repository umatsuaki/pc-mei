import React from 'react';
import { Box, Paper } from '@mui/material';

const VideoPlayer = ({ src }) => {
  return (
    <Box mt={4}>
      <Paper elevation={3}>
        <iframe
          title="Embedded Page"
          src={src} // 動的にURLを変更
          width="100%"
          height="600"
          style={{ border: 'none' }}
        >
          ページを表示できませんでした
        </iframe>
      </Paper>
    </Box>
  );
};

export default VideoPlayer;
