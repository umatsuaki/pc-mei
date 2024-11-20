import { MeboAPIResponse } from '../types/meboAPIResponse';

const meboAPIURL = import.meta.env.VITE_MEBO_API_URL;

/**
 * meboAPIを実行します。
 * 
 * @param ans - meboAPIに送信する発話。
 * @returns APIのレスポンスデータを解決するプロミス。
 * @throws ネットワークリクエストが失敗した場合やレスポンスが正常でない場合にエラーを投げます。
 */
const getMeboAPIResponse = async (ans: string, uid: String): Promise<MeboAPIResponse> => {

    // 'uid'の最初の20文字を抽出します。
    const id: string = uid.substring(0, 20);

    // テンプレートリテラルを使用してURLを構築します。
    const url: string = `${meboAPIURL}/uid=${id}/utterance=${encodeURIComponent(ans)}`;

    try {
        // APIにGETリクエストを送信します。
        const response: Response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
        });

        // レスポンスのステータスがOKでない場合、エラーをスローします。
        if (!response.ok) {
            console.error(`APIリクエストが失敗しました。ステータス: ${response.status}`);
            throw new Error(`Network response was not ok. Status: ${response.status}`);
        }

        // JSONレスポンスをパースします。
        const result: MeboAPIResponse = await response.json();
        console.log('APIレスポンス:', result);
        return result;

    } catch (error) {
        // エラーをログに記録し、再スローします。
        console.error('meboAPIの実行中にエラーが発生しました:', error);
        throw error;
    }
}

export default getMeboAPIResponse;