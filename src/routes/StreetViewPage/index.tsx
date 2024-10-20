import React, { useRef } from 'react';
import { LoadScript } from '@react-google-maps/api';
import { Container } from '@mui/material';
import MapWithSearchAndControls from './components/MapWithSearchAndControls';

const StreetViewPage: React.FC = () => {
    const panoramaRef = useRef<HTMLDivElement | null>(null);
    const API_KEY: string = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    return (
        <Container>
            <LoadScript googleMapsApiKey={API_KEY}>
                <MapWithSearchAndControls panoramaRef={panoramaRef} apiKey={API_KEY} />
            </LoadScript>
        </Container>
    );
}

export default StreetViewPage;
