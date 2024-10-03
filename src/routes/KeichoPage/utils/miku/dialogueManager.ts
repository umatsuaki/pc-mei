import { postDialogueLogs } from "../../../../libs/queryAndMutation/dialoguelogs";
import { SPEAKER } from "../../../../libs/types/speaker";
import { postComment } from "../mikuActionUI";

const saveAndDisplayDialogue = (str: string, speaker: SPEAKER, uid: string): void => {
    if (str.length >= 1) {
        console.log("文字列の長さ: " + str.length);
        postComment(str, speaker, "no");
        postDialogueLogs(str, speaker, uid);
    }
}

export default saveAndDisplayDialogue;