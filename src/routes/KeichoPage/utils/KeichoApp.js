// // src/KeichoApp.js

// import React, { useState, useEffect, useRef } from 'react';
// import SockJS from 'sockjs-client';
// import Stomp from 'stompjs';
// import moment from 'moment';
// import { SpeechToText } from './stt';
// import { getPersonInfo, getPersonPreference, putPersonPreference } from './youid';

// // 定数やヘルパー関数を定義
// const SPEAKER = {
//     AGENT: 'keicho-bot',
//     USER: 'user'
// };

// // 追加のヘルパー関数（例：getResponse, miku_sayなど）は別ファイルに分けるか、コンポーネント内に定義

// const KeichoApp = () => {
//     // 状態変数の定義
//     const [stt, setStt] = useState(null);
//     const [mmd, setMmd] = useState(null); // MMDクラスのインスタンスを管理
//     const [person, setPerson] = useState(null);
//     const [preference, setPreference] = useState(null);
//     const [uid, setUid] = useState(null);
//     const [talking, setTalking] = useState(false);
//     const [counter, setCounter] = useState(0);
//     const [voicerec, setVoicerec] = useState(false);
//     const [imgtak, setImgtak] = useState(false);
//     const [summary, setSummary] = useState(false);
//     const [audioDataIndex, setAudioDataIndex] = useState(0);
//     const [imgDataIndex, setImgDataIndex] = useState(0);
//     const [apps, setApps] = useState([]);
//     const [serviceFlag, setServiceFlag] = useState(false);
//     const [keichoFlag, setKeichoFlag] = useState(false);
//     const [seichoFlag, setSeichoFlag] = useState(false);
//     const [status, setStatus] = useState('');

//     // Refs
//     const videoRef = useRef(null);
//     const canvasRef = useRef(null);

//     // WebSocketクライアントの参照
//     const stompClientRef = useRef(null);

//     // SpeechToText インスタンスの参照
//     const sttRef = useRef(null);

//     // 初期化処理
//     useEffect(() => {
//         initialize();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);

//     // WebSocketの初期化関数
//     const initWebSocket = () => {
//         const topic = "sensorbox.presence";
//         const socket = new SockJS("https://wsapp.cs.kobe-u.ac.jp/cs27pubsub/ws");
//         const stompClient = Stomp.over(socket);
//         stompClient.connect({}, (frame) => {
//             console.log('Connected: ' + frame);
//             stompClient.subscribe(`/queue/${topic}`, (event) => {
//                 const body = JSON.parse(event.body);
//                 console.log("Event received", body);
//                 processEvent(body);
//             });
//         }, stompFailureCallback);
//         stompClientRef.current = stompClient;
//     };

//     const stompFailureCallback = (error) => {
//         console.log('STOMP: ' + error);
//         setTimeout(initWebSocket, 10000);
//         console.log('STOMP: Reconnecting in 10 seconds');
//     };

//     // ページリフレッシュ機能
//     const refreshAt = (h, m) => {
//         const goTo = () => {
//             if (talking) {
//                 setTimeout(goTo, 60 * 1000);
//                 return;
//             }
//             window.location.reload();
//         };

//         const now = new Date();
//         const currentS = (now.getHours() * 60 + now.getMinutes()) * 60 + now.getSeconds();
//         let targetS = (h * 60 + m) * 60;
//         let jisaS = targetS - currentS;
//         if (jisaS < 0) jisaS += 24 * 60 * 60;

//         console.log(`あと${jisaS}秒で ${h}時${m}分です`);
//         setTimeout(goTo, jisaS * 1000);
//     };

//     // 初期化関数の定義
//     const initialize = async () => {
//         // MMDの初期化（詳細な実装が必要）
//         const mmdInstance = new MMD("localhost:8080", "localhost:39390");
//         setMmd(mmdInstance);

//         // URLパラメータからuidを取得
//         const urlParams = new URLSearchParams(window.location.search);
//         const uidParam = urlParams.get('uid');
//         setUid(uidParam);

//         // ユーザー情報とプリファレンスを取得
//         try {
//             const personInfo = await getPersonInfo(uidParam);
//             setPerson(personInfo);
//             const personPref = await getPersonPreference(uidParam);
//             setPreference(personPref);

//             // タイマーとアラームの設定（詳細な実装が必要）
//             // setTimer();
//             // setAllAlarm();
//         } catch (error) {
//             console.error("Initialization error:", error);
//         }

//         // 各種GETパラメータの取得
//         setVoicerec(urlParams.get('voicerec') !== 'no');
//         setImgtak(urlParams.get('imgtak') !== 'no');
//         setKeichoFlag(urlParams.get('keicho') === 'yes');
//         setSeichoFlag(urlParams.get('seicho') === 'yes');

//         // 要約モードの設定
//         if (personPref.preferences.summary) {
//             setSummary(true);
//         }

//         // サービス連携の設定（詳細な実装が必要）
//         // setService();

//         // 1日1回のリロードを設定
//         refreshAt(0, 0);

//         // WebSocketの初期化
//         initWebSocket();

