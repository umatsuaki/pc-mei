import React, { useEffect } from 'react';
import { initialize } from './utils/initialize';
import '/src/assets/css/mikuaction.css';
import { scrollToBottom } from '../../libs/utils';

const KeichoPage: React.FC = () => {
  useEffect(() => {
    initialize();
    scrollToBottom();
  }, []);


  return (
    <>
      <div id="body" >
        <div id="timeline"></div>
        <div id="bottom">
          <span className="status" id="status"></span>
        </div>
        <video id="videostm" autoPlay playsInline></video>
        <canvas id="imgcvs"></canvas>
      </div>
    </>
  );
};

export default KeichoPage;
