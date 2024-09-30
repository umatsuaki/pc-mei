import React from 'react';
import { Box, Button, Typography } from '@mui/material';

function Status() {
  const handleStart = () => {
    // シナリオ開始ロジックをここに追加
    console.log('シナリオ開始');
  };

  return (
    <Box textAlign="center" mt={2}>
      <Button variant="contained" color="primary" onClick={handleStart}>
        メイちゃんと話す
      </Button>
      <Typography variant="caption" display="block" mt={1}>
        【ヒント】「メニュー」と話しかけると，できることの一覧を表示します！
      </Typography>
    </Box>
  );
}

export default Status;
