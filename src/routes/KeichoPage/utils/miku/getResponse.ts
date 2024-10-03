import { MeboAPIResponse } from "../../../../libs/types/meboAPIResponse";
import getMeboAPIResponse from "../../../../libs/queryAndMutation/meboAPI";
import mikuSay from "./action/say";
import { runGptApi } from "../../../../libs/queryAndMutation/chatGPT";



/**
 * 発話に対する応答を取得します。
 * 
 * @param ans - ユーザーからの発話。
 * @returns APIからの応答文を解決するプロミス。条件により空文字列を返す場合があります。
 * @throws meboAPIの実行中にエラーが発生した場合。
 */
const getResponse = async (ans: string, uid: string): Promise<string> => {
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
        if (result.bestResponse.score >= 0.01) {
            // 応答から一文ずつ出力
            let str: string = result.bestResponse.utterance;
            while (str.includes("。")) {
                const index: number = str.indexOf("。");
                const str1: string = str.substring(0, index);
                const str2: string = str.substring(index + 1);
                if (str2.length > 0) {
                    await mikuSay(str1, uid);
                    str = str2;
                } else {
                    return str1;
                }
            }
            return str;
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

const getChatGPTResponse = async (ans: string, uid: string): Promise<string> => {
    try {
        const result = await runGptApi(ans, uid);

        // ローディング表示を消す
        const element: HTMLElement | null = document.getElementById('loading');
        if (element) {
            element.remove();
        }

        // 応答から一文ずつ出力
        let str: string = result.content;
        while (str.includes("。")) {
            const index: number = str.indexOf("。");
            const str1: string = str.substring(0, index);
            const str2: string = str.substring(index + 1);
            if (str2.length > 0) {
                await mikuSay(str1, uid);
                str = str2;
            } else {
                return str1;
            }
        }
        return str;

    } catch (error) {
        console.error('getChatGPTResponse関数内でエラーが発生しました:', error);
        throw error;
    }
}



export { getResponse, getGreeting, getChatGPTResponse };
