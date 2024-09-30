import React from 'react';
import { Box } from '@mui/material';
import CommentBubble from './CommentBubble';
import LoadingBubble from './LoadingBubble';
import HelpButton from './HelpButton';
import PageEmbed from './PageEmbed';
import Hint from './Hint';

// メッセージの型定義
const MESSAGE_TYPES = {
  COMMENT: 'comment',
  LOADING: 'loading',
  HELP: 'help',
  PAGE: 'page',
  HINT: 'hint',
};

const Timeline = ({ messages }) => {
  return (
    <Box>
      {messages.map((msg) => {
        switch (msg.type) {
          case MESSAGE_TYPES.COMMENT:
            return (
              <CommentBubble
                key={msg.id}
                text={msg.text}
                speaker={msg.speaker}
                timestamp={msg.timestamp}
                avatarSrc={msg.avatarSrc}
              />
            );
          case MESSAGE_TYPES.LOADING:
            return <LoadingBubble key={msg.id} />;
          case MESSAGE_TYPES.HELP:
            return <HelpButton key={msg.id} content={msg.content} />;
          case MESSAGE_TYPES.PAGE:
            return <PageEmbed key={msg.id} url={msg.url} />;
          case MESSAGE_TYPES.HINT:
            return <Hint key={msg.id} hint={msg.hint} />;
          default:
            return null;
        }
      })}
    </Box>
  );
};

export default Timeline;
