import React from "react";
import { Typography } from "@mui/material";

const UpdateHistory: React.FC = () => {
  return (
    <div>
      <Typography variant="h5" component="h2" gutterBottom>
        更新履歴
      </Typography>
      <Typography variant="body1">
        2023-11-07：質問返答サービスを追加<br />
        2023-07-24：思い出会話サービスを追加<br />
        2023-06-18：ChatGPT機能を追加<br />
        2023-06-18：ビデオチャット機能を追加<br />
        2023-02-28： ページを更新しても対話内容が消えないように変更<br />
        2022-09-06： タイマー機能とアラーム機能を追加<br />
        2022-08-29： 入力中表現を追加<br />
        2022-08-07： 日付や時間を答える機能を追加<br />
        2022-08-01： 対話ログから新たな話題を生成する機能を追加<br />
        2022-07-29： 質問のタイミングと内容を変更<br />
        2022-07-25： モード切替機能を追加<br />
        2022-07-18： 天気予報サービスと連携<br />
        2022-07-16： ニュースサービスと連携<br />
        2022-07-12： サービス評価機能を追加<br />
        2022-07-07： 雑談機能を追加<br />
        2022-07-01： 最新verをデプロイ
      </Typography>
    </div>
  );
}

export default UpdateHistory;
