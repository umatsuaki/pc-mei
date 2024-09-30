import React from 'react';
import { Typography, List, ListItem, Link, ListItemText } from '@mui/material';

const TomcatSection: React.FC = () => {
    return (
        <>
            <Typography variant="h6" gutterBottom>Apache Tomcatのインストール</Typography>
            <List>
                <ListItem>
                    <Link href="http://www27.cs.kobe-u.ac.jp/~masa-n/mmd/apache-tomcat-9.0.37-windows-x64-mmd.zip" target="_blank">
                        こちら
                    </Link>
                    <ListItemText primary="からzipファイルをダウンロードしてください。" />
                </ListItem>
                <ListItem>
                    <ListItemText primary="zipファイルを解凍して，展開されたtomcatフォルダをCドライブ直下にコピーしてください。" />
                </ListItem>
                <ListItem>
                    <ListItemText primary="エクスプローラで，C:\\tomcat\\binを開き，startup.batをダブルクリックで実行してください。" />
                </ListItem>
            </List>
        </>
    );
}

export default TomcatSection;