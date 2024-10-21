// Geocoding APIを使って座標を取得する関数
const getCoordinates = async (address: string, apiKey: string) => {
    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
        );
        const data = await response.json();
        if (data.status === 'OK') {
            const { lat, lng } = data.results[0].geometry.location;
            return { lat, lng };
        } else {
            console.error('Geocoding API エラー:', data.status);
            throw new Error(data.status);
        }
    } catch (error) {
        console.error('Geocoding APIの取得エラー:', error);
        throw error;
    }
};

//PlacesAPIを使って場所の候補を取得する関数
const getPlaces = async (query: string, apiKey: string, lat: number, lng: number, radius: number) => {
    try {
        const response = await fetch(
            `https://wsapp.cs.kobe-u.ac.jp/matsuaki-map-api/places/?query=${encodeURIComponent(query)}&lat=${lat}&lng=${lng}&radius=${radius}&api_key=${apiKey}`
        );
        console.log(response);
        const data = await response.json();
        const results = data.results;
        return results;
    } catch (error) {
        console.error('Places APIの取得エラー:', error);
        throw error;
    }
}


export { getCoordinates, getPlaces };