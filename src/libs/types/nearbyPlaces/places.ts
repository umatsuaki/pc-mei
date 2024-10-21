import { Geometry, Photo } from "./placesAPIResponse"

export type Place = {
    formatted_address: string;
    geometry: Geometry;
    name: string;
    photos: Photo[];
}