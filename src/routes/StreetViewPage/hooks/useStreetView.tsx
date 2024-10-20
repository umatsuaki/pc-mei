import { useEffect } from 'react';

const useStreetView = (
    panoramaRef: React.RefObject<HTMLDivElement>,
    streetViewPanorama: React.MutableRefObject<google.maps.StreetViewPanorama | null>,
    center: google.maps.LatLngLiteral,
    heading: number,
    pitch: number,
    zoom: number
) => {

    useEffect(() => {
        if (panoramaRef.current) {
            const panorama = new google.maps.StreetViewPanorama(panoramaRef.current, {
                position: center,
                pov: { heading, pitch },
                visible: true,
                zoom
            });
            streetViewPanorama.current = panorama;
        }
    }, []);

    useEffect(() => {
        if (streetViewPanorama.current) {
            streetViewPanorama.current.setPov({ heading, pitch });
            streetViewPanorama.current.setZoom(zoom);
        }
    }, [heading, pitch, zoom]);

    useEffect(() => {
        if (streetViewPanorama.current) {
            streetViewPanorama.current.setPosition(center);
        }
    }, [center]);

    return streetViewPanorama;
};

export default useStreetView;
