import { useState, useRef, useCallback } from 'react';

const useStreetViewControls = () => {
    const streetViewPanorama = useRef<google.maps.StreetViewPanorama | null>(null);
    const [heading, setHeading] = useState(255);
    const [pitch, setPitch] = useState(0);
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

    return { streetViewPanorama, heading, pitch, zoom, moveMap, zoomMap };
};

export default useStreetViewControls;