//         // モードの開始
//         if (urlParams.get('keicho') === 'yes') {
//             keichoMode();
//         }
//         if (urlParams.get('seicho') === 'yes') {
//             seichoMode();
//         }

//         // 会議のリマインドやイベントリマインド（詳細な実装が必要）
//         // await calCheckMtg();
//         // if (localEventPreference != null) {
//         //     await remindEvent();
//         // }

//         // 当日の会話ログを再表示（詳細な実装が必要）
//         let dialogueLogs = await getDialogueLogs(new Date());
//         for (let dialogue of dialogueLogs) {
//             if (dialogue.from === "keicho-bot") {
//                 post_comment(dialogue.contents, SPEAKER.AGENT, "no");
//             } else {
//                 post_comment(dialogue.contents, SPEAKER.USER, "no");
//             }
//         }

//         // 開始ボタンを配置
//         // put_start_button();

//         // カレンダーのリマインド（詳細な実装が必要）
//         // await calCheckEvt();
//     };

//     // イベント処理関数
//     const processEvent = async (message) => {
//         let attr = null;
//         if (message.attributes.subject === preference.preferences.sensorbox) {
//             attr = message.attributes;
//             console.log(attr);
//         } else {
//             console.log("It is not my message");
//             return;
//         }

//         if (attr != null) {
//             const now = new Date();
//             let drift = preference.preferences.drift || 0;
//             let adjustedHour = now.getHours() - drift;
//             if (adjustedHour < 0) adjustedHour += 24;

//             let num;
//             switch (adjustedHour) {
//                 case 6:
//                 case 7:
//                     num = 1;
//                     break;
//                 case 8:
//                 case 9:
//                     num = 2;
//                     break;
//                 case 10:
//                 case 11:
//                     num = 3;
//                     break;
//                 case 12:
//                 case 13:
//                     num = 4;
//                     break;
//                 case 14:
//                 case 15:
//                     num = 5;
//                     break;
//                 case 16:
//                 case 17:
//                     num = 6;
//                     break;
//                 case 18:
//                 case 19:
//                     num = 7;
//                     break;
//                 case 20:
//                 case 21:
//                     num = 8;
//                     break;
//                 case 22:
//                 case 23:
//                     num = 9;
//                     break;
//                 default:
//                     return;
//             }

//             switch (attr.event) {
//                 case "present":
//                     if (!talking && !seichoFlag && !serviceFlag /* && !youtubeFlag */) {
//                         start_scenario(num);
//                     } else {
//                         console.log("Event cancelled.");
//                     }
//                     break;
//                 case "absent":
//                     // 不在イベント処理（必要に応じて実装）
//                     break;
//                 case "force":
//                     if (talking) {
//                         end_keicho("またお話ししてくださいね");
//                     } else {
//                         start_scenario(0);
//                     }
//                     break;
//                 case "pushed":
//                     if (!talking) {
//                         setCounter((prev) => (prev + 1) % 7);
//                         start_scenario(counter);
//                     } else {
//                         console.log("Mei-chan is now talking. Event cancelled.");
//                     }
//                     break;
//                 default:
//                     console.log("None of event observed.");
//             }
//         } else {
//             console.log("None of event observed.");
//         }
//     };

//     // シナリオ開始関数
//     const start_scenario = async (num) => {
//         if (num !== 0) {
//             const now = new Date();
//             if (preference.preferences.scenarios) {
//                 const lastDone = new Date(preference.preferences.scenarios[num]);
//                 if (now - lastDone < 24 * 60 * 60 * 1000) {
//                     console.log(`Scenario #${num} has been already done.`);
//                     return;
//                 }
//             }

//             // Preferenceの更新
//             const newPref = { ...preference };
//             newPref.preferences.scenarios = newPref.preferences.scenarios || Array(7).fill("2000-01-01");
//             newPref.preferences.scenarios[num] = moment().format('YYYY-M-D');
//             await putPersonPreference(uid, newPref);
//             setPreference(newPref);
//         }

//         // 音声録音や画像キャプチャの初期化
//         if (voicerec || imgtak) {
//             setAudioDataIndex(0);
//             setImgDataIndex(0);
//             const pDirectoryCheck = await audioDataParentDirectoryCheck();
//             if (!pDirectoryCheck) {
//                 await audioDataParentDirectoryCreate();
//             }
//             await audioDataDirectoryCreate();
//         }

//         // カメラをオンにする
//         if (imgtak) {
//             await loadVideo();
//         }

//         setTalking(true);
//         setStatus('');

