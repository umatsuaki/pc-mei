export type StreetViewProps = {
    panoramaRef: React.RefObject<HTMLDivElement>;
    streetViewPanorama: React.MutableRefObject<google.maps.StreetViewPanorama | null>;
    center: google.maps.LatLngLiteral;
    heading: number;
    pitch: number;
    zoom: number;
}