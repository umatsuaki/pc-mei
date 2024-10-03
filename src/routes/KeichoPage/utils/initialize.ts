// 初期化．ページがロードされると呼び出される
import { refreshAt } from "../../../libs/utils";
import { getUrlVars } from "../../../libs/utils";
import { getDialogueLogs} from "../../../libs/queryAndMutation/dialoguelogs";
import { MikuActionConfig } from "../../../libs/types/mikuActionConfig";
import { initWebSocket } from "./sensorBoxWebSocket";
import { SPEAKER } from "../../../libs/types/speaker";
import { postComment, putStartButton } from "./mikuActionUI";

const initialize = async () => {

    //ユーザ情報をセット
    const uid = getUrlVars()["uid"];

    const talking = true;

    // GETパラメータ voicerec が false であるときのみ false になる．デフォルトはtrueで．
    const voicerec = getUrlVars()["voicerec"] === "false" ? false : true;

    // GETパラメータ imgtak が false であるときのみ false になる．デフォルトはtrueで．
    const imgtak = getUrlVars()["imgtak"] === "false" ? false : true;

    // video stream をセット
    const videostm = document.getElementById("videostm") as HTMLVideoElement;

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
            postComment(dialogue.contents, SPEAKER.AGENT, "no");
        } else {
            postComment(dialogue.contents, SPEAKER.USER, "no");
        }
    }
    //開始ボタンを配置
    putStartButton(config);

    console.log("初期化完了");
}

export { initialize };