//         switch (num) {
//             case 0:
//                 await keicho("私になんでも話してください", "self_introduction");
//                 return;
//             case 1:
//                 await miku_say(`${person.nickname}さん，おはようございます`, "greeting");
//                 if (preference.preferences.garmin) {
//                     await miku_say("今日の睡眠を振り返ります", "self_introduction");
//                     await garminScenario("sleeps");
//                 }
//                 await keicho("今朝の気分はいかがですか？", "self_introduction");
//                 return;
//             case 2:
//                 // 8,9時のシナリオ
//                 await handleBreakfastScenario();
//                 return;
//             case 3:
//                 // 10,11時のシナリオ
//                 await handleHydrationScenario();
//                 return;
//             case 4:
//                 // 12,13時のシナリオ
//                 await handleLunchScenario();
//                 return;
//             case 5:
//                 // 14,15時のシナリオ
//                 await handleAfternoonScenario();
//                 return;
//             case 6:
//                 // 16,17時のシナリオ
//                 await handleConversationScenario();
//                 return;
//             case 7:
//                 // 18,19時のシナリオ
//                 await handleDinnerScenario();
//                 return;
//             case 8:
//                 // 20,21時のシナリオ
//                 await handleHealthScenario();
//                 return;
//             case 9:
//                 // 22,23時のシナリオ
//                 await handleEveningScenario();
//                 return;
//             default:
//                 console.log(`Unknown scenario number: ${num}`);
//         }
//     };

//     // 各シナリオ関数の例
//     const handleBreakfastScenario = async () => {
//         let ans = await miku_ask(`${person.nickname}さん，朝食は食べましたか？（はい／いいえ）`);
//         if (/はい|食べました/.test(ans)) {
//             await miku_ask("何を食べたか教えていただけませんか？");
//         } else {
//             await miku_ask("何を食べる予定なのか，教えていただけませんか？");
//         }
//         await miku_say("わかりました，ありがとうございます！", "greeting");
//         await keicho("今日の予定を教えていただけませんか？", "self_introduction");
//     };

//     const handleHydrationScenario = async () => {
//         let ans = await miku_ask(`${person.nickname}さん，水分補給はしていますか？（はい／いいえ）`);
//         if (/はい|しています/.test(ans)) {
//             await miku_say("その調子で，定期的に水分を取るように心がけましょう！", "smile");
//         } else {
//             await miku_say("定期的に水分を取るように心がけましょう", "self_introduction");
//         }
//         const today = new Date();
//         const str = ["好きなもの", "嫌いなもの", "興味があること", "趣味", "悩みや気になっていること", "過去や思い出", "今後の予定や夢"];
//         await keicho(`${person.nickname}さんの${str[today.getDay()]}について，話していただけませんか？`, "self_introduction");
//     };

//     const handleLunchScenario = async () => {
//         let ans = await miku_ask(`${person.nickname}さん，昼食は食べましたか？（はい／いいえ）`);
//         if (/はい|食べました/.test(ans)) {
//             await miku_ask("何を食べたか教えていただけませんか？");
//         } else {
//             await miku_ask("何を食べる予定なのか，教えていただけませんか？");
//         }
//         await miku_say("わかりました，ありがとうございます！", "greeting");
//         await keicho("午前中はどんなことをしたか，話していただけませんか？", "smile");
//     };

//     const handleAfternoonScenario = async () => {
//         let ans = await miku_ask(`${person.nickname}さん，水分補給はしていますか？（はい／いいえ）`);
//         if (/はい|しています/.test(ans)) {
//             await miku_say("その調子で，定期的に水分を取るように心がけましょう！", "smile");
//         } else {
//             await miku_say("定期的に水分を取るように心がけましょう", "self_introduction");
//         }
//         const today = new Date();
//         const str = ["楽しかった", "イライラした", "ドキドキした", "悲しかった", "おもしろかった", "つらかった", "嬉しかった"];
//         await keicho(`最近あった${str[today.getDay()]}ことについて，話していただけませんか？`, "self_introduction");
//     };

//     const handleConversationScenario = async () => {
//         let ans = await miku_ask(`${person.nickname}さん，いまお時間はありますか？（はい／いいえ）`);
//         if (/はい|ある|あります/.test(ans)) {
//             const today = new Date();
//             const keyword = apps[today.getDay()].keyword === "YouTube" ? "ユーチューブ(YouTube)" : apps[today.getDay()].keyword;
//             const description = apps[today.getDay()].description;
//             await miku_say(`私は${description}をすることができます`, "smile");
//             await keicho(`よければ私に${keyword}と言ってみて下さい`, "self_introduction");
//         } else {
//             await end_keicho("わかりました．またお話ししてくださいね");
//         }
//     };

//     const handleDinnerScenario = async () => {
//         let ans = await miku_ask(`${person.nickname}さん，夕食は食べましたか？（はい／いいえ）`);
//         if (/はい|食べました/.test(ans)) {
//             await miku_ask("何を食べたか教えていただけませんか？");
//         } else {
//             await miku_ask("何を食べる予定なのか，教えていただけませんか？");
//         }
//         await miku_say("わかりました，ありがとうございます！", "greeting");
//         await keicho("午後はどんなことをしたか，話していただけませんか？", "smile");
//     };

//     const handleHealthScenario = async () => {
//         await miku_say(`${person.nickname}さん，こんばんは`, "greeting");
//         if (preference.preferences.garmin) {
//             await miku_say("今日の健康を振り返ります", "self_introduction");
//             if (await garminScenario("dailies")) {
//                 await garminScenario("stressDetails");
//             }
//         }
//         await keicho("からだやこころの調子はいかがですか？", "self_introduction");
//     };

