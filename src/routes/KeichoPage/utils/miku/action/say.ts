import MMD from "../../mmd";
import { SPEAKER } from "../../../../../libs/types/speaker";
import { postDialogueLogs } from "../../../../../libs/queryAndMutation/dialoguelogs";

const mmd = new MMD("localhost:8080", "localhost:39390");
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

    const speaker = SPEAKER.AGENT;

    await mmd.doMotion(motion);
    console.log("miku says " + str);
    postDialogueLogs(str, speaker, uid);
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
    await mmd.speakSync(str);

    return str;
}

export default mikuSay;
