import { aiduchi } from "./constants";
import { mikuMotion } from "./constants";


// 現在日時を文字列として返す
const getNowDateTimeAsString = (): string => {
    const now: Date = new Date();
    const year: number = now.getFullYear();
    const month: string = String(now.getMonth() + 1).padStart(2, '0');
    const date: string = String(now.getDate()).padStart(2, '0');
    const hour: string = String(now.getHours()).padStart(2, '0');
    const minute: string = String(now.getMinutes()).padStart(2, '0');
    const second: string = String(now.getSeconds()).padStart(2, '0');
    const nowStr: string = `${year}-${month}-${date}_${hour}:${minute}:${second}`;

    return nowStr;
};

/**
 * Dateを指定されたフォーマットの文字列に変換する関数
 * 
 * サポートされているフォーマットプレースホルダー:
 * - yyyy: 4桁の年
 * - MM: 2桁の月 (01-12)
 * - dd: 2桁の日 (01-31)
 * - HH: 2桁の時間 (00-23)
 * - mm: 2桁の分 (00-59)
 * - ss: 2桁の秒 (00-59)
 * - ms: 3桁のミリ秒 (000-999)
 * 
 * @param date - フォーマットしたいDateオブジェクト
 * @param format - 日付フォーマットの文字列
 * @returns 指定されたフォーマットの日時文字列
 */
const formatDate = (date: Date, format: string): string => {
    // 年を4桁で置換
    format = format.replace(/yyyy/g, date.getFullYear().toString());

    // 月を2桁で置換 (01-12)
    format = format.replace(/MM/g, (date.getMonth() + 1).toString().padStart(2, '0'));

    // 日を2桁で置換 (01-31)
    format = format.replace(/dd/g, date.getDate().toString().padStart(2, '0'));

    // 時間を2桁で置換 (00-23)
    format = format.replace(/HH/g, date.getHours().toString().padStart(2, '0'));

    // 分を2桁で置換 (00-59)
    format = format.replace(/mm/g, date.getMinutes().toString().padStart(2, '0'));

    // 秒を2桁で置換 (00-59)
    format = format.replace(/ss/g, date.getSeconds().toString().padStart(2, '0'));

    // ミリ秒を3桁で置換 (000-999)
    // 'ms' はミリ秒を表すため、3桁にする必要があります。
    // 元のコードでは2桁にしていたため、修正しています。
    format = format.replace(/ms/g, date.getMilliseconds().toString().padStart(3, '0'));

    return format;
}

/**
 * ページを指定された時刻 (h時 m分) にリフレッシュする
 * @param h 時 (0-23)
 * @param m 分 (0-59)
 * @returns NodeJS.Timeout ID
 */
const refreshAt = (h: number, m: number, talking: boolean): number => {
    const now = new Date();

    // 現在の時刻を秒単位で取得
    const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

    // 目標時刻を秒単位で設定
    const targetSeconds = h * 3600 + m * 60;

    // 目標時刻までの秒数を計算 (過ぎている場合は翌日の同じ時間まで)
    const secondsUntilTarget = (targetSeconds - currentSeconds + 86400) % 86400;

    // 確認用ログ
    console.log(`あと${secondsUntilTarget}秒で ${h}時${m}分です`);

    // talking 変数を条件にしてリフレッシュを遅延させる処理
    const refresh = (): void => {
        if (talking) {
            console.log("現在会話中です。1分後に再度チェックします。");
            setTimeout(refresh, 60 * 1000);
        } else {
            location.reload();
        }
    };

    // 指定秒数後にリフレッシュ処理を実行
    return window.setTimeout(refresh, secondsUntilTarget * 1000);
}


// クエリ文字列を取得する関数
const getUrlVars = (): { [key: string]: string } => {
    const vars: { [key: string]: string } = {};
    const url: string = window.location.search;

    // '?'を取り除き、&で区切る
    const hash: string[] = url.slice(1).split('&');
    const max: number = hash.length;

    for (let i = 0; i < max; i++) {
        const array: string[] = hash[i].split('='); // keyと値に分割
        const key: string = decodeURIComponent(array[0]);
        const value: string = array[1] ? decodeURIComponent(array[1]) : '';
        vars[key] = value; // keyに値を代入
    }

    return vars;
}

// 相槌をランダムに返す関数
const getRandomAiduchi = (): string => {
    const random: number = Math.floor(Math.random() * aiduchi.length);
    return aiduchi[random];
}

// モーションをランダムに返す関数
const getRandomMotion = (): string => {
    const random: number = Math.floor(Math.random() * mikuMotion.length);
    return mikuMotion[random];
}

// ページの一番下までスクロールする関数
const scrollToBottom = (behavior: ScrollBehavior = 'smooth'): void => {
    const scrollHeight = document.documentElement.scrollHeight;
    window.scrollTo({
        top: scrollHeight,
        behavior: behavior,
    });
}

//　傾聴ページに遷移する関数
const goToKeicho = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const uid = queryParams.get('uid');
    const voicerec = queryParams.get('voicerec');
    const imgtak = queryParams.get('imgtak');

    const baseUrl = '/pc-mei-react';
    const targetUrl = `${baseUrl}/keicho?uid=${uid}&voicerec=${voicerec}&imgtak=${imgtak}`;

    window.location.replace(targetUrl);
}





export { getUrlVars, getNowDateTimeAsString, refreshAt, formatDate, getRandomAiduchi, getRandomMotion, scrollToBottom, goToKeicho };