//     const handleEveningScenario = async () => {
//         await miku_say(`${person.nickname}さん，今日も一日お疲れさまでした`, "greeting");
//         await miku_say("寝る前にはお手洗いに行きましょう！", "smile");
//         await keicho("今日一日を振り返ってみて，なにか思うことはありますか？", "self_introduction");
//     };

//     // 傾聴関数
//     const keicho = async (str, motion) => {
//         while (talking) {
//             if (!talking) return;

//             setServiceFlag(false);
//             const answer = await miku_ask(str, false, motion);
//             str = "";
//             motion = get_motion();

//             if (!talking) return;

//             if (seichoFlag) {
//                 if (/終わり$|やめる$/.test(answer)) {
//                     await end_keicho("またお話ししてくださいね", "bye");
//                     return;
//                 }
//                 if (answer.length === 0) {
//                     continue;
//                 }
//                 if (answer.length < 20) {
//                     if (/終わり|やめる|またね$|バイバイ$|終了$|以上$/.test(answer)) {
//                         await end_keicho("またお話ししてくださいね", "bye");
//                         return;
//                     } else if (/対話モード/.test(answer)) {
//                         setKeichoFlag(false);
//                         setSeichoFlag(false);
//                         taiwaMode();
//                         str = "対話モードに切り替えます";
//                         motion = "greeting";
//                         continue;
//                     } else if (/傾聴モード|慶弔モード|緊張モード/.test(answer)) {
//                         setKeichoFlag(true);
//                         setSeichoFlag(false);
//                         keichoMode();
//                         str = "傾聴モードに切り替えます";
//                         motion = "greeting";
//                         continue;
//                     } else if (/ちょっと GPT|チャットGPT|チャット GPT|チャット CPT|ちょっと CPT|教えて|ききたい/.test(answer)) {
//                         motion = "greeting";
//                         await chatgpt();
//                         continue;
//                     } else if (/天気予報/.test(answer)) {
//                         motion = "greeting";
//                         weather();
//                         continue;
//                     }
//                 }
//             }

//             if (answer.length === 0) {
//                 continue;
//             }

//             if (/終わり$|やめる$/.test(answer)) {
//                 await end_keicho("またお話ししてくださいね", "bye");
//                 return;
//             }
//             if (answer.length < 20) {
//                 if (/終わり|やめる|またね$|バイバイ$|終了$|以上$/.test(answer)) {
//                     await end_keicho("またお話ししてくださいね", "bye");
//                     return;
//                 } else if (keichoFlag && /対話モード/.test(answer)) {
//                     setKeichoFlag(false);
//                     setSeichoFlag(false);
//                     taiwaMode();
//                     str = "対話モードに切り替えます";
//                     motion = "greeting";
//                     continue;
//                 } else if (!keichoFlag && /傾聴モード|慶弔モード|緊張モード/.test(answer)) {
//                     setKeichoFlag(true);
//                     setSeichoFlag(false);
//                     keichoMode();
//                     str = "傾聴モードに切り替えます";
//                     motion = "greeting";
//                     continue;
//                 } else if (/静聴 モード|成長 モード/.test(answer)) {
//                     setKeichoFlag(false);
//                     setSeichoFlag(true);
//                     seichoMode();
//                     str = "静聴モードに切り替えます";
//                     motion = "greeting";
//                     continue;
//                 } else if (/メニュー/.test(answer)) {
//                     await menu();
//                     str = "なんでもお申し付けください";
//                     motion = "greeting";
//                     continue;
//                 } else if ((keichoFlag && /こんにちは/.test(answer)) ||
//                     (/こんばんは/.test(answer)) ||
//                     (/おはよう/.test(answer))) {
//                     str = getGreeting();
//                     continue;
//                 } else if (keichoFlag && /ありがとう/.test(answer)) {
//                     str = "どういたしまして";
//                     continue;
//                 } else if ((/あなた/.test(answer) || /君/.test(answer)) &&
//                     (/名前は$/.test(answer) || (/名前/.test(answer) && /何/.test(answer)))) {
//                     str = "私の名前はメイです";
//                     continue;
//                 } else if (/あなたは誰/.test(answer) ||
//                     /君は誰/.test(answer) ||
//                     (/自己紹介/.test(answer) && /して/.test(answer))) {
//                     str = "私はあなたの日常生活を支えるエージェント，メイです！";
//                     continue;
//                 } else if ((/今日/.test(answer) && /何日/.test(answer)) ||
//                     /今日の日付は$/.test(answer) ||
//                     /日付を教えて/.test(answer)) {
//                     str = await tellDte();
//                     motion = "self_introduction";
//                     continue;
//                 } else if ((/今日/.test(answer) && /何曜日/.test(answer)) ||
//                     /今日の曜日は$/.test(answer) ||
//                     /曜日を教えて/.test(answer)) {
//                     str = await tellDayOfWeek();
//                     motion = "self_introduction";
//                     continue;
//                 } else if ((/今/.test(answer) && /何時/.test(answer)) ||
//                     /今の時間は$/.test(answer) ||
//                     /時間を教えて/.test(answer)) {
//                     str = await tellTime();
//                     motion = "self_introduction";
//                     continue;
//                 } else if ((/動画/.test(answer) || /ビデオ/.test(answer)) &&
//                     /見たい/.test(answer)) {
//                     str = "動画が見たいときは，私に「ユーチューブ(YouTube)」と言って下さい";
//                     continue;
//                 } else if (/調べたい/.test(answer) ||
//                     (/調べ物/.test(answer) && /したい/.test(answer))) {
//                     str = "調べ物をしたいときは，私に「検索」と言って下さい";
//                     continue;
//                 } else if (/チャットGPT/.test(answer) ||
//                     (/教えて/.test(answer)) ||
//                     (/調べ物/.test(answer) ||
//                         (/調べたい/.test(answer)))) {
//                     str = "調べものをしたいときは，私に「チャットGPT」と言って下さい";
//                     continue;
//                 } else if (/天気は$/.test(answer) ||
//                     /天気は何/.test(answer) ||
//                     /天気を教えて/.test(answer)) {
//                     str = "天気が知りたいときは，私に「天気予報」と言って下さい";
//                     continue;
//                 } else {
//                     // サービス実行のキーワード判定（詳細な実装が必要）
//                     let flag = await checkKeyword(answer);
//                     if (flag) {
//                         if (!serviceFlag) {
//                             str = "このサービスはいかがでしたか？";
//                             motion = "self_introduction";
//                         } else {
//                             str = "";
//                         }
//                         continue;
//                     }
//                 }
//             }

