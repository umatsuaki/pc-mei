// initialize(): メインの初期化メソッド

// 初期化．ページがロードされると呼び出される
async function initialize() {
    //ここにアプリ固有の処理を書く

    //MMD作成
    mmd = new MMD("localhost:8080", "localhost:39390");

    //ユーザ情報をセット
    uid = getUrlVars()["uid"];
    person = await getPersonInfo(uid);
    preference = await getPersonPreference(uid);
    timerData = preference.preferences.timer;
    alarmArr = preference.preferences.alarm;

    // ユーザ情報の確認
    console.log(person);
    console.log(preference);
    console.log(new Date());

    // GETパラメータ voicerec が no であるときのみ false になる．デフォルトはtrueで．
    voicerec = getUrlVars()["voicerec"] === "no" ? false : true;

    // GETパラメータ imgtak が no であるときのみ false になる．デフォルトはtrueで．
    imgtak = getUrlVars()["imgtak"] === "no" ? false : true;

    // GETパラメータ keicho が yes であるときのみ true になる．デフォルトはfalseで．
    keichoFlag = getUrlVars()["keicho"] === "yes" ? true : false;

    // GETパラメータ seicho が yes であるときのみ true になる．デフォルトはfalseで．
    seichoFlag = getUrlVars()["seicho"] === "yes" ? true : false;

    // サウンドをセット
    const timeSound = document.querySelector("#timeSound");

    // 連携しているサービスをセット
    setService();

    //つけっぱなしのため，1日1回リロードを仕込む
    refreshAt(0, 0);

    // タイマーとアラームをセット
    setTimer();
    setAllAlarm();

    // web socket を初期化
    initWebSocket();

    //  keicho が yes であるとき,傾聴モードで開始する
    if (keichoFlag) {
        keichoMode();
    }
    //  seicho が yes であるとき,静聴モードで開始する
    if (seichoFlag) {
        seichoMode();
    }

    // 会議のリマインド
    await calCheckMtg();

    if (localEventPreference != null) {
        await remindEvent();
    }



    // 当日の会話ログを再表示する
    let dialogueLogs = await getDialogueLogs(new Date());
    for (dialogue of dialogueLogs) {
        if (dialogue.from == "keicho-bot") {
            post_comment(dialogue.contents, SPEAKER.AGENT, "no");
        } else {
            post_comment(dialogue.contents, SPEAKER.USER, "no");
        }
    }

    //開始ボタンを配置
    put_start_button();

    // カレンダーのリマインド
    await calCheckEvt();
}



