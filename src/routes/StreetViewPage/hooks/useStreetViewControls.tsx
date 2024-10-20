import { useState, useRef, useCallback } from 'react';

const useStreetViewControls = () => {
    const streetViewPanorama = useRef<google.maps.StreetViewPanorama | null>(null);
    const [heading, setHeading] = useState(255);
    const [pitch, setPitch] = useState(0);
    const [position, setPosition] = useState({ lat: 35.6895, lng: 139.6917 });
    const [zoom, setZoom] = useState(1);

    const moveMap = useCallback((x: number, y: number) => {
        if (streetViewPanorama.current) {
            const pov = streetViewPanorama.current.getPov();
            streetViewPanorama.current.setPov({
                heading: pov.heading + x,
                pitch: pov.pitch + y,
            });
            setHeading(pov.heading + x);
            setPitch(pov.pitch + y);
        }
    }, []);

    const zoomMap = useCallback((zoomChange: number) => {
        if (streetViewPanorama.current) {
            const currentZoom = streetViewPanorama.current.getZoom() || 1;
            streetViewPanorama.current.setZoom(currentZoom + zoomChange);
            setZoom(currentZoom + zoomChange);
        }
    }, []);

    const moveForward = useCallback((x: number) => {
        if (streetViewPanorama.current) {
            const pov = streetViewPanorama.current.getPov();
            const newPosition = google.maps.geometry.spherical.computeOffset(
                streetViewPanorama.current.getPosition() as google.maps.LatLng, // 現在の位置
                x, // 10メートル前進
                pov.heading // 現在の向きに基づいて前進
            );
            streetViewPanorama.current.setPosition(newPosition);
            setPosition({ lat: newPosition.lat(), lng: newPosition.lng() });
        }
    }, []);

    return { streetViewPanorama, heading, pitch, zoom, position, moveMap, zoomMap, moveForward };
};

export default useStreetViewControls;
