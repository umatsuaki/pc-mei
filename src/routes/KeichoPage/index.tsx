import React, { useState } from 'react';
import Timeline from './components/Timeline';
import useSpeechToText from './hooks/useSpeechToText';
import MMD from './hooks/mmd';

const mmdAgent = new MMD();

const ConversationApp = () => {
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSpeechResult = async (text) => {
    const userMessage = {
      id: conversation.length + 1,
      type: 'comment',
      text,
      speaker: 'user',
      timestamp: new Date().toLocaleTimeString(),
      avatarSrc: '../../../../public/mei-normal.png',
    };

    setConversation((prev) => [...prev, userMessage]);

    const loadingMessage = { id: conversation.length + 2, type: 'loading' };
    setConversation((prev) => [...prev, loadingMessage]);

    const agentMessageText = await getChatgptResponse(text);

    setConversation((prev) => prev.filter((msg) => msg.type !== 'loading'));

    const agentMessage = {
      id: conversation.length + 3,
      type: 'comment',
      text: agentMessageText,
      speaker: 'agent',
      timestamp: new Date().toLocaleTimeString(),
      avatarSrc: '../../../../public/mei-normal.png',
    };

    setConversation((prev) => [...prev, agentMessage]);

    mmdAgent.speak(agentMessageText);
    mmdAgent.doMotion('smile');

    setLoading(false);
  };

  const { status } = useSpeechToText('ja-JP', handleSpeechResult);

  const getChatgptResponse = async (text) => {
    try {
      const response = await fetch(`https://wsapp.cs.kobe-u.ac.jp/gitlab-nodejs/chatgpt/text=${text}`, {
        method: 'GET',
        mode: 'cors',
      });
      if (response.status === 200) {
        const json = await response.json();
        return json.text;
      } else {
        throw new Error('Failed to fetch from ChatGPT API');
      }
    } catch (error) {
      console.error('Error fetching ChatGPT response:', error);
      return 'エラーが発生しました。';
    }
  };

  return (
    <div>
      <h2>ユーザとMMDエージェントの対話</h2>
      <Timeline messages={conversation} />
      {loading && <p>応答を取得中...</p>}
      <p>{status}</p>
    </div>
  );
};

export default ConversationApp;
