/**
 * ミクちゃんが与えられた質問で尋ね，音声認識で得られた回答を返す．Promiseが返る．
 * @param str 質問文字列
 * @param confirm 確認フラグ．デフォルトは無効
 * @param motion 質問時のモーション
 * @returns ユーザーの回答文字列を返すプロミス
 */

import { SPEAKER } from "../../../../../libs/types/speaker";
import { Person } from "../../../../../libs/types/person";
import SpeechToText from "../../speechToText";

declare function miku_say(str: string, motion: string): Promise<void>;
declare function post_keicho(str: string, speaker: SPEAKER, person: Person): void;
declare function end_keicho(str: string): void;
declare let talking: boolean;
declare let voicerec: boolean;
declare let imgtak: boolean;
declare let audioDataIndex: number;
declare let imgDataIndex: number;
declare let stt: SpeechToText | null;
declare let person: Person;

const miku_ask = async (
    str: string,
    motion: string = "smile"
): Promise<string | void> => {
    // 音声データのインデックスをインクリメント
    if (voicerec === true) {
        audioDataIndex++;
    }
    // 画像データのインデックスをインクリメント
    if (imgtak === true) {
        imgDataIndex++;
    }
    // talkingがfalseの場合は何もしない
    if (!talking) {
        return;
    }
    const fnc = () => {
        if (talking) {
            console.log("強制終了");
            end_keicho("");
            location.reload();
        }
    };

    await miku_say(str, motion);
    // 2分間発話が無ければ強制終了
    const id: number = window.setTimeout(fnc, 2 * 60 * 1000);

    let answer: string = "";
    do {
        const promise: Promise<string> = new Promise((resolve) => {
            if (stt !== null) {
                // 音声認識オブジェクトを一旦開放
                stt.stop();
                stt = null;
            }
            stt = new SpeechToText("ja", resolve, false, "");
            stt.start();
        });
        // ユーザーからの回答を待機
        answer = await promise;
    } while (answer.length === 0);

    post_keicho(answer, SPEAKER.USER, person);
    clearTimeout(id);
    return answer;
}

export default miku_ask;
