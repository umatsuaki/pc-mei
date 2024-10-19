import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { processEvent } from "./eventProcessor";
import { MikuActionConfig } from "../../../libs/types/mikuActionConfig";

// Web socketを初期化
const initWebSocket = (config:MikuActionConfig): void => {
    const topic: string = "sensorbox.presence";
    const socket = new SockJS("https://wsapp.cs.kobe-u.ac.jp/cs27pubsub/ws");
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, (frame: any) => {
        console.log('Connected: ' + frame);
        stompClient.subscribe("/queue/" + topic, (event: any) => {
            const body: any = JSON.parse(event.body);
            console.log("Event received");
            console.log(body);
            processEvent(body, "uid", config);
        });
    }, stompFailureCallback);
}

// Web socketを再起動
const stompFailureCallback = (error: any): void => {
    console.log('STOMP: ' + error);
    setTimeout(initWebSocket, 10000);
    console.log('STOMP: Reconnecting in 10 seconds');
};

export { initWebSocket, stompFailureCallback };



