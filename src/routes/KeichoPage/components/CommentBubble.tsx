import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { styled } from '@mui/system';

// スタイリング用のコンテナ
const BubbleContainer = styled(Box)(({ theme, speaker }) => ({
  display: 'flex',
  flexDirection: speaker === 'agent' ? 'row' : 'row-reverse',
  alignItems: 'flex-end',
  marginBottom: theme.spacing(1),
}));

const Bubble = styled(Box)(({ theme, speaker }) => ({
  backgroundColor: speaker === 'agent' ? theme.palette.primary.main : theme.palette.grey[300],
  color: speaker === 'agent' ? theme.palette.common.white : theme.palette.text.primary,
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  maxWidth: '60%',
}));

const Timestamp = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(0.5),
}));

const CommentBubble = ({ text, speaker, timestamp, avatarSrc }) => {
  return (
    <BubbleContainer speaker={speaker}>
      {speaker === 'agent' && <Avatar src={avatarSrc} alt="Agent" />}
      <Box>
        <Bubble speaker={speaker}>
          <Typography variant="body1">{text}</Typography>
        </Bubble>
        <Timestamp variant="caption">{timestamp}</Timestamp>
      </Box>
      {speaker === 'user' && <Avatar alt="User" />}
    </BubbleContainer>
  );
};

export default CommentBubble;