//             if (summary) {
//                 // 要約文の取得（詳細な実装が必要）
//                 const summaryReply = await get_summaryReply(person.uid, { "str": answer });
//                 if (summaryReply.str) {
//                     str = summaryReply.str;
//                 } else {
//                     str = get_aiduchi();
//                 }
//                 continue;
//             }

//             if (!keichoFlag) {
//                 // ローディング表示（詳細な実装が必要）
//                 // post_loading();
//                 try {
//                     str = await getResponse(answer);
//                 } catch {
//                     str = get_aiduchi();
//                 }
//             }

//             if (str.length < 1) {
//                 str = get_aiduchi();
//             }
//         }
//     };

//     // 会話終了関数
//     const end_keicho = async (str, motion = "bye") => {
//         if (!talking) return;

//         // YouTube再生中なら動画を止める（詳細な実装が必要）
//         if (/* youtubeFlag */ false) {
//             // ytplayer.stopVideo();
//         }

//         if (sttRef.current) {
//             sttRef.current.stop();
//             setStt(null);
//         }

//         if (imgtak) {
//             await stopVideo();
//         }

//         if (str) {
//             await miku_say(str, motion);
//         }

//         await runMeboApi("会話終了");
//         console.log("傾聴終了");
//         setStatus('');
//         setTalking(false);
//         setServiceFlag(false);
//         put_start_button();
//     };

//     // 開始ボタンを配置する関数
//     const put_start_button = () => {
//         // React では状態を使って表示を制御
//         // ここでは単純に状態を変更する例を示します
//         // ボタンを表示するための状態変数を追加する必要があります
//         // 例：setShowStartButton(true);
//     };

//     // 傾聴モードの開始関数
//     const keicho = async (str, motion) => {
//         while (talking) {
//             if (!talking) return;

//             setServiceFlag(false);
//             const answer = await miku_ask(str, false, motion);
//             str = "";
//             motion = get_motion();

//             if (!talking) return;

//             // 静聴モード
//             if (seichoFlag) {
//                 if (/終わり$|やめる$/.test(answer)) {
//                     await end_keicho("またお話ししてくださいね", "bye");
//                     return;
//                 }
//                 if (answer.length === 0) {
//                     continue;
//                 }
//                 if (answer.length < 20) {
//                     if (/終わり|やめる|またね$|バイバイ$|終了$|以上$/.test(answer)) {
//                         await end_keicho("またお話ししてくださいね", "bye");
//                         return;
//                     } else if (/対話モード/.test(answer)) {
//                         setKeichoFlag(false);
//                         setSeichoFlag(false);
//                         taiwaMode();
//                         str = "対話モードに切り替えます";
//                         motion = "greeting";
//                         continue;
//                     } else if (/傾聴モード|慶弔モード|緊張モード/.test(answer)) {
//                         setKeichoFlag(true);
//                         setSeichoFlag(false);
//                         keichoMode();
//                         str = "傾聴モードに切り替えます";
//                         motion = "greeting";
//                         continue;
//                     } else if (/ちょっと GPT|チャットGPT|チャット GPT|チャット CPT|ちょっと CPT|教えて|ききたい/.test(answer)) {
//                         motion = "greeting";
//                         await chatgpt();
//                         continue;
//                     } else if (/天気予報/.test(answer)) {
//                         motion = "greeting";
//                         weather();
//                         continue;
//                     }
//                 }
//             }

//             if (answer.length === 0) {
//                 continue;
//             }

