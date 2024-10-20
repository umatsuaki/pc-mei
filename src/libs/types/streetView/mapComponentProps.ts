export interface MapComponentProps {
    panoramaRef: React.RefObject<HTMLDivElement>;
    apiKey: string;
    heading: number;
    pitch: number;
    zoom: number;
}