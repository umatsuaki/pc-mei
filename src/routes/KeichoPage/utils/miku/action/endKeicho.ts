import getMeboAPIResponse from "../../../../../libs/queryAndMutation/meboAPI";
import { MikuActionConfig } from "../../../../../libs/types/mikuActionConfig";
import { stopVideo } from "../../imgrec";
import { putStartButton } from "../../mikuActionUI";
import mikuSay from "./say";

/**
 * 傾聴を修了し，後片付けをする
 * @param str - 終了メッセージ
 * @param motion - モーションの種類（デフォルトは "bye"）
 * @returns Promise<void>
 */
const endKeicho = async (str: string, config: MikuActionConfig, motion: string = "bye"): Promise<void> => {
    // SpeechToTextが存在する場合は停止してnullに設定
    if (config.stt) {
        config.stt.stop();
        config.stt = null;
    }

    // 画像取得が有効な場合は動画を停止
    if (config.imgtak === true) {
        await stopVideo();
    }

    // 終了メッセージが存在する場合は発話
    if (str) {
        await mikuSay(str, config.uid, motion);
    }

    // APIに会話終了を通知
    getMeboAPIResponse("会話終了", config.uid);
    console.log("傾聴終了");

    // UIのステータスをクリア
    $("#status").html("");

    // フラグをリセット
    config.talking = false;

    // スタートボタンを表示
    putStartButton(config);
}

export default endKeicho;