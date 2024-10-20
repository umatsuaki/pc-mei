import React, { useRef, useState } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { Box, TextField, Button } from '@mui/material';
import StreetView from './StreetView';
import { getCoordinates } from '../../../libs/queryAndMutation/googleMapAPI';
import { MapComponentProps } from '../../../libs/types/streetView/mapComponentProps';

const containerStyle = {
    width: '100%',
    height: '400px'
};

const defaultCenter = {
    lat: 40.729884,
    lng: -73.990988
};

const MapComponent: React.FC<MapComponentProps> = ({ panoramaRef, apiKey, heading, pitch, zoom }) => {
    const [center, setCenter] = useState(defaultCenter);
    const [location, setLocation] = useState('');
    const mapRef = useRef<google.maps.Map | null>(null);

    // 場所の検索を処理する関数
    const handleSearch = async () => {
        if (location) {
            try {
                const coords = await getCoordinates(location, apiKey);
                console.log('座標:', coords);
                setCenter(coords);
                if (mapRef.current) {
                    mapRef.current.panTo(coords); // 検索した場所に移動
                }
            } catch (error) {
                console.error('座標の取得に失敗しました', error);
            }
        }
    };

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
                mapContainerStyle={containerStyle}
                center={center}
                zoom={14}
                onLoad={(map) => { mapRef.current = map; }} // Google Map インスタンスを保持
            >
                <StreetView panoramaRef={panoramaRef} center={center} heading={heading} pitch={pitch} zoom={zoom} />
            </GoogleMap>
        </Box>
    );
};

export default MapComponent;