//             // キーワードの判定
//             if (/終わり$|やめる$/.test(answer)) {
//                 await end_keicho("またお話ししてくださいね", "bye");
//                 return;
//             }
//             if (answer.length < 20) {
//                 if (/終わり|やめる|またね$|バイバイ$|終了$|以上$/.test(answer)) {
//                     await end_keicho("またお話ししてくださいね", "bye");
//                     return;
//                 } else if (keichoFlag && /対話モード/.test(answer)) {
//                     setKeichoFlag(false);
//                     setSeichoFlag(false);
//                     taiwaMode();
//                     str = "対話モードに切り替えます";
//                     motion = "greeting";
//                     continue;
//                 } else if (!keichoFlag && /傾聴モード|慶弔モード|緊張モード/.test(answer)) {
//                     setKeichoFlag(true);
//                     setSeichoFlag(false);
//                     keichoMode();
//                     str = "傾聴モードに切り替えます";
//                     motion = "greeting";
//                     continue;
//                 } else if (/静聴 モード|成長 モード/.test(answer)) {
//                     setKeichoFlag(false);
//                     setSeichoFlag(true);
//                     seichoMode();
//                     str = "静聴モードに切り替えます";
//                     motion = "greeting";
//                     continue;
//                 } else if (/メニュー/.test(answer)) {
//                     await menu();
//                     str = "なんでもお申し付けください";
//                     motion = "greeting";
//                     continue;
//                 } else if ((keichoFlag && /こんにちは/.test(answer)) ||
//                     (/こんばんは/.test(answer)) ||
//                     (/おはよう/.test(answer))) {
//                     str = getGreeting();
//                     continue;
//                 } else if (keichoFlag && /ありがとう/.test(answer)) {
//                     str = "どういたしまして";
//                     continue;
//                 } else if ((/あなた/.test(answer) || /君/.test(answer)) &&
//                     (/名前は$/.test(answer) || (/名前/.test(answer) && /何/.test(answer)))) {
//                     str = "私の名前はメイです";
//                     continue;
//                 } else if (/あなたは誰/.test(answer) ||
//                     /君は誰/.test(answer) ||
//                     (/自己紹介/.test(answer) && /して/.test(answer))) {
//                     str = "私はあなたの日常生活を支えるエージェント，メイです！";
//                     continue;
//                 } else if ((/今日/.test(answer) && /何日/.test(answer)) ||
//                     /今日の日付は$/.test(answer) ||
//                     /日付を教えて/.test(answer)) {
//                     str = await tellDte();
//                     motion = "self_introduction";
//                     continue;
//                 } else if ((/今日/.test(answer) && /何曜日/.test(answer)) ||
//                     /今日の曜日は$/.test(answer) ||
//                     /曜日を教えて/.test(answer)) {
//                     str = await tellDayOfWeek();
//                     motion = "self_introduction";
//                     continue;
//                 } else if ((/今/.test(answer) && /何時/.test(answer)) ||
//                     /今の時間は$/.test(answer) ||
//                     /時間を教えて/.test(answer)) {
//                     str = await tellTime();
//                     motion = "self_introduction";
//                     continue;
//                 } else if ((/動画/.test(answer) || /ビデオ/.test(answer)) &&
//                     /見たい/.test(answer)) {
//                     str = "動画が見たいときは，私に「ユーチューブ(YouTube)」と言って下さい";
//                     continue;
//                 } else if (/調べたい/.test(answer) ||
//                     (/調べ物/.test(answer) && /したい/.test(answer))) {
//                     str = "調べ物をしたいときは，私に「検索」と言って下さい";
//                     continue;
//                 } else if (/チャットGPT/.test(answer) ||
//                     (/教えて/.test(answer)) ||
//                     (/調べ物/.test(answer) ||
//                         (/調べたい/.test(answer)))) {
//                     str = "調べものをしたいときは，私に「チャットGPT」と言って下さい";
//                     continue;
//                 } else if (/天気は$/.test(answer) ||
//                     /天気は何/.test(answer) ||
//                     /天気を教えて/.test(answer)) {
//                     str = "天気が知りたいときは，私に「天気予報」と言って下さい";
//                     continue;
//                 } else {
//                     // サービス実行のキーワード判定
//                     let flag = await checkKeyword(answer);
//                     if (flag) {
//                         if (!serviceFlag) {
//                             str = "このサービスはいかがでしたか？";
//                             motion = "self_introduction";
//                         } else {
//                             str = "";
//                         }
//                         continue;
//                     }
//                 }
//             }

//             if (summary) {
//                 // 要約文の取得
//                 try {
//                     const data = await get_summaryReply(person.uid, { "str": answer });
//                     if (data.str) {
//                         str = data.str;
//                     } else {
//                         str = get_aiduchi();
//                     }
//                 } catch {
//                     str = get_aiduchi();
//                 }
//                 continue;
//             }

//             if (!keichoFlag) {
//                 // ローディング表示（実装が必要）
//                 // post_loading();
//                 try {
//                     str = await getResponse(answer);
//                 } catch {
//                     str = get_aiduchi();
//                 }
//             }

//             if (str.length < 1) {
//                 str = get_aiduchi();
//             }
//         }
//     };

