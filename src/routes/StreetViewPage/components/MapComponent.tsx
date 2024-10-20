import React from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { Box, TextField, Button } from '@mui/material';
import StreetView from './StreetView';
import { MapComponentProps } from '../../../libs/types/streetView/mapComponentProps';
import useSearchLocation from '../hooks/useSearchLocation';

const MapComponent: React.FC<MapComponentProps> = ({ panoramaRef, streetViewPanorama, apiKey, heading, pitch, zoom }) => {
    const { center, location, setLocation, handleSearch } = useSearchLocation(apiKey);


    return (
        <Box>
            <Box sx={{ mb: 2 }}>
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
                mapContainerStyle={{ width: '100%', height: '400px' }}
                center={center}
                zoom={14}
                onLoad={(map) => { if (map) map.panTo(center); }}
            >
                <StreetView panoramaRef={panoramaRef} streetViewPanorama={streetViewPanorama} center={center} heading={heading} pitch={pitch} zoom={zoom} />
            </GoogleMap>
        </Box>
    );
};

export default MapComponent;
