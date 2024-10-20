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

export { getCoordinates };