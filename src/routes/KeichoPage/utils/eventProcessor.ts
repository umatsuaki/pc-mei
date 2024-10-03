import { putPersonPreference, getPersonPreference, getPersonInfo } from '../../../libs/queryAndMutation/youid';
import { SensorBoxMessage, Attributes } from '../../../libs/types/sensorBoxMessage';
import mikuAsk from './miku/action/ask';
import keicho from './miku/action/keicho';
import mikuSay from './miku/action/say';
import { MikuActionConfig } from '../../../libs/types/mikuActionConfig';
import { loadVideo } from './imgrec';
import { audioDataDirectoryCreate, audioDataParentDirectoryCheck, audioDataParentDirectoryCreate } from '../../../libs/queryAndMutation/audioData';

/**
 * センサボックスからのmessageを受け取って、messageの内容に応じて処理を行う関数
 * @param {Message} message センサボックスからのmessage
 */
const processEvent = async (message: SensorBoxMessage, uid: string, config: MikuActionConfig): Promise<void> => {

    const preference = await getPersonPreference(uid);

    let sensorBoxAttribute: Attributes | null = null;
    if (message.attributes.subject === preference.preferences.sensorbox) {
        sensorBoxAttribute = message.attributes;
        console.log("sensorBoxAttribute", sensorBoxAttribute);
    } else {
        return;
    }

    // イベントが受け取られたら、時刻に応じてシナリオを起動する
    if (sensorBoxAttribute !== null) {
        const now = new Date();
        const hour = now.getHours();
        // 個人の生活リズムの時差.6時起点から何時間ずれているか
        const driftTime = preference.preferences.drift || 0;
        const adjustedHour = hour - driftTime;
        const scenarioNumber = Math.floor((adjustedHour - 6) / 2 + 1);

        switch (sensorBoxAttribute.event) {
            case "present":
                if (!config.talking) {
                    await startScenario(scenarioNumber, config);
                }
                break;
            default:
                console.warn(`Unknown event type: ${sensorBoxAttribute.event}`);
                break;
        }
    }
}

/**
 * 与えられた番号の傾聴シナリオを開始する
 * @param {number} num シナリオの番号
 */
const startScenario = async (num: number, config: MikuActionConfig): Promise<void> => {
    // シナリオの実行制限を確認
    const shouldExecute = await manageScenarioExecution(num, config.uid);
    if (!shouldExecute) {
        return;
    }

    // カメラをオンにする
    if (config.imgtak === true) {
        config.videostm = await loadVideo();
    }

    // 親ディレクトリチェック～音声ファイル(画像ファイル)を保存するディレクトリを作成
    if (config.voicerec == true || config.imgtak == true) {
        const parentDirectoryCheck = await audioDataParentDirectoryCheck(config.uid);
        if (!parentDirectoryCheck) {
            config.audioDataDest = await audioDataParentDirectoryCreate(config.uid);
        }
        config.audioDataDest = await audioDataDirectoryCreate(config.uid);
    }

    config.talking = true;
    document.getElementById("status")!.innerHTML = "";

    // シナリオに応じたアクションを実行
    await executeScenarioActions(num, config);
};



/**
 * シナリオの実行制限を管理する
 * シナリオ番号が0以外の場合、1日に1回だけ実行されるように制御します。
 * @param {number} num シナリオの番号
 * @param {PreferenceType} preference 現在のユーザーのプリファレンス
 * @param {string} uid ユーザーID
 * @returns {Promise<boolean>} シナリオを実行する場合はtrue、既に実行済みの場合はfalse
 */
const manageScenarioExecution = async (
    num: number,
    uid: string
): Promise<boolean> => {
    if (num === 0) {
        // シナリオ0は制限なし
        return true;
    }

    const now = new Date();
    const preference = await getPersonPreference(uid);


    if (!preference.preferences.scenarios) { // preferenceにシナリオ管理の値がない場合
        let scenarios: string[] = Array(10).fill("2000-01-01"); // シナリオ数に合わせて配列の長さを調整
        // Preferenceを更新
        let newPref = { ...preference }; // コピーを作成
        delete newPref.keys;
        newPref.preferences.scenarios = scenarios;
        newPref.preferences.scenarios[num] = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
        await putPersonPreference(uid, newPref);
        return true;
    } else {
        const lastRunTime = new Date(preference.preferences.scenarios[num]);
        if (now.getTime() - lastRunTime.getTime() < 24 * 60 * 60 * 1000) {
            console.log(`Scenario #${num} has been already done.`);
            return false;
        } else {
            // Preferenceを更新
            let newPref = { ...preference }; // コピーを作成
            delete newPref.keys;
            newPref.preferences.scenarios![num] = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
            await putPersonPreference(uid, newPref);
            return true;
        }
    }
};

/**
 * シナリオに応じたアクションを実行する
 * @param {number} num シナリオの番号
 * @param {PersonType} person ユーザー情報
 * @returns {Promise<void>}
 */
