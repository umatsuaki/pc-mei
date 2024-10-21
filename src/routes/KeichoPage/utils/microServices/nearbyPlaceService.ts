import { getChatGptAnswer } from "../../../../libs/queryAndMutation/chatGPT";
import { getPlaces } from "../../../../libs/queryAndMutation/googleMapAPI";
import { NearByPlaceServiceResponse } from "../../../../libs/types/nearbyPlaces/nearByPlaceServiceResponse";
import { Place } from "../../../../libs/types/nearbyPlaces/places";
import { PlaceResult } from "../../../../libs/types/nearbyPlaces/placesAPIResponse";

const getCurrentLocation = async (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
            const location = { lat: position.coords.latitude, lng: position.coords.longitude };
            resolve(location);
        }, (error) => {
            reject(error);
        });
    });
}

const getNearByPlaceResponse = async (keyword: string) => {
    const API_KEY: string = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const radius = 50;

    let location = { lat: 34.713287, lng: 135.227195 };
    try {
        location = await getCurrentLocation();
    } catch (error) {
        console.error('現在地の取得に失敗しました', error);
    }
    console.log(location);

    const placeResponse = await getPlaces(keyword, API_KEY, location.lat, location.lng, radius);

    const places: Place[] = placeResponse.map((place: PlaceResult) => ({
        formatted_address: place.formatted_address,
        geometry: place.geometry,
        name: place.name,
        photos: place.photos
    }));

    const randomPlace = places[Math.floor(Math.random() * places.length)];

    return randomPlace;
}

const getPlaceChatGPTResponse = async (place: Place) => {
    const prompt = `
    次の場所を簡潔で魅力的に紹介してください。「${place.name}」は「${place.formatted_address}」にあります。この場所の特長や雰囲気、訪れる価値を感じる点を強調してください。読む人が行きたくなるように、魅力的な表現を使ってください。 
    一文一文の文章の長さが40文字を超える場合は「。」をつけてください。`;
    const response = await getChatGptAnswer(prompt);
    return response;
}

const runNearByPlaceService = async (keyword: string): Promise<NearByPlaceServiceResponse> => {
    const place = await getNearByPlaceResponse(keyword);
    const gptResponse = await getPlaceChatGPTResponse(place);
    const photoReference = place.photos && place.photos.length > 0
        ? place.photos[0].photo_reference
        : "";
    return { content: gptResponse.content, photoReference: photoReference };
}

export { getNearByPlaceResponse, getPlaceChatGPTResponse, runNearByPlaceService };