//     // モード切替関数
//     const taiwaMode = () => {
//         document.body.style.backgroundColor = "#cce3f7";
//         setKeichoFlag(false);
//         setSeichoFlag(false);
//         console.log("対話モード");
//     };

//     const keichoMode = () => {
//         document.body.style.backgroundColor = "rgb(150, 175, 200)";
//         setKeichoFlag(true);
//         setSeichoFlag(false);
//         console.log("傾聴モード");
//     };

//     const seichoMode = () => {
//         document.body.style.backgroundColor = "rgb(150, 150, 150)";
//         setKeichoFlag(false);
//         setSeichoFlag(true);
//         console.log("静聴モード");
//     };

//     // 挨拶取得関数
//     const getGreeting = () => {
//         const now = new Date();
//         const hour = now.getHours();
//         let greet;

//         if (3 <= hour && hour < 12) {
//             greet = "おはようございます．";
//         } else if (12 <= hour && hour < 18) {
//             greet = "こんにちは．";
//         } else {
//             greet = "こんばんは．";
//         }

//         if (person && person.nickname) {
//             greet = `${person.nickname}さん，${greet}`;
//         }

//         return greet;
//     };

//     // Mikuが話す関数
//     const miku_say = async (str, motion = "smile") => {
//         if (!talking || !str.length) return;
//         await mmd.doMotion(motion);
//         console.log("miku says " + str);
//         post_keicho(str, SPEAKER.AGENT, person);
//         if (!seichoFlag) {
//             // 音声認識用のメソッドを呼び出す
//             await mmd.speakSync(str);
//         }
//         return str;
//     };

//     // Mikuが質問する関数
//     const miku_ask = async (str, confirm = false, motion = "smile") => {
//         if (!talking) return;

//         await miku_say(str, motion);

//         // 音声認識や録音のインクリメント（必要に応じて実装）
//         if (voicerec) {
//             setAudioDataIndex((prev) => prev + 1);
//         }
//         if (imgtak) {
//             setImgDataIndex((prev) => prev + 1);
//         }

//         // 2分間のタイムアウト処理（詳細な実装が必要）
//         const timeoutId = setTimeout(() => {
//             if (talking) {
//                 console.log("強制終了");
//                 end_keicho("");
//                 window.location.reload();
//             }
//         }, 2 * 60 * 1000);

//         let answer = '';
//         try {
//             // SpeechToText インスタンスを開始
//             if (!sttRef.current) {
//                 sttRef.current = new SpeechToText("ja", (text) => {
//                     answer = text;
//                 }, false, setStatus);
//                 sttRef.current.start();
//             }

//             // 音声認識結果を待つ（実装が必要）
//             // ここでは単純に待機する例を示します
//             await new Promise((resolve) => {
//                 const checkAnswer = setInterval(() => {
//                     if (answer.length > 0) {
//                         clearInterval(checkAnswer);
//                         resolve();
//                     }
//                 }, 500);
//             });

//             clearTimeout(timeoutId);
//             post_keicho(answer, SPEAKER.USER, person);
//             return answer;
//         } catch (error) {
//             clearTimeout(timeoutId);
//             console.error("miku_ask error:", error);
//             return '';
//         }
//     };

//     // あいづち取得関数
//     const get_aiduchi = () => {
//         const aiduchi = [
//             "はい", "はい", "ええ", "えーえー", "まあ", "まあ", "そうですか",
//             "そうですか", "そうなんですね", "そうなんですね", "そうでしたか",
//             "そうでしたか", "なんでも話してください", "もっと教えてください",
//             "もっと教えてください", "もっと教えてください", "そんなことがあったんですね",
//             "そんなことがあったんですね", "そんなことがあったんですね",
//             "それからどうなりましたか？", "それは大変でしたね",
//             "ほかにどんなことがありましたか？", "ええ", "ええ", "うーん",
//             "まあ！それはすごい", "あらあら", "そうだったんですね",
//             "そうだったんですね", "そうだったんですね", "わかりました", "わかりました",
//         ];
//         return aiduchi[Math.floor(Math.random() * aiduchi.length)];
//     };

//     // モーション取得関数
//     const get_motion = () => {
//         const motions = [
//             "smile", "imagine_left", "imagine_right", "guide_normal",
//             "guide_normal", "guide_normal", "guide_normal", "self_introduction",
//             "idle_think", "point_left", "point_right",
//         ];
//         return motions[Math.floor(Math.random() * motions.length)];
//     };

//     // キーワードチェック関数（詳細な実装が必要）
//     const checkKeyword = async (answer) => {
//         // 例として、キーワードの存在を確認
//         // 実際には、COTOHA API を使用してキーワード抽出を行う
//         return false;
//     };

//     // Mebo API 実行関数
//     const runMeboApi = async (ans) => {
//         const id = uid.substring(0, 20);
//         const url = `https://wsapp.cs.kobe-u.ac.jp/ozono-nodejs/api/mebo/uid=${id}/utterance=${ans}`;
//         try {
//             const response = await fetch(url, { method: 'GET', mode: 'cors' });
//             if (response.status.toString().startsWith("20")) {
//                 return await response.json();
//             } else {
//                 throw new Error(response.statusText);
//             }
//         } catch (err) {
//             console.error(err);
//             throw err;
//         }
//     };