const executeScenarioActions = async (num: number, config: MikuActionConfig): Promise<void> => {
    let ans: string;
    const uid = config.uid;
    const person = await getPersonInfo(uid);
    const today = new Date();


    switch (num) {
        // シナリオ0: デフォルト

        case 0:
            await keicho("私に何でも話してください", config, "self_introduction");
            return;

        // シナリオ1: 6，7時 (睡眠について)
        case 1:
            await mikuSay(`${person.nickname}さん，おはようございます`, uid, "greeting");
            await keicho("今朝の気分はいかがですか？", config, "self_introduction");
            return;

        // シナリオ2: 8，9時 (朝食について)
        case 2:
            ans = await mikuAsk(`${person.nickname}さん，朝食は食べましたか？（はい／いいえ）`, config) || "";
            if (/はい/.test(ans) || /食べました/.test(ans)) {

                await mikuAsk("何を食べたか教えていただけませんか？", config);
            } else {
                await mikuAsk("何を食べる予定なのか，教えていただけませんか？", config);
            }
            await mikuSay("わかりました，ありがとうございます！", uid, "greeting");
            await keicho("今日の予定を教えていただけませんか？", config, "self_introduction");
            return;

        // シナリオ3: 10，11時 (水分について)
        case 3:
            ans = await mikuAsk(`${person.nickname}さん，水分補給はしていますか？（はい／いいえ）`, config) || "";
            if (/はい/.test(ans) || /しています/.test(ans)) {
                await mikuSay("その調子で，定期的に水分を取るように心がけましょう！", uid, "smile");
            } else {
                await mikuSay("定期的に水分を取るように心がけましょう", uid, "self_introduction");
            }

            const topics = ["好きなもの", "嫌いなもの", "興味があること", "趣味", "悩みや気になっていること", "過去や思い出", "今後の予定や夢"];
            await keicho(`${person.nickname}さんの${topics[today.getDay()]}について，話していただけませんか？`, config, "self_introduction");
            return;

        // シナリオ4: 12，13時 (昼食について)
        case 4:
            ans = await mikuAsk(`${person.nickname}さん，昼食は食べましたか？（はい／いいえ）`, config) || "";
            if (/はい/.test(ans) || /食べました/.test(ans)) {
                await mikuAsk("何を食べたか教えていただけませんか？", config);
            } else {
                await mikuAsk("何を食べる予定なのか，教えていただけませんか？", config);
            }
            await mikuSay("わかりました，ありがとうございます！", uid, "greeting");
            await keicho("午前中はどんなことをしたか，話していただけませんか？", config, "smile");
            return;

        // シナリオ5: 14，15時 (水分について)
        case 5:
            ans = await mikuAsk(`${person.nickname}さん，水分補給はしていますか？（はい／いいえ）`, config) || "";
            if (/はい/.test(ans) || /しています/.test(ans)) {
                await mikuSay("その調子で，定期的に水分を取るように心がけましょう！", uid, "smile");
            } else {
                await mikuSay("定期的に水分を取るように心がけましょう", uid, "self_introduction");
            }
            const feelings = ["楽しかった", "イライラした", "ドキドキした", "悲しかった", "おもしろかった", "つらかった", "嬉しかった"];
            await keicho(`最近あった${feelings[today.getDay()]}ことについて，話していただけませんか？`, config, "self_introduction");
            return;

        // シナリオ6: 16，17時 (雑談)
        case 6:
            await mikuSay(`${person.nickname}さん，こんにちは`, uid, "greeting");
            return;

        // シナリオ7: 18，19時 (夕食について)
        case 7:
            ans = await mikuAsk(`${person.nickname}さん，夕食は食べましたか？（はい／いいえ）`, config) || "";
            if (/はい/.test(ans) || /食べました/.test(ans)) {
                await mikuAsk("何を食べたか教えていただけませんか？", config);
            } else {
                await mikuAsk("何を食べる予定なのか，教えていただけませんか？", config);
            }
            await mikuSay("わかりました，ありがとうございます！", uid, "greeting");
            await keicho("午後はどんなことをしたか，話していただけませんか？", config, "smile");
            return;

        // シナリオ8: 20，21時 (健康について)
        case 8:
            await mikuSay(`${person.nickname}さん，こんばんは`, uid, "greeting");
            await keicho("からだやこころの調子はいかがですか？", config, "self_introduction");
            return;

        // シナリオ9: 22，23時 (トイレについて / 今日あったことについて)
        case 9:
            await mikuSay(`${person.nickname}さん，今日も一日お疲れさまでした`, uid, "greeting");
            await mikuSay("寝る前にはお手洗いに行きましょう！", uid, "smile");
            await keicho("今日一日を振り返ってみて，なにか思うことはありますか？", config, "self_introduction");
            return;

        default:
            console.warn(`Unknown scenario number: ${num}`);
            return;
    }
};


export { processEvent, startScenario };
