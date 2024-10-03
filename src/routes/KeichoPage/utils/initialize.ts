

// 初期化．ページがロードされると呼び出される
import { refreshAt } from "../../../libs/utils";
import { getUrlVars } from "../../../libs/utils";
import { getDialogueLogs, postDialogueLogs } from "../../../libs/queryAndMutation/dialoguelogs";
import { MikuActionConfig } from "../../../libs/types/mikuActionConfig";
import { initWebSocket } from "./sensorBoxWebSocket";
import { SPEAKER } from "../../../libs/types/speaker";
import { putStartButton } from "./mikuActionUI";

const initialize = async () => {

    //ユーザ情報をセット
    const uid = getUrlVars()["uid"];

    const talking = true;

    // GETパラメータ voicerec が no であるときのみ false になる．デフォルトはtrueで．
    const voicerec = getUrlVars()["voicerec"] === "no" ? false : true;

    // GETパラメータ imgtak が no であるときのみ false になる．デフォルトはtrueで．
    const imgtak = getUrlVars()["imgtak"] === "no" ? false : true;

    // video stream をセット
    const videostm = document.querySelector("#videostm") as HTMLVideoElement;

    //つけっぱなしのため，1日1回リロードを仕込む
    refreshAt(0, 0, talking);

    const config: MikuActionConfig = {
        uid: uid,
        stt: null,
        voicerec: voicerec,
        imgtak: imgtak,
        audioDataIndex: 0,
        audioDataDest: "",
        imgDataIndex: 0,
        videostm: videostm,
        talking: talking
    };
    // web socket を初期化
    initWebSocket(config);

    // 当日の会話ログを再表示する
    const dialogueLogs = await getDialogueLogs(new Date(), uid);
    for (const dialogue of dialogueLogs) {
        if (dialogue.from == "keicho-bot") {
            postDialogueLogs(dialogue.contents, SPEAKER.AGENT, "no");
        } else {
            postDialogueLogs(dialogue.contents, SPEAKER.USER, "no");
        }
    }

    //開始ボタンを配置
    putStartButton(config);
}

const createScrollTracker = () => {
    let scrollYPosition: number = 0;
    let scrollYPositionPushFlag: boolean = false;
    let scrollYPositionArr: number[] = [];

    window.addEventListener("scroll", () => {
        scrollYPosition = window.scrollY;

        if (scrollYPositionPushFlag) {
            scrollYPositionArr.push(scrollYPosition);
            scrollYPositionPushFlag = false;
        }

        if (scrollYPositionArr.length > 5) {
            scrollYPositionArr.shift(); // 最初の要素を削除
        }
    });

    // 外部からフラグを制御できるようにする関数を返す
    return {
        setPushFlag: (flag: boolean) => {
            scrollYPositionPushFlag = flag;
        },
        getScrollPositions: (): number[] => {
            return scrollYPositionArr.slice(); // 配列のコピーを返す
        },
    };
}



export { initialize, createScrollTracker };



