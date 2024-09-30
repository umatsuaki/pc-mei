import React from 'react';
import { Container, Typography, List, ListItem, ListItemText, Button, Divider } from '@mui/material';
import JavaSection from './components/JavaSection';
import TomcatSection from './components/TomcatSection';
import MMDAgentSection from './components/MMDAgentSection';
import TestSection from './components/TestSection';

const InstallManualPage: React.FC = () => {
    return (
        <Container sx={{ padding: '30px' }}>
            <Typography variant="h4" gutterBottom>PC Mei - インストールマニュアル</Typography>
            <Divider />

            <Typography variant="h6" gutterBottom>はじめに</Typography>
            <Typography variant="body1" gutterBottom>
                PC Meiとは，MMDAgentというソフトウェアとChrome Webブラウザを連携させ，あなたの日常生活に様々な支援を行うサービスです．<br />
                PC Meiという名前は"Personal Caregiver for Managing Elderly In-home-life"の略称で，「在宅高齢者の生活支援のための介護者」という意味です．
            </Typography>
            <Typography variant="body1" gutterBottom>
                Chromeだけでも動作可能ですが，MMDAgentを連携させる場合には，お手元のPCに下記の実行環境を構築する必要があります．
            </Typography>

            <List>
                <ListItem><ListItemText primary="Windows10のPC" /></ListItem>
                <ListItem><ListItemText primary="Java 実行環境" /></ListItem>
                <ListItem><ListItemText primary="Apache Tomcat Webサーバ" /></ListItem>
                <ListItem><ListItemText primary="MMDAgent ToolKit (神戸大学版)" /></ListItem>
            </List>

            <JavaSection />
            <TomcatSection />
            <MMDAgentSection />
            <TestSection />

            <Button variant="contained" href="index.html" sx={{ marginTop: '20px' }}>戻る</Button>
        </Container>
    );
}

export default InstallManualPage;
