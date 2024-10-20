export interface MapControlsProps {
    moveMap: (x: number, y: number) => void;
    zoomMap: (zoomChange: number) => void;
}