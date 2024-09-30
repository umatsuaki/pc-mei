import React from 'react';
import { Typography, List, ListItem, Link, ListItemText } from '@mui/material';

const JavaSection: React.FC = () => {
    return (
        <>
            <Typography variant="h6" gutterBottom>Java実行環境のインストール</Typography>
            <List>
                <ListItem>
                    <Link href="https://www.kkaneko.jp/tools/win/openjdk.html" target="_blank">
                        こちら
                    </Link>
                    <ListItemText primary="を参考に，お手元のWindows PCにJava環境 (JDK14)をインストールしてください。" />
                </ListItem>
                <ListItem>
                    <ListItemText primary="上記リンク内の説明にあるように，環境変数JAVA_HOMEの設定と，PathへのJavaの追加も忘れずに行ってください。" />
                </ListItem>
            </List>
        </>
    );
}

export default JavaSection;