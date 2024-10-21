import { getChatGPTResponse } from "../getResponse";
import { getRandomAiduchi } from "../../../../../libs/utils";
import mikuAsk from "./ask";
import { MikuActionConfig } from "../../../../../libs/types/mikuActionConfig";
import endKeicho from "./endKeicho";
import { postLoading, postPhoto } from "../../mikuActionUI";
import mikuSay from "./say";
import goToStreetView from "../../microservices/streetViewService";
import { runNearByPlaceService } from "../../microservices/nearbyPlaceService";



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
            await mikuSay("ストリートビューを表示します", config.uid, "smile");
            goToStreetView();
            return;
        }
        if (/おでかけ$|お出かけ$/.test(answer)) {
            console.log("おでかけ");
            const outing = await mikuAsk("今日はどんな場所に出かけたいですか", config, "smile");
            if (outing) {
                const outingResult = await runNearByPlaceService(outing);
                await mikuSay(outingResult.content, config.uid, "smile");
                await mikuSay("こちらの写真を見てください", config.uid, "smile");
                if (outingResult.photoReference !== "") {
                    await postPhoto(outingResult.photoReference);
                }
                await mikuAsk("いかがですか？", config, "smile");
            }
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
