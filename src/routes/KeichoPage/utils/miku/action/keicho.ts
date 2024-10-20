import { getChatGPTResponse } from "../getResponse";
import { getRandomAiduchi } from "../../../../../libs/utils";
import mikuAsk from "./ask";
import { MikuActionConfig } from "../../../../../libs/types/mikuActionConfig";
import endKeicho from "./endKeicho";
import { postLoading } from "../../mikuActionUI";
import mikuSay from "./say";
import goToStreetView from "../../microServices/streetViewService";



const keicho = async (str: string, config: MikuActionConfig, motion: string = "smile"): Promise<void> => {
    do {
        if (!config.talking) {
            return;
        }

        const answer: string = await mikuAsk(str, config, motion) ?? "";
        if (/終わり$|やめる$/.test(answer)) {
            await endKeicho("またお話ししてくださいね", config, "bye");
            return;
        }
        if (/地図/.test(answer)) {
            await mikuSay("地図を表示します", config.uid, "smile");
            goToStreetView();
            return;
        }
        postLoading();
        try {
            // str = await getResponse(answer, config.uid);
            str = await getChatGPTResponse(answer, config.uid);
        } catch {
            str = getRandomAiduchi();
        }
    } while (true);
}

export default keicho;