//     // 対応する応答取得関数
//     const getResponse = async (ans) => {
//         try {
//             const result = await runMeboApi(ans);
//             console.log(result);

//             // ローディング表示を消す（実装が必要）

//             if (result.bestResponse.score >= 0.01) {
//                 let str = result.bestResponse.utterance;
//                 while (str.includes("。")) {
//                     let str1 = str.substring(0, str.indexOf("。"));
//                     let str2 = str.substr(str.indexOf("。") + 1);
//                     if (str2.length > 0) {
//                         await miku_say(str1);
//                         str = str2;
//                     } else {
//                         return str1;
//                     }
//                 }
//                 return str;
//             } else {
//                 return "";
//             }
//         } catch (error) {
//             console.error("getResponse error:", error);
//             return "";
//         }
//     };

//     // 要約文取得関数（詳細な実装が必要）
//     const get_summaryReply = async (uid, body) => {
//         const url = `https://wsapp.cs.kobe-u.ac.jp/keicho-nodejs/keichosummary-api/uid=${uid}/keichosummary.api`;
//         try {
//             const response = await fetch(url, {
//                 method: 'POST',
//                 headers: {
//                     "Content-Type": "application/json; charset=utf-8",
//                 },
//                 body: JSON.stringify(body),
//             });
//             if (response.status === 200) {
//                 return await response.json();
//             } else {
//                 throw new Error(response.statusText);
//             }
//         } catch (err) {
//             console.error(err);
//             throw err;
//         }
//     };

//     // 傾聴終了後の処理
//     const end_keicho = async (str, motion = "bye") => {
//         if (!talking) return;

//         // YouTube再生中なら動画を止める（実装が必要）
//         if (/* youtubeFlag */ false) {
//             // ytplayer.stopVideo();
//         }

//         if (sttRef.current) {
//             sttRef.current.stop();
//             setStt(null);
//         }

//         if (imgtak) {
//             await stopVideo();
//         }

//         if (str) {
//             await miku_say(str, motion);
//         }

//         await runMeboApi("会話終了");
//         console.log("傾聴終了");
//         setStatus('');
//         setTalking(false);
//         setServiceFlag(false);
//         put_start_button();
//     };

//     // その他必要な関数の実装（例：miku_say, miku_ask, get_motion, get_aiduchi, menu, etc.）
//     // これらの関数は、keicho.js の関数をReactに合わせて適切に移植する必要があります。

//     // 例：あいづちをポストする関数
//     const post_keicho = (str, speaker, person) => {
//         if (str.length >= 1) {
//             console.log(`文字列の長さ: ${str.length}`);
//             post_comment(str, speaker);
//             post_database(str, speaker, person);
//         }
//     };

//     // コメントをポストする関数（実装が必要）
//     const post_comment = (str, speaker) => {
//         // UI にコメントを追加するための実装
//         // 例：状態変数にコメントを追加
//     };

//     // データベースにコメントをポストする関数
//     const post_database = async (str, speaker, person) => {
//         const url = 'https://wsapp.cs.kobe-u.ac.jp/~masa-n/FluentdProxy/proxy.cgi';
//         const data = {
//             from: speaker === SPEAKER.AGENT ? "keicho-bot" : person.uid,
//             to: speaker === SPEAKER.AGENT ? person.uid : "keicho-bot",
//             contents: str,
//             dataType: "text",
//             timestamp: moment().format()
//         };
//         const tag = `va.keicho.${person.uid}`;

//         const form = new FormData();
//         form.append("t", tag);
//         form.append("p", "renkon");
//         form.append("j", JSON.stringify(data));

//         try {
//             const response = await fetch(url, {
//                 method: "POST",
//                 body: form,
//                 mode: 'cors',
//             });
//             if (response.ok) {
//                 console.log('post DB success:', str);
//             } else {
//                 throw new Error(response.statusText);
//             }
//         } catch (err) {
//             console.error("post DB error:", str, err);
//         }
//     };

//     // ボタン押下時の処理
//     const handleStartButtonClick = () => {
//         start_scenario(0);
//         // ボタンを非表示にする（実装が必要）
//     };

//     // JSXのレンダリング
//     return (
//         <div>
//             <div id="status">{status}</div>
//             {/* 会話ログ表示エリア */}
//             <div id="dialogueLogs">
//                 {/* コメントを表示するコンポーネントや要素 */}
//             </div>
//             {/* 開始ボタン */}
//             {!talking && (
//                 <button onClick={handleStartButtonClick}>メイちゃんと話す</button>
//             )}
//             {/* Canvas要素（画像キャプチャ用） */}
//             <canvas id="imgcvs" ref={canvasRef} style={{ display: 'none' }}></canvas>
//             {/* Video要素（画像キャプチャ用） */}
//             <video ref={videoRef} style={{ display: 'none' }}></video>
//             {/* その他のUI要素 */}
//         </div>
//     );
// };

// export default KeichoApp;
