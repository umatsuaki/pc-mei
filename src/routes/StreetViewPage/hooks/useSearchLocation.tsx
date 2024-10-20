import { useState, useCallback } from 'react';
import { getCoordinates } from '../../../libs/queryAndMutation/googleMapAPI';

const useSearchLocation = (apiKey: string) => {
    const [center, setCenter] = useState({ lat: 40.729884, lng: -73.990988 }); // 初期位置
    const [location, setLocation] = useState('');

    const handleSearch = useCallback(async () => {
        if (location) {
            try {
                const coords = await getCoordinates(location, apiKey);
                setCenter(coords);
            } catch (error) {
                console.error('座標の取得に失敗しました', error);
            }
        }
    }, [location, apiKey]);

    return {
        center,
        location,
        setLocation,
        handleSearch,
    };
};

export default useSearchLocation;
