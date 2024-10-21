export type Geometry = {
    location: {
        lat: number;
        lng: number;
    };
    viewport: {
        northeast: {
            lat: number;
            lng: number;
        };
        southwest: {
            lat: number;
            lng: number;
        };
    };
};

export type Photo = {
    height: number;
    html_attributions: string[];
    photo_reference: string;
    width: number;
};

export type OpeningHours = {
    open_now: boolean;
};

export type PlusCode = {
    compound_code: string;
    global_code: string;
};

export type PlaceResult = {
    business_status: string;
    formatted_address: string;
    geometry: Geometry;
    icon: string;
    icon_background_color: string;
    icon_mask_base_uri: string;
    name: string;
    opening_hours: OpeningHours;
    photos: Photo[];
    place_id: string;
    plus_code: PlusCode;
    price_level: number;
    rating: number;
    reference: string;
    types: string[];
    user_ratings_total: number;
};

export type PlacesApiResponse = {
    html_attributions: string[];
    next_page_token: string;
    results: PlaceResult[];
};
