
import { getNowDateTimeAsString } from '../utils.ts';
import { Person } from '../types/person';

// nextCloudのエンドポイント
const audioDataRepoBaseDest: string = import.meta.env.NEXTCLOUD_BASE_URL;

// nextCloudの認証情報
const audioDataRepoUserName: string = import.meta.env.NEXTCLOUD_USERNAME;
const audioDataRepoPassword: string = import.meta.env.NEXTCLOUD_PASSWORD;

// 現セッションにおける音声データの保存先ディレクトリ
let audioDataDest: string | null = null;



/**
 * 音声出力先親ディレクトリの存在確認
 * @returns {Promise<boolean>} ディレクトリが存在する場合はtrue、存在しない場合はfalse
 */
const audioDataParentDirectoryCheck = async (person: Person): Promise<boolean> => {
    // 現ユーザのYou-IDに対応するディレクトリが存在するかチェック
    const userYouID: string = person.uid;
    const dest: string = `${audioDataRepoBaseDest}/${audioDataRepoUserName}/${encodeURIComponent(userYouID)}`;

    // 認証ヘッダーの作成
    const headers: Headers = new Headers();
    headers.append("Authorization", "Basic " + btoa(`${audioDataRepoUserName}:${audioDataRepoPassword}`));

    try {
        const response: Response = await fetch(dest, {
            method: 'PROPFIND',
            headers: headers,
            mode: 'cors',
        });

        if (response.status >= 200 && response.status < 300) {
            console.log("audioDataParentDirectoryCheck OK");
            return true;
        } else if (response.status === 404) {
            console.log("audioDataParentDirectoryCheck NG");
            return false;
        } else {
            console.error(`Unexpected response status: ${response.status}`);
            throw new Error(`Failed to check directory: ${response.statusText}`);
        }
    } catch (err) {
        console.error("audioDataParentDirectoryCheck ERROR");
        console.error(`Failed to fetch ${dest}`, err);
        throw err;
    }
};

/**
 * 音声出力先親ディレクトリの作成
 * @returns {Promise<boolean>} 作成に成功した場合はtrue
 */
const audioDataParentDirectoryCreate = async (person: Person): Promise<boolean> => {
    const userYouID: string = person.uid;
    const dest: string = `${audioDataRepoBaseDest}/${audioDataRepoUserName}/${encodeURIComponent(userYouID)}`;

    // 認証ヘッダーの作成
    const headers: Headers = new Headers();
    headers.append("Authorization", "Basic " + btoa(`${audioDataRepoUserName}:${audioDataRepoPassword}`));

    try {
        const response: Response = await fetch(dest, {
            method: 'MKCOL',
            headers: headers,
            mode: 'cors',
        });

        if (response.status >= 200 && response.status < 300) {
            console.log("audioDataParentDirectoryCreate OK");
            return true;
        } else {
            console.error(`Failed to create directory: ${response.status} ${response.statusText}`);
            throw new Error(`Failed to create directory: ${response.statusText}`);
        }
    } catch (err) {
        console.error("audioDataParentDirectoryCreate ERROR");
        console.error(`Failed to fetch ${dest}`, err);
        throw err;
    }
};

/**
 * 音声出力先ディレクトリの作成
 * 特定のユーザのディレクトリの下に，日時を名前としたディレクトリを作成します
 * @returns {Promise<boolean>} 作成に成功した場合はtrue
 */
const audioDataDirectoryCreate = async (person: Person): Promise<boolean> => {
    const userYouID: string = person.uid;
    const currentDateTime: string = getNowDateTimeAsString();
    const dest: string = `${audioDataRepoBaseDest}/${audioDataRepoUserName}/${encodeURIComponent(userYouID)}/${encodeURIComponent(currentDateTime)}`;

    // 認証ヘッダーの作成
    const headers: Headers = new Headers();
    headers.append("Authorization", "Basic " + btoa(`${audioDataRepoUserName}:${audioDataRepoPassword}`));

    try {
        const response: Response = await fetch(dest, {
            method: 'MKCOL',
            headers: headers,
            mode: 'cors',
        });

        if (response.status >= 200 && response.status < 300) {
            console.log("audioDataDirectoryCreate OK");
            // audioDataDest を書き換え
            audioDataDest = dest;
            return true;
        } else {
            console.error(`Failed to create directory: ${response.status} ${response.statusText}`);
            throw new Error(`Failed to create directory: ${response.statusText}`);
        }
    } catch (err) {
        console.error("audioDataDirectoryCreate ERROR");
        console.error(`Failed to fetch ${dest}`, err);
        throw err;
    }
};

export { audioDataParentDirectoryCheck, audioDataParentDirectoryCreate, audioDataDirectoryCreate, audioDataDest };
