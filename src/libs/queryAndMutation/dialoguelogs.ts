import { formatDate } from '../utils';
import { DialogueLog } from '../types/dialogueLog';
import { SPEAKER } from '../types/speaker';
import { DialogueLogForPost } from '../types/dailogueLogForPost';
import dayjs from 'dayjs';
import { getPersonInfo } from './youid';

const dialogueAPIURL = import.meta.env.VITE_DIALOGUE_API_URL;
const mongoAPIURL = import.meta.env.VITE_MONGO_API_URL;

/**
 * APIを実行し，指定した日付の対話ログを取得
 * @param date - 対話ログを取得したい日付
 * @returns 指定した日付の対話ログのPromise
 */
async function getDialogueLogs(date: Date, uid: string): Promise<DialogueLog[]> {

    const person = await getPersonInfo(uid);
    // 日付を 'yyyy-MM-dd' 形式にフォーマットします。
    const dateStr: string = formatDate(date, 'yyyy-MM-dd');

    // URLを構築します。person.uidが適切に定義されていることを前提としています。
    const url: string = `${dialogueAPIURL}/uid=${person.uid}/date=${dateStr}`;

    try {
        const response: Response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                // 必要に応じて認証ヘッダーを追加
                // 'Authorization': `Bearer YOUR_ACCESS_TOKEN`,
            },
        });

        if (!response.ok) {
            // レスポンスの詳細なエラーメッセージを取得
            const errorText = await response.text();
            console.error(`HTTPエラー! ステータス: ${response.status}, メッセージ: ${errorText}`);
            throw new Error(`リクエストが失敗しました。ステータスコード: ${response.status}, メッセージ: ${errorText}`);
        }

        const result: DialogueLog[] = await response.json();
        console.log(result);
        return result;
    } catch (error) {
        console.error('エラーが発生しました:', error);
        throw error; // 呼び出し元でエラーハンドリングを行うために再スローします
    }
}

/**
 * リモートのMongoDBに会話ログをポストする
 * @param str - 送信するメッセージ内容
 * @param speaker - メッセージの送信者
 * @returns Promise<void>
 */
const postDialogueLogs = async (str: string, speaker: SPEAKER, uid: string): Promise<void> => {

    const person = await getPersonInfo(uid);

    const url: string = mongoAPIURL;

    // データ作成
    const data: DialogueLogForPost = {
        from: speaker === SPEAKER.AGENT ? "keicho-bot" : person.uid,
        to: speaker === SPEAKER.AGENT ? person.uid : "keicho-bot",
        contents: str,
        dataType: "text",
        timestamp: dayjs().format() // day.jsを使用してフォーマット
    };

    const tag: string = `va.keicho.${person.uid}`;

    const form: FormData = new FormData();
    form.append("t", tag);
    form.append("p", "renkon");
    form.append("j", JSON.stringify(data));

    try {
        const response: Response = await fetch(url, {
            method: "POST",
            mode: "cors",
            body: form
        });

        if (!response.ok) {
            const errorText: string = await response.text();
            console.error('post DB error:', str, 'Status:', response.status, 'Message:', errorText);
            throw new Error(`Failed to post dialogue. Status: ${response.status}, Message: ${errorText}`);
        }

        const responseText: string = await response.text();
        console.log('post DB success:', str, 'Response:', responseText);
    } catch (error) {
        console.error('post DB error:', str, error);
        throw error; // 呼び出し元でエラーハンドリングを行えるようにエラーを再スロー
    }
};

export { getDialogueLogs, postDialogueLogs };