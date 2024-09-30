import React, { useState, useEffect, useRef } from 'react';
import SockJs from 'sockjs-client';
import Stomp from 'stompjs';
import moment from './moment';
import { SpeechToText } from './stt';
import { getPersonInfo, getPersonPreference, putPersonPreference } from './youid';
import { MMD } from './mmd';
import { stopVideo } from './imgrec';

const SPEAKER = {
    AGENT: 'keicho-bot',
    USER: 'user'
};

// KeichoAppを呼び出すところをuseEffectにする
// useStateとかはjsx
const KeichoApp = () => {
    //定数でいいよ
    // const [stt, setStt] = useState(null);
    // const [mmd, setMmd] = useState(null);
    // const [uid, setUid] = useState(null);
    // const [preference, setPreference] = useState(null);
    // const [talking, setTalking] = useState(false);

    // Refs
    // ページで呼び出してhooksのなかに入れる
    const videoRef = useRef(null);
    const stompClientRef = useRef(null);

    initialize();
}

/**
 * WebSocketの初期化関数
 * センサボックスからのイベントを受信する
 */
const initWebSocket = () => {
    const topic = "sensorbox.presence";
    const socket = new SockJS("https://wsapp.cs.kobe-u.ac.jp/cs27pubsub/ws");
    const stompClient = Stomp.over(socket);
    stompClient.connect({}, (frame) => {
        console.log('Connected: ' + frame);
        stompClient.subscribe(`/queue/${topic}`, (event) => {
            const body = JSON.parse(event.body);
            console.log("Event received", body);
            processEvent(body);
        });
    }, stompFailureCallback);
    stompClientRef.current = stompClient;
};

// WebSocketのコールバック関数
const stompFailureCallback = (error) => {
    console.log('STOMP: ' + error);
    setTimeout(initWebSocket, 10000);
    console.log('STOMP: Reconnecting in 10 seconds');
};

/**
 * 会話が終わるのを待ってからリロードする関数
 */
const attemptReload = () => {
    if (talking) {
        setTimeout(attemptReload, 60 * 1000);
        return;
    }
    window.location.reload();
};

//ページリフレッシュ関数
const refreshAt = (hour, minuite) => {
    const now = new Date();
    const currentSeconds = (now.getHours() * 60 + now.getMinutes()) * 60 + now.getSeconds();
    const targetSeconds = (hour * 60 + minuite) * 60;
    const timeDifferentSeconds = targetSeconds - currentSeconds;
    if (timeDifferentSeconds < 0) timeDifferentSeconds += 24 * 60 * 60;

    console.log(`あと${timeDifferentSeconds}秒で ${hour}時${minuite}分です`);
    setTimeout(attemptReload, timeDifferentSeconds * 1000);
};


/**
 * センサボックスからのmessageを受け取って、messageの内容に応じて処理を行う関数
 * @param {string} message センサボックスからのmessage
 *  
 */
const processEvent = async (message) => {
    let sensorBoxAttribute = null;
    if (message.attributes.subject === preference.preferences.sensorbox) {
        sensorBoxAttribute = message.attributes;
        console.log("sensorBoxAttribute", sensorBoxAttribute);
    }
    else {
        return;
    }

    //イベントが受けとられたら、時刻に応じてシナリオを起動する
    if (sensorBoxAttribute != null) {
        const now = new Date();
        const hour = now.getHours();
        //個人の生活リズムの時差.6時起点から何時間ずれているか
        const driftTime = preference.preferences.drift || 0;
        switch (sensorBoxAttribute.event) {
            case "present":
                let scenarioNumber = 0;
                const adjustedHour = hour - driftTime;
                scenarioNumber = Math.floor((adjustedHour - 6) / 2 + 1);
                start_scenario(scenarioNumber);


            case "force":
                if (talking) {

                }
        }

    }
}

/**
 * Mikuが話す関数
 */
const miku_say = async(str, motion = )


/**
 * 
 * @param {string} str 
 * @param {string} motion 
 * @returns 
 */
const end_keicho = async (str, motion = "bye") => {
    if (!talking) return;

    if (sttRef.current) {
        sttRef.current.stop();
        setStt(null);
    }

    if (imgtak) {
        stopVideo(videoRef);
    }

    if (str) {
        await mmd.speak(SPEAKER.AGENT, str);
    }


}




// メイン関数
const initialize = async () => {
    mmd = new MMD("localhost:8080", "localhost:39390");
    setMmd(mmd);

    // URLパラメータからユーザIDを取得
    const urlParams = new URLSearchParams(window.location.search);
    const uid = urlParams.get("uid");
    setUid(uid);
    setVoicerec(urlParams.get("voicerec") === 'yes');
    setImgtake(urlParams.get("imgtake") === 'yes');
    setKeichoFlag(urlParams.get("keicho") === 'yes');
    setSeichoFlag(urlParams.get("seicho") === 'yes');

    // 1日1回のリロードを設定
    refreshAt(0, 0);

    //websocketの初期化
    initWebSocket();

    //当日の会話ログを再表示未実装
}


export default KeichoApp;