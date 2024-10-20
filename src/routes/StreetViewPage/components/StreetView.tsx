import React, { useEffect } from 'react';
import { StreetViewProps } from '../../../libs/types/streetView/streetViewProps';

const StreetView: React.FC<StreetViewProps> = ({ 
    panoramaRef, 
    streetViewPanorama, 
    center, 
    heading, 
    pitch, 
    zoom 
}) => {
    useEffect(() => {
        if (panoramaRef.current && typeof google !== 'undefined') {
            const panorama = new google.maps.StreetViewPanorama(panoramaRef.current, {
                position: center,
                pov: {
                    heading: heading,
                    pitch: pitch
                },
                visible: true,
                zoom: zoom
            });
            
            // streetViewPanorama.currentを更新
            if (streetViewPanorama) {
                streetViewPanorama.current = panorama;
            }
        }
    }, []);  // 初回マウント時のみ実行

    // POVの更新
    useEffect(() => {
        if (streetViewPanorama?.current) {
            streetViewPanorama.current.setPov({
                heading: heading,
                pitch: pitch
            });
            streetViewPanorama.current.setZoom(zoom);
        }
    }, [heading, pitch, zoom]);

    // 位置の更新
    useEffect(() => {
        if (streetViewPanorama?.current) {
            streetViewPanorama.current.setPosition(center);
        }
    }, [center]);

    return <div ref={panoramaRef} style={{ width: '100%', height: '400px' }} />;
};

export default StreetView;