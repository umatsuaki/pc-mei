import React from "react";
import { Typography, Link, List, ListItem } from "@mui/material";

const Preparation: React.FC = () => {
  return (
    <div>
      <Typography variant="h5" component="h2" gutterBottom>
        事前準備
      </Typography>
      <Typography variant="body1">
        初めての方はまず<a href="/install-manual">こちら</a>をお読み下さい。
      </Typography>
      <Typography variant="h6" gutterBottom>
        1. ソフトウェアのインストール
      </Typography>
      <List>
        <ListItem>localhostにMMDAgentをインストール・起動します</ListItem>
        <ListItem>localhostにTomcatをインストールし，Axis2，MMDAgentProxy.aarをデプロイします</ListItem>
        <ListItem>
          <Link href="http://localhost:8080/axis2/services/MMDAgentProxyService/doMotion?motion=bye">
            メイちゃんが手を振るかどうかテスト
          </Link>
        </ListItem>
      </List>
      <Typography variant="h6" gutterBottom>
        2. You-IDの取得
      </Typography>
      <List>
        <ListItem>VAとの対話を行うには、利用者の識別子(You-ID)が必要です。</ListItem>
        <ListItem>
          You-IDを未取得または忘れた人は
          <Link href="https://wsapp.cs.kobe-u.ac.jp/YouId/" target="_blank">
            こちらから取得
          </Link>
          してください。
        </ListItem>
      </List>


    </div>
  );
}

export default Preparation;
