import $ from 'jquery';
import { PersonPreference } from '../../../libs/types/personPreference';
import { Person } from '../../../libs/types/person';
import { putPersonPreference, getPersonPreference } from '../../../libs/queryAndMutation/youid';
import { SensorBoxMessage, Attributes } from '../../../libs/types/sensorBoxMessage';



declare let preference: PersonPreference;
declare let person: Person;
declare const uid: string;
declare let imgtak: boolean;
declare let videostm: HTMLVideoElement;
declare let talking: boolean;

// 外部関数の宣言（必要に応じて実装をインポートまたは定義してください）

declare function loadVideo(): Promise<HTMLVideoElement>;
declare function keicho(message: string, type: string): Promise<void>;
declare function miku_say(message: string, type: string): Promise<void>;
declare function miku_ask(message: string): Promise<string>;



/**
 * センサボックスからのmessageを受け取って、messageの内容に応じて処理を行う関数
 * @param {Message} message センサボックスからのmessage
 */
const processEvent = async (message: SensorBoxMessage): Promise<void> => {
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
                await start_scenario(scenarioNumber);
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
const start_scenario = async (num: number): Promise<void> => {
    let ans: string | undefined;

    // シナリオ0以外は，1日に1回だけやる
    if (num !== 0) {
        const now = new Date();

        if (!preference.preferences.scenarios) { // preferenceにシナリオ管理の値がない場合
            let scenarios: string[] = Array(7).fill("2000-01-01");
            // Preferenceを更新
            let newPref = { ...preference }; // コピーを作成
            delete newPref.keys;
            newPref.preferences.scenarios = scenarios;
            newPref.preferences.scenarios[num] = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
            await putPersonPreference(uid, newPref);
            preference = await getPersonPreference(uid);
        } else {
            const lastRunTime = new Date(preference.preferences.scenarios[num]);
            if (now.getTime() - lastRunTime.getTime() < 24 * 60 * 60 * 1000) {
                console.log(`Scenario #${num} has been already done.`);
                return;
            } else {
                // Preferenceを更新
                let newPref = { ...preference }; // コピーを作成
                delete newPref.keys;
                newPref.preferences.scenarios![num] = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
                await putPersonPreference(uid, newPref);
                preference = await getPersonPreference(uid);
            }
        }
    }
    



    // カメラをオンにする
    if (imgtak === true) {
        videostm = await loadVideo();
    }

    talking = true;
    $("#status").html("");

    switch (num) {
        // シナリオ0: デフォルト
        case 0:
            await keicho("私になんでも話してください", "self_introduction");
            return;

        // シナリオ1: 6，7時 (睡眠について)
        case 1:
            await miku_say(`${person.nickname}さん，おはようございます`, "greeting");
            await keicho("今朝の気分はいかがですか？", "self_introduction");
            return;

        // シナリオ2: 8，9時 (朝食について)
        case 2:
            ans = await miku_ask(`${person.nickname}さん，朝食は食べましたか？（はい／いいえ）`);
            if (/はい/.test(ans) || /食べました/.test(ans)) {
                await miku_ask("何を食べたか教えていただけませんか？");
            } else {
                await miku_ask("何を食べる予定なのか，教えていただけませんか？");
            }
            await miku_say("わかりました，ありがとうございます！", "greeting");
            await keicho("今日の予定を教えていただけませんか？", "self_introduction");
            return;

        // シナリオ3: 10，11時 (水分について)
        case 3:
            ans = await miku_ask(`${person.nickname}さん，水分補給はしていますか？（はい／いいえ）`);
            if (/はい/.test(ans) || /しています/.test(ans)) {
                await miku_say("その調子で，定期的に水分を取るように心がけましょう！", "smile");
            } else {
                await miku_say("定期的に水分を取るように心がけましょう", "self_introduction");
            }
            const today = new Date();
            const topics = ["好きなもの", "嫌いなもの", "興味があること", "趣味", "悩みや気になっていること", "過去や思い出", "今後の予定や夢"];
            await keicho(`${person.nickname}さんの${topics[today.getDay()]}について，話していただけませんか？`, "self_introduction");
            return;

        // シナリオ4: 12，13時 (昼食について)
        case 4:
            ans = await miku_ask(`${person.nickname}さん，昼食は食べましたか？（はい／いいえ）`);
            if (/はい/.test(ans) || /食べました/.test(ans)) {
                await miku_ask("何を食べたか教えていただけませんか？");
            } else {
                await miku_ask("何を食べる予定なのか，教えていただけませんか？");
            }
            await miku_say("わかりました，ありがとうございます！", "greeting");
            await keicho("午前中はどんなことをしたか，話していただけませんか？", "smile");
            return;

        // シナリオ5: 14，15時 (水分について)
        case 5:
            ans = await miku_ask(`${person.nickname}さん，水分補給はしていますか？（はい／いいえ）`);
            if (/はい/.test(ans) || /しています/.test(ans)) {
                await miku_say("その調子で，定期的に水分を取るように心がけましょう！", "smile");
            } else {
                await miku_say("定期的に水分を取るように心がけましょう", "self_introduction");
            }
            const today2 = new Date();
            const feelings = ["楽しかった", "イライラした", "ドキドキした", "悲しかった", "おもしろかった", "つらかった", "嬉しかった"];
            await keicho(`最近あった${feelings[today2.getDay()]}ことについて，話していただけませんか？`, "self_introduction");
            return;

        // シナリオ6: 16，17時 (雑談)
        // youtubeのサービスを使う
        case 6:
            await miku_say(`${person.nickname}さん，こんにちは`, "greeting");
            return;

        // シナリオ7: 18，19時 (夕食について)
        case 7:
            ans = await miku_ask(`${person.nickname}さん，夕食は食べましたか？（はい／いいえ）`);
            if (/はい/.test(ans) || /食べました/.test(ans)) {
                await miku_ask("何を食べたか教えていただけませんか？");
            } else {
                await miku_ask("何を食べる予定なのか，教えていただけませんか？");
            }
            await miku_say("わかりました，ありがとうございます！", "greeting");
            await keicho("午後はどんなことをしたか，話していただけませんか？", "smile");
            return;

        // シナリオ8: 20，21時 (健康について)
        case 8:
            await miku_say(`${person.nickname}さん，こんばんは`, "greeting");
            await keicho("からだやこころの調子はいかがですか？", "self_introduction");
            return;

        // シナリオ9: 22，23時 (トイレについて / 今日あったことについて)
        case 9:
            await miku_say(`${person.nickname}さん，今日も一日お疲れさまでした`, "greeting");
            await miku_say("寝る前にはお手洗いに行きましょう！", "smile");
            await keicho("今日一日を振り返ってみて，なにか思うことはありますか？", "self_introduction");
            return;

        default:
            console.warn(`Unknown scenario number: ${num}`);
            return;
    }
}

export { processEvent, start_scenario };
