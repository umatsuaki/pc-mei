/**
 * ミクちゃんが与えられた質問で尋ね，音声認識で得られた回答を返す．Promiseが返る．
 * @param str 質問文字列
 * @param confirm 確認フラグ．デフォルトは無効
 * @param motion 質問時のモーション
 * @returns ユーザーの回答文字列を返すプロミス
 */

import { SPEAKER } from "../../../../../libs/types/speaker";
import { MikuActionConfig } from "../../../../../libs/types/mikuActionConfig";
import SpeechToText from "../../speechToText";
import mikuSay from "./say";
import endKeicho from "./endKeicho";
import saveAndDisplayDialogue from "../dialogueManager";

const mikuAsk = async (
    str: string,
    config: MikuActionConfig,
    motion: string = "smile",
): Promise<string | void> => {

    const handleForcedTermination = () => {
        if (config.talking) {
            console.log("強制終了");
            endKeicho("", config, "bye");
            location.reload();
        }
    };

    // 音声データのインデックスをインクリメント
    if (config.voicerec === true) {
        config.audioDataIndex++;
    }

    // 画像データのインデックスをインクリメント
    if (config.imgtak === true) {
        config.imgDataIndex++;
    }

    // talkingがfalseの場合は何もしない
    if (!config.talking) {
        return;
    }


    await mikuSay(str, config.uid, motion);

    // 2分間発話が無ければ強制終了
    const id: number = window.setTimeout(handleForcedTermination, 2 * 60 * 1000);
    let answer: string = "";

    do {
        const promise: Promise<string> = new Promise((resolve) => {
            if (config.stt !== null) {
                // 音声認識オブジェクトを一旦開放
                config.stt.stop();
                config.stt = null;
            }
            config.stt = new SpeechToText("ja",
                resolve,
                false,
                document.getElementById("status"),
                config.voicerec,
                config.imgtak,
                config.audioDataIndex,
                config.audioDataDest,
                config.imgDataIndex,
                config.videostm);

            config.stt.start();
        });

        // ユーザーからの回答を待機
        answer = await promise;
    } while (answer.length === 0);

    saveAndDisplayDialogue(answer, SPEAKER.USER, config.uid);
    clearTimeout(id);
    return answer;
}

export default mikuAsk;
