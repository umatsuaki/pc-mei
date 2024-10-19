import React, { useEffect } from 'react';
import { initialize } from './utils/initialize';
import { scrollToBottom } from '../../libs/utils';
import './css/keicho.css';

const KeichoPage: React.FC = () => {
  useEffect(() => {
    initialize();
    scrollToBottom();
  }, []);


  return (
    <>
      <div className="keicho-body" id="body" >
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
