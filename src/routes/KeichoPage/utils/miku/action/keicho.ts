import { SPEAKER } from "../../../../../libs/types/speaker";
import { Person } from "../../../../../libs/types/person";
import { getResponse } from "../getResponse";

declare function get_aiduchi(): string;
declare function post_loading(): void;

const keicho = async (str: string, motion: string, uid: string, talking: boolean, speaker: SPEAKER, person: Person): Promise<void> => {
    do {

        const answer: string | void = await miku_ask(str, false, motion) ?? "";

        if (/終わり$|やめる$/.test(answer)) {
            // await end_keicho("またお話ししてくださいね", "bye");
            return;
        }

        post_loading();
        try {
            str = await getResponse(answer, uid, talking, speaker, person);
        } catch {
            str = get_aiduchi();
        }
    } while (talking);
}

export default keicho;
