import React from 'react';
import { Box, Button } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';

const SpeechControls = ({ onStart, onStop, isListening }) => {
  return (
    <Box mt={2} textAlign="center">
      {!isListening ? (
        <Button
          variant="contained"
          color="primary"
          startIcon={<MicIcon />}
          onClick={onStart}
        >
          音声認識開始
        </Button>
      ) : (
        <Button
          variant="contained"
          color="secondary"
          startIcon={<StopIcon />}
          onClick={onStop}
        >
          音声認識停止
        </Button>
      )}
    </Box>
  );
};

export default SpeechControls;
