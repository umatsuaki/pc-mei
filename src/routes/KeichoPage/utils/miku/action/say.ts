import MMD from "../../mmd";
import { SPEAKER } from "../../../../../libs/types/speaker";
import saveAndDisplayDialogue from "../dialogueManager";
import { scrollToBottom } from "../../../../../libs/utils";
import axios from "axios";


// MMDサーバーに接続確認を行う関数
const isMMDServerAvailable = async (): Promise<boolean> => {
    try {
        const response = await axios.get(`http://localhost:39390`);
        return response.status === 200;
    } catch {
        return false;
    }
};

let mmd: MMD | null = null;

// サーバーが起動しているか確認してからMMDインスタンスを作成
isMMDServerAvailable().then((available) => {
    if (available) {
        mmd = new MMD("localhost:8080", "localhost:39390");
    } else {
        console.warn("MMDサーバーが利用できません。モーションと音声機能はスキップされます。");
    }
});

/**
 * モーション付きでミクちゃんが問いかける．Promiseが返る．
 * @param str 問いかけ文字列
 * @param motion 問いかけ時のモーション
 * @returns 問いかけ文字列を返すプロミス
 */
const mikuSay = async (str: string, uid: string, motion: string = "smile"): Promise<string | void> => {
    if (!str.length) {
        return;
    }

    if (mmd) {
        try {
            await mmd.doMotion(motion);
            console.log("miku does motion: " + motion);
        } catch (error) {
            console.error("Failed to perform motion:", error);
        }
    }
    console.log("miku says " + str);
    saveAndDisplayDialogue(str, SPEAKER.AGENT, uid);
    while (str.includes(")") || str.includes("）")) {
        if (str.includes("(")) {
            const i = str.indexOf("(");
            const j = str.indexOf(")");
            const str1 = str.substring(0, i);
            const str2 = str.substring(j + 1);
            str = str1 + str2;
        }
        if (str.includes("（")) {
            const i = str.indexOf("（");
            const j = str.indexOf("）");
            const str1 = str.substring(0, i);
            const str2 = str.substring(j + 1);
            str = str1 + str2;
        }
    }
    console.log(str);
    scrollToBottom();
    if (mmd !== null) {
        try {
            await mmd.speakSync(str);
        } catch (error) {
            console.error("Failed to speak:", error);
        }
    }


    return str;
}

export default mikuSay;
