import React from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { Box, TextField, Button, Typography } from '@mui/material';
import StreetView from './StreetView';
import { MapComponentProps } from '../../../libs/types/streetView/mapComponentProps';
import useSearchLocation from '../hooks/useSearchLocation';

const MapComponent: React.FC<MapComponentProps> = ({ panoramaRef, streetViewPanorama, apiKey, heading, pitch, zoom }) => {
    const { center, location, listening, transcript, showTranscript, setLocation, handleSearch, startSpeechRecognition } = useSearchLocation(apiKey);

    return (
        <Box >
            <Box >
                <TextField
                    label="場所を入力"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    variant="outlined"
                    size="small"
                />
                <Button variant="contained" onClick={handleSearch} sx={{ ml: 2 }}>
                    検索
                </Button>
            </Box>
            <GoogleMap
                mapContainerStyle={{ width: '100%', height: '350px' }}
                center={center}
                zoom={14}
                onLoad={(map) => { if (map) map.panTo(center); }}
            >
                <StreetView panoramaRef={panoramaRef} streetViewPanorama={streetViewPanorama} center={center} heading={heading} pitch={pitch} zoom={zoom} />
            </GoogleMap>
            <Button
                variant="contained"
                color={listening ? 'secondary' : 'primary'}
                onClick={startSpeechRecognition}
                sx={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mt: 4,
                    mb: 4
                }}
            >
                {listening ? (
                    <>
                        音声
                        <br />
                        認識中
                    </>
                ) : '開始'}
            </Button>
            {showTranscript && (
                <Typography variant="body1" sx={{ mb: 4 }}>
                    音声認識結果: {transcript}
                </Typography>
            )}
        </Box>
    );
};

export default MapComponent;