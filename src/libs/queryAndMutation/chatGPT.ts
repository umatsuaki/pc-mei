import { gptResponse } from "../types/gptResponse";
import { getDialogueLogs } from "./dialoguelogs";
import { getPersonInfo } from "./youid";

const chatGPTAPIUrl = import.meta.env.VITE_CHATGPT_API_URL;


/**
 * ChatGPTAPIで解答を取得する
 */
const getChatGptAnswer = async (ans: string): Promise<gptResponse> => {
    const url = `${chatGPTAPIUrl}/text=${encodeURIComponent(ans)}`;
    return fetch(url, {
        method: 'GET',
        mode: 'cors',
    })
        .then(response => {
            //レスポンスコードをチェック
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
        })
        .catch(err => {
            console.log(`Failed to fetch ${url}`, err);
            throw new Error(err.message);
        });

}

/**
 * gptAPIを実行
 */
const runGptApi = async (ans: string, uid: string): Promise<gptResponse> => {

    const person = await getPersonInfo(uid);

    try {
        console.log(`あなたの返答: ${ans}`);
        const dialogueLogs = await getDialogueLogs(new Date(), uid);

        // 最新の10件を抽出して出力する
        const latestLogs = dialogueLogs.slice(-10); // 配列の最後の10件を取得

        let conversationHistory = "会話履歴:\n";

        latestLogs.forEach((log: any) => {
            if (log.from === uid) {
                conversationHistory += `${person.nickname}: ${log.contents}\n`;
            } else if (log.from === "keicho-bot") {
                if (log.contents.includes("<div>")) {
                    return;
                }
                conversationHistory += `システム: ${log.contents}\n`;
            }
        });

        console.log(conversationHistory);

        let prompt = "";

        // 追加の質問文としてユーザからのキーワード（質問）を組み立てる
        prompt = `${conversationHistory}\n...\n会話履歴は上記のようになっています\n\nここで${person.nickname}から「${ans}」と話しかけられました。` +
            `システムの立場に立って，返答を穏やかかつ丁寧に答えて，できるだけ自然な会話を心がけてください。` +
            `一文一文の文章の長さが40文字を超える場合は，「。」をつけてください。また，医学的な質問が来たときは，「医師にご相談ください」と出力してください。再帰的な処理をしてください。絶対絶対に40文字を超えないでください。`;


        console.log(`プロンプト: ${prompt}`);
        const url = `${chatGPTAPIUrl}/text=${encodeURIComponent(prompt)}`;

        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
        });

        if (response.status === 200) {
            const result = await response.json();
            console.log(result);
            return result;
        } else {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
    } catch (err) {
        console.error("Failed to fetch ", err);
        throw err;
    }
}

export { getChatGptAnswer, runGptApi };

