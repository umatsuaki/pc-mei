import React from 'react';
import { Box, Button } from '@mui/material';
import { MapControlsProps } from '../../../libs/types/streetView/mapControlsProps';


const MapControls: React.FC<MapControlsProps> = ({ moveMap, zoomMap }) => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
            {/* 移動ボタン */}
            <Button variant="contained" onClick={() => moveMap(-100, 0)}>← 左へ移動</Button>
            <Button variant="contained" onClick={() => moveMap(100, 0)}>→ 右へ移動</Button>
            <Button variant="contained" onClick={() => moveMap(0, -100)}>↑ 上へ移動</Button>
            <Button variant="contained" onClick={() => moveMap(0, 100)}>↓ 下へ移動</Button>

            {/* ズームボタン */}
            <Button variant="contained" onClick={() => zoomMap(1)}>+ ズームイン</Button>
            <Button variant="contained" onClick={() => zoomMap(-1)}>- ズームアウト</Button>
        </Box>
    );
};

export default MapControls;
