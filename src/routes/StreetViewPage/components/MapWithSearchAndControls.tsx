import React, { useRef, useState } from 'react';
import { Box } from '@mui/material';
import MapComponent from './MapComponent';
import MapControlButton from './MapControlButton';
import { MapWithSearchAndControlsProps } from '../../../libs/types/streetView/mapWithSearchAndControlsProps';

const MapWithSearchAndControls: React.FC<MapWithSearchAndControlsProps> = ({ panoramaRef, apiKey }) => {

    const streetViewPanorama = useRef<google.maps.StreetViewPanorama | null>(null);
    const [heading, setHeading] = useState(255);
    const [pitch, setPitch] = useState(0);
    const [zoom, setZoom] = useState(1);


    // ストリートビューの向きを変える関数
    const moveMap = (x: number, y: number) => {
        if (streetViewPanorama.current) {
            const pov = streetViewPanorama.current.getPov();
            streetViewPanorama.current.setPov({
                heading: pov.heading + x,
                pitch: pov.pitch + y,
            });
            setHeading(pov.heading + x);
            setPitch(pov.pitch + y);
        }
        console.log('heading:', heading);
        console.log('pitch:', pitch);
    };

    // ズームイン・ズームアウトの関数
    const zoomMap = (zoomChange: number) => {
        if (streetViewPanorama.current) {
            const currentZoom = streetViewPanorama.current.getZoom() || 1;
            streetViewPanorama.current.setZoom(currentZoom + zoomChange);
            setZoom(currentZoom + zoomChange);
        }
        console.log('zoom:', zoom);
    };

    return (
        <Box>
            <MapComponent panoramaRef={panoramaRef} streetViewPanorama={streetViewPanorama} apiKey={apiKey} heading={heading} pitch={pitch} zoom={zoom} />
            <MapControlButton moveMap={moveMap} zoomMap={zoomMap} />
        </Box>
    );
};

export default MapWithSearchAndControls;
