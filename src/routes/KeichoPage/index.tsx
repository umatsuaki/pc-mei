
import React, { useContext, useEffect } from 'react';
import { createScrollTracker, initialize } from './utils/initialize';
import  '/src/assets/css/mikuaction.css';

const KeichoPage: React.FC = () => {
  useEffect(() => {
    initialize();
    createScrollTracker();
  }, []);


  return (
    <>
      <div id="timeline"></div>
      <div id="bottom">
        <span className="status" id="status"></span>
      </div>
      <video id="videostm" autoPlay playsInline></video>
      <canvas id="imgcvs"></canvas>
    </>
  );
};

export default KeichoPage;
