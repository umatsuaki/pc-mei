import React from 'react';
import { Typography, List, ListItem, Link, ListItemText } from '@mui/material';

const TestSection: React.FC = () => {
    return (
        <>
            <Typography variant="h6" gutterBottom>テストする</Typography>
            <List>
                <ListItem>
                    <Link href="http://localhost:8080/axis2/services/MMDAgentProxyService/doMotion?motion=bye" target="_blank">
                        こちらをクリック
                    </Link>
                    <ListItemText primary="してメイちゃんが手を振るか確認します。" />
                </ListItem>
                <ListItem>
                    <Link href="http://localhost:8080/axis2/services/MMDAgentProxyService/startSpeech?text=こんにちは" target="_blank">
                        こちらをクリック
                    </Link>
                    <ListItemText primary="してメイちゃんが「こんにちは」としゃべるか確認します。" />
                </ListItem>
            </List>
        </>
    );
}

export default TestSection;