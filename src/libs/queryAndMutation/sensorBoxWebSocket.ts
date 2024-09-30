import SockJS from "sockjs-client";
import Stomp from "stompjs";

// Web socketを初期化
const initWebSocket = (): void => {
    const topic: string = "sensorbox.presence";
    const socket = new SockJS("https://wsapp.cs.kobe-u.ac.jp/cs27pubsub/ws");
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, (frame: any) => {
        console.log('Connected: ' + frame);
        stompClient.subscribe("/queue/" + topic, (event: any) => {
            const body: any = JSON.parse(event.body);
            console.log("Event received");
            console.log(body);
            processEvent(body);
        });
    }, stompFailureCallback);
}

// Web socketを再起動
const stompFailureCallback = (error: any): void => {
    console.log('STOMP: ' + error);
    setTimeout(initWebSocket, 10000);
    console.log('STOMP: Reconnecting in 10 seconds');
};




