// mmd.ts
/**
 * mmd.ts: MMDAgentProxy のラッパー
 * パラメータ
 * - proxy_addr: MMDAgentProxyService が動いているサーバのIPアドレス:ポート．デフォルトは localhost:8080
 * - mmd_addr: MMDAgentProxyService が動いているサーバのIPアドレス:ポート．デフォルトは localhost:39390
 */

import $ from "jquery";
import { Callback } from "../../../libs/types/callback";

/**
 * HTTP エラークラス
 */
class HttpError extends Error {
    public response: Response;

    constructor(response: Response) {
        super(`${response.status} for ${response.url}`);
        this.name = 'HttpError';
        this.response = response;
    }
}

/**
 * MMD クラス
 */
class MMD {
    private proxy_addr: string;
    private mmd_addr: string;

    /**
     * MMD クラスのインスタンスを作成します。
     * @param proxy_addr MMDAgentProxyService が動いているサーバのIPアドレス:ポート．デフォルトは localhost:8080
     * @param mmd_addr MMDAgentProxyService が動いているサーバのIPアドレス:ポート．デフォルトは localhost:39390
     */
    constructor(proxy_addr: string = "localhost:8080", mmd_addr: string = "localhost:39390") {
        this.proxy_addr = proxy_addr;
        this.mmd_addr = mmd_addr;
        this.setMMDAddr(mmd_addr);
        console.log("MMD created.");
    }

    /**
     * MMDAgentProxy のアドレスを取得します。
     * @returns proxy_addr
     */
    public getProxyAddr(): string {
        return this.proxy_addr;
    }

    /**
     * MMDAgent のアドレスを取得します。
     * @returns mmd_addr
     */
    public getMMDAddr(): string {
        return this.mmd_addr;
    }

    /**
     * MMDAgentProxy のエンドポイントを取得します。
     * @returns エンドポイント URL
     */
    public getEndPoint(): string {
        const proxy_endpoint = `http://${this.proxy_addr}/axis2/services/MMDAgentProxyService`;
        return proxy_endpoint;
    }

    /**
     * MMDAgentProxy のアドレスをセットします（IPアドレス：ポート番号）。
     * @param proxy_addr MMDAgentProxy のアドレス
     */
    public setProxyAddr(proxy_addr: string): void {
        this.proxy_addr = proxy_addr;
    }

    /**
     * MMDAgent のアドレスを MMDAgentProxy にセットします。（IPアドレス：ポート番号）
     * @param mmd_addr MMDAgent のアドレス
     */
    public setMMDAddr(mmd_addr: string): void {
        const [ip, port] = mmd_addr.split(":");

        this.mmd_addr = mmd_addr;

        // IP アドレスをセット
        let url = `${this.getEndPoint()}/setIP?ip=${encodeURIComponent(ip)}`;
        this.execWebAPI(url, (mes: string) => { $("#motion_result").val(mes); });

        // ポート番号をセット
        url = `${this.getEndPoint()}/setPortNumber?portNumber=${encodeURIComponent(port)}`;
        this.execWebAPI(url, (mes: string) => { $("#motion_result").val(mes); });
    }

    /**
     * テキストを話します。非同期メソッド。
     * @param text 話すテキスト
     * @returns Promise<string>
     */
    public speak(text: string): Promise<string> {
        const url = `${this.getEndPoint()}/say?str=${encodeURIComponent(text)}`;
        return this.execWebAPI(url);
    }

    /**
     * 同期的に話します。
     * @param text 話すテキスト
     * @returns Promise<string>
     */
    public speakSync(text: string): Promise<string> {
        const url = `${this.getEndPoint()}/syncsay?str=${encodeURIComponent(text)}`;
        return this.execWebAPI(url);
    }

    /**
     * モーションを実行します。
     * @param motion 実行するモーション
     * @returns Promise<string>
     */
    public doMotion(motion: string): Promise<string> {
        const url = `${this.getEndPoint()}/doMotion?motion=${encodeURIComponent(motion)}`;
        this.stopMotion(); // 現在のモーションを停止
        return this.execWebAPI(url);
    }

    /**
     * モーションを停止します。
     * @param motion 使用しない（オリジナルコードでは未使用）
     * @param clbk 使用しない（オリジナルコードでは未使用）
     * @returns Promise<string>
     */
    public stopMotion(clbk?: Callback): Promise<string> {
        const url = `${this.getEndPoint()}/stopMotion`;
        return this.execWebAPI(url, clbk);
    }

    /**
     * APIを実行します。fetch()を利用して、Promise オブジェクトを返します。
     * @param url APIのURL
     * @param clbk コールバック関数（オプション）
     * @returns Promise<string>
     */
    private async execWebAPI(url: string, clbk?: Callback): Promise<string> {
        return fetch(url)
            .then(response => {
                if (response.status === 200) {
                    return response.text();
                } else {
                    throw new HttpError(response);
                }
            })
            .then(text => {
                if (clbk) {
                    clbk(text);
                }
                return text;
            })
            .catch(err => {
                console.error(`Failed to fetch ${url}`, err);
                throw err;
            });
    }
}

export default MMD;
