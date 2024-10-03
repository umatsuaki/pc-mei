

// ページに回答をポストする

import dayjs from "dayjs";
import 'dayjs/locale/ja';
import { SPEAKER } from "../../../libs/types/speaker";
import { postDialogueLogs } from "../../../libs/queryAndMutation/dialoguelogs";
import { MikuActionLog } from "../../../libs/types/mikuActionLog";
import { formatDate } from "../../../libs/utils";
import { MikuActionConfig } from "../../../libs/types/mikuActionConfig";
import { startScenario } from "./eventProcessor";
import meiNormalImg from "../../../assets/img/mei_normal.png";
import $ from "jquery";

dayjs.locale('ja');

const bottomElement = document.getElementById("bottom");
const scrollTopValue = bottomElement ? bottomElement.offsetTop : 0;

// 引数は，回答テキストと話者(SPEAKER.AGENT または SPEAKER.USER)
const postComment = (str: string | null, speaker: SPEAKER, animation: string) => {
    if (str != null) {
        console.log("聞こえました！！！");
        const now = new Date();

        let comment: JQuery<HTMLElement>;
        if (speaker == SPEAKER.AGENT) {
            if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
                comment = $("<div></div>", {
                    class: "bubble bubble-half-bottom normal",
                }).html(
                    `<div style='display:flex;'>
                <img style='border-radius:50%;width:75px;height:85px' src='${meiNormalImg}'>
                <font style='margin-top:5px;margin-left:10px;'>${str}</font>
            </div>`
                );
            } else {
                comment = $("<div></div>", {
                    class: "bubble bubble-half-bottom normal",
                }).html(str);
            }
        } else {
            comment = $("<div></div>", {
                class: "bubble-right bubble-right-half-bottom normal",
            }).text(str);
        }

        const timestamp = $("<div></div>", {
            class: "timestamp",
        }).text(`[${now.toLocaleString()}]`);

        comment.append(timestamp);

        const bubble = $("<div></div>", {
            class: "container",
        }).append(comment);

        $("#timeline").append(bubble);

        if (animation !== "no") {
            $("html,body").animate({ scrollTop: scrollTopValue });
        }
    }
}

// ページにログをポストする
// 引数はAPIから返ってくるログリスト(json文字列)

const postLog = (logList: MikuActionLog[]) => {
    let logTime: dayjs.Dayjs;
    let time: string;
    let str = "";
    logList.forEach(log => {
        logTime = dayjs(log.time);
        time = logTime.format("MM月DD日HH時mm分");
        str += `<a class='timestamp'>[${time}]</a><div>${log.contents}</div>`;

    });
    postText(str);
}

// ページにhelpボタンをポスト
// 引数は表示したい内容
const postHelp = (str: string) => {
    const bubble = $("<a></a>", {
        style: "cursor:pointer;",
        class: "help",
    }).text("help");

    const help_button = $("<div></div>", {
        onclick: "obj=document.getElementById('open').style; obj.display=(obj.display=='none')?'block':'none';",
    }).append(bubble);

    $("#timeline").append(help_button);

    const contents = $("<div></div>", {
        id: "open",
        style: "display:none;clear:both;",
    }).text(str);

    $("#timeline").append(contents);
}

// ページに話さない文章をポストする
// 引数は，回答テキスト
const postText = (str: string) => {
    const now = new Date();

    const comment = $("<div></div>", {
        class: "bubble bubble-half-bottom normal",
    }).html(str);

    const timestamp = $("<div></div>", {
        class: "timestamp",
    }).text(`[${now.toLocaleString()}]`);


    comment.append(timestamp);

    const bubble = $("<div></div>", {
        class: "container",
    }).append(comment);

    $("#timeline").append(bubble);

    $("html,body").animate({ scrollTop: scrollTopValue });
}

// loading中の吹き出しを表示
const postLoading = () => {
    const now = new Date();

    const loading = $("<div></div>", {
        class: "dot-flashing",
    }).html("");

    const comment = $("<div></div>", {
        class: "bubble bubble-half-bottom normal",
        style: "text-align: center;",
    }).append(loading);

    const timestamp = $("<div></div>", {
        class: "timestamp",
    }).text("[" + now.toLocaleString() + "]");

    comment.append(timestamp);

    const bubble = $("<div></div>", {
        class: "container",
        id: "loading",
    }).append(comment);

    $("#timeline").append(bubble);

    $("html,body").animate({ scrollTop: scrollTopValue });
}

// ページを画面に表示させる
// @param pageURL  // 表示させるページのURL
const postPage = async (pageURL: string, uid: string) => {
    const id = formatDate(new Date(), 'yyyyMMddHHmmssms');

    const comment = $("<iframe></iframe>", {
        class: "bubble bubble-half-bottom normal",
        id: id,
        src: pageURL,
        width: 1200,
        height: 600,
    }).text("ページを表示できませんでした");

    const bubble = $("<div></div>", {
        class: "container",
    }).append(comment);

    $("#timeline").append(bubble);

    $("html,body").animate({ scrollTop: scrollTopValue });
    postDialogueLogs(`【ページを表示】${pageURL}`, SPEAKER.AGENT, uid);

}

/**
 * 会話開始ボタンを配置する
 * @param {*} button_label 
 */
const putStartButton = async (config: MikuActionConfig, button_label = "メイちゃんと話す") => {

    const restart_button = $("<input></input>", {
        "class": "btn-primary btn-medium",
        "type": "button",
        "value": button_label,
    });

    restart_button.on('click', function () {
        startScenario(0, config);
        $(this).remove();
    });

    $("#status").append(restart_button);
    $("html,body").animate({ scrollTop: scrollTopValue });

    // ヒントを表示
    let hint = "【ヒント】「メニュー」と話しかけると，できることの一覧を表示します！";
    postHint(hint);
}

// ページにヒントを表示
const postHint = (str: string) => {
    const comment = $("<p></p>").text(str);

    const contents = $("<div></div>", {
        class: "hint",
        id: "hint",
    }).append(comment);

    $("#status").append(contents);
    $("html,body").animate({ scrollTop: scrollTopValue });
}

export { postComment, postLog, postHelp, postText, postLoading, postPage, putStartButton, postHint };
