import React from 'react';
import { Box, Chip } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const StatusDisplay = ({ status }) => {
    const isActive = status.includes('音声認識中') || status.includes('認識中');

    return (
        <Box mt={2} display="flex" alignItems="center">
            <Chip
                icon={isActive ? <FiberManualRecordIcon color="error" /> : null}
                label={status}
                variant="outlined"
                color={isActive ? 'error' : 'default'}
            />
        </Box>
    );
};

export default StatusDisplay;
