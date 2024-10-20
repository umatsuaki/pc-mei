import React from 'react';
import { StreetViewProps } from '../../../libs/types/streetView/streetViewProps';
import useStreetView from '../hooks/useStreetView';

const StreetView: React.FC<StreetViewProps> = ({
    panoramaRef,
    streetViewPanorama,
    center,
    heading,
    pitch,
    zoom
}) => {
    useStreetView(panoramaRef, streetViewPanorama, center, heading, pitch, zoom);

    return <div ref={panoramaRef} style={{ width: '100%', height: '400px' }} />;
};

export default StreetView;