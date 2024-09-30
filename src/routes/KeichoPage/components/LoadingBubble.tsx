// src/components/LoadingBubble.js
import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';

const BubbleContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: theme.spacing(1),
}));

const Bubble = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  color: theme.palette.text.primary,
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  alignItems: 'center',
}));

const LoadingBubble = () => {
  return (
    <BubbleContainer>
      <Bubble>
        <CircularProgress size={20} />
        <Typography variant="body2" sx={{ marginLeft: 1 }}>
          ローディング中...
        </Typography>
      </Bubble>
    </BubbleContainer>
  );
};

export default LoadingBubble;
