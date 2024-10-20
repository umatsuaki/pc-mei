import { useState, useCallback, useEffect, useRef } from 'react';
import { getCoordinates } from '../../../libs/queryAndMutation/googleMapAPI';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { goToKeicho } from '../../../libs/utils';

const useSearchLocation = (apiKey: string) => {
    const [center, setCenter] = useState({ lat: 35.6895, lng: 139.6917 });
    const [location, setLocation] = useState('');
    const [showTranscript, setShowTranscript] = useState(false);
    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
    const silenceTimer = useRef<NodeJS.Timeout | null>(null);
    const lastTranscriptRef = useRef('');

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

    const startSpeechRecognition = useCallback(() => {
        if (!browserSupportsSpeechRecognition) {
            console.log('このブラウザは音声認識をサポートしていません。');
            return;
        }

        resetTranscript();
        lastTranscriptRef.current = '';
        SpeechRecognition.startListening({
            continuous: true,
            language: 'ja-JP'
        });

        // 30秒後に音声認識を停止するタイマーをセット
        silenceTimer.current = setTimeout(() => {
            SpeechRecognition.stopListening();
        }, 30000);
    }, [resetTranscript, browserSupportsSpeechRecognition]);

    useEffect(() => {
        if (listening) {
            if (transcript !== lastTranscriptRef.current) {
                lastTranscriptRef.current = transcript;
                if (silenceTimer.current) {
                    clearTimeout(silenceTimer.current);
                }
                silenceTimer.current = setTimeout(() => {
                    SpeechRecognition.stopListening();
                }, 3000); // 3秒間無音が続いたら停止
            }
        } else if (transcript.length > 0) {
            setLocation(transcript);
        }

        // クリーンアップ関数
        return () => {
            if (silenceTimer.current) {
                clearTimeout(silenceTimer.current);
            }
        };
    }, [transcript, listening]);

    useEffect(() => {
        if (location) {
            handleSearch();
        }
    }, [location, handleSearch]);

    useEffect(() => {
        if (transcript) {
            setShowTranscript(true);
            const timer = setTimeout(() => {
                setShowTranscript(false);
            }, 3000); // 3秒後に音声認識結果を非表示にする

            return () => clearTimeout(timer);
        }
    }, [transcript]);

    // 「終わり」という文字が含まれていたら傾聴ページに遷移する
    useEffect(() => {
        if (transcript.includes('終わり')) {
            goToKeicho();
        }
    }, [transcript]);

    return {
        center,
        location,
        listening,
        transcript,
        showTranscript,
        setLocation,
        handleSearch,
        startSpeechRecognition,
    };
};

export default useSearchLocation;