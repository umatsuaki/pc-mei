import React from 'react';
import { Typography, List, ListItem, Link, ListItemText } from '@mui/material';

const MMDAgentSection: React.FC = () => {
    return (
        <>
            <Typography variant="h6" gutterBottom>MMDAgentのインストール</Typography>
            <List>
                <ListItem>
                    <Link href="http://www27.cs.kobe-u.ac.jp/~masa-n/mmd/MMDAgent.zip" target="_blank">
                        こちら
                    </Link>
                    <ListItemText primary="からzipファイルをダウンロードしてください。" />
                </ListItem>
                <ListItem>
                    <ListItemText primary="zipファイルを解凍して，展開されたMMDAgentフォルダをデスクトップに移動してください。" />
                </ListItem>
            </List>
        </>
    );
}

export default MMDAgentSection;;