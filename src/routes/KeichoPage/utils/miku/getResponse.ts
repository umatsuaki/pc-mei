import { MeboAPIResponse } from "../../../../libs/types/meboAPIResponse";
import { Person } from "../../../../libs/types/person";
import getMeboAPIResponse from "../../../../libs/queryAndMutation/meboAPI";
import miku_say from "./action/say";
import { SPEAKER } from "../../../../libs/types/speaker";



/**
 * 発話に対する応答を取得します。
 * 
 * @param ans - ユーザーからの発話。
 * @returns APIからの応答文を解決するプロミス。条件により空文字列を返す場合があります。
 * @throws meboAPIの実行中にエラーが発生した場合。
 */
const getResponse = async (ans: string, uid: string, talking: boolean, speaker: SPEAKER, person: Person): Promise<string> => {
    try {
        // MeboAPIを実行
        const result: MeboAPIResponse = await getMeboAPIResponse(ans, uid);
        console.log(result);

        // ローディング表示を消す
        const element: HTMLElement | null = document.getElementById('loading');
        if (element) {
            element.remove();
        }

        // スコアが高ければその応答を採用
        if (result.bestResponse && result.bestResponse.score >= 0.01) {
            // 応答から一文ずつ出力
            let str: string = result.bestResponse.utterance;
            while (str.includes("。")) {
                const periodIndex: number = str.indexOf("。");
                const str1: string = str.substring(0, periodIndex + 1); // 「。」も含める
                const str2: string = str.substring(periodIndex + 1).trim();

                if (str2.length > 0) {
                    await miku_say(str1, uid, talking, speaker, person);
                    str = str2;
                } else {
                    await miku_say(str1, uid, talking, speaker, person);
                    return str1;
                }
            }
            // 残りの文が「。」を含まない場合
            if (str.length > 0) {
                await miku_say(str, uid, talking, speaker, person);
                return str;
            }
            return "";
        } else {
            return "";
        }
    } catch (error) {
        console.error('getResponse関数内でエラーが発生しました:', error);
        throw error;
    }
}

/**
 * 時刻に合わせた挨拶を返します。
 * 
 * @param name - 挨拶に名前を含める場合、その名前を指定します。デフォルトはnull。
 * @returns 適切な挨拶文。
 */
const getGreeting = (name: string | null = null): string => {
    const now: Date = new Date();
    const hour: number = now.getHours();
    let greet: string;

    if (3 <= hour && hour < 12) {
        greet = "おはようございます．";
    } else if (12 <= hour && hour < 18) {
        greet = "こんにちは．";
    } else {
        greet = "こんばんは．";
    }

    if (name) {
        greet = `${name}さん，${greet}`;
    }

    return greet;
}

export { getResponse, getGreeting };
