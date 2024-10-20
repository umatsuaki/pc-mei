import React from 'react';
import { Box, Button } from '@mui/material';
import { MapControlButtonProps } from '../../../libs/types/streetView/mapControlButtonProps';

const MapControlButton: React.FC<MapControlButtonProps> = ({ moveMap, zoomMap }) => {
    return (
        <Box sx={{ 
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            marginTop: 2
        }}>
            <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: '100px 100px 100px 150px',
                gridTemplateRows: '100px 100px 100px',
                gap: '8px',
                '& .MuiButton-root': {
                    height: '100%',
                    fontSize: '1.2rem',
                    fontWeight: 'bold'
                }
            }}>
                <Box sx={{ gridColumn: '2', gridRow: '1' }}>
                    <Button 
                        fullWidth 
                        variant="contained" 
                        onClick={() => moveMap(0, 5)}
                        sx={{ backgroundColor: '#2196F3', '&:hover': { backgroundColor: '#1976D2' } }}
                    >
                        ↑<br />上へ移動
                    </Button>
                </Box>

                <Box sx={{ gridColumn: '4', gridRow: '1' }}>
                    <Button 
                        fullWidth 
                        variant="contained" 
                        onClick={() => zoomMap(1)}
                        sx={{ backgroundColor: '#4CAF50', '&:hover': { backgroundColor: '#388E3C' } }}
                    >
                        +<br />ズームイン
                    </Button>
                </Box>

                <Box sx={{ gridColumn: '1', gridRow: '2' }}>
                    <Button 
                        fullWidth 
                        variant="contained" 
                        onClick={() => moveMap(-5, 0)}
                        sx={{ backgroundColor: '#FF9800', '&:hover': { backgroundColor: '#F57C00' } }}
                    >
                        ←<br />左へ移動
                    </Button>
                </Box>

                <Box sx={{ gridColumn: '3', gridRow: '2' }}>
                    <Button 
                        fullWidth 
                        variant="contained" 
                        onClick={() => moveMap(5, 0)}
                        sx={{ backgroundColor: '#E91E63', '&:hover': { backgroundColor: '#C2185B' } }}
                    >
                        →<br />右へ移動
                    </Button>
                </Box>

                <Box sx={{ gridColumn: '2', gridRow: '3' }}>
                    <Button 
                        fullWidth 
                        variant="contained" 
                        onClick={() => moveMap(0, -5)}
                        sx={{ backgroundColor: '#9C27B0', '&:hover': { backgroundColor: '#7B1FA2' } }}
                    >
                        ↓<br />下へ移動
                    </Button>
                </Box>

                <Box sx={{ gridColumn: '4', gridRow: '3' }}>
                    <Button 
                        fullWidth 
                        variant="contained" 
                        onClick={() => zoomMap(-1)}
                        sx={{ backgroundColor: '#F44336', '&:hover': { backgroundColor: '#D32F2F' } }}
                    >
                        -<br />ズームアウト
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default MapControlButton;