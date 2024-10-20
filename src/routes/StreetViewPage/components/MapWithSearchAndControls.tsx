import React from 'react';
import { Box } from '@mui/material';
import MapComponent from './MapComponent';
import MapControlButton from './MapControlButton';
import { MapWithSearchAndControlsProps } from '../../../libs/types/streetView/mapWithSearchAndControlsProps';
import useStreetViewControls from '../hooks/useStreetViewControls';

const MapWithSearchAndControls: React.FC<MapWithSearchAndControlsProps> = ({ panoramaRef, apiKey }) => {

    const { streetViewPanorama, heading, pitch, zoom, moveMap, zoomMap, moveForward } = useStreetViewControls();

    return (
        <Box>
            <MapComponent panoramaRef={panoramaRef} streetViewPanorama={streetViewPanorama} apiKey={apiKey} heading={heading} pitch={pitch} zoom={zoom} />
            <MapControlButton moveMap={moveMap} zoomMap={zoomMap} moveForward={moveForward} />
        </Box>
    );
};

export default MapWithSearchAndControls;
