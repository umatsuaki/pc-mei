import React, { useEffect } from 'react';
import { StreetViewProps } from '../../../libs/types/streetView/streetViewProps';

const StreetView: React.FC<StreetViewProps> = ({ panoramaRef, center, heading, pitch, zoom }) => {

    useEffect(() => {
        if (panoramaRef.current) {
            new window.google.maps.StreetViewPanorama(panoramaRef.current, {
                position: center,
                pov: {
                    heading: 265,
                    pitch: 0
                },
                visible: true
            });
        }
    }, [center, heading, pitch, zoom]);

    return <div ref={panoramaRef} style={{ width: '100%', height: '100%' }} />;
};

export default StreetView;
