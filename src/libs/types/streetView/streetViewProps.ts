export interface StreetViewProps {
    panoramaRef: React.RefObject<HTMLDivElement>;
    center: google.maps.LatLngLiteral;
    heading: number;
    pitch: number;
    zoom: number;
}