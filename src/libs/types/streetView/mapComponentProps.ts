export type MapComponentProps = {
    panoramaRef: React.RefObject<HTMLDivElement>;
    streetViewPanorama: React.MutableRefObject<google.maps.StreetViewPanorama | null>;
    apiKey: string;
    heading: number;
    pitch: number;
    zoom: number;
}