export type MapControlButtonProps = {
    moveMap: (x: number, y: number) => void;
    zoomMap: (zoomChange: number) => void;
    moveForward: (x: number) => void;
}