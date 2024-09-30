import React, { useRef, useEffect } from 'react';

const VideoComponent = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const loadVideo = async () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const constraints = {
          video: {
            facingMode: 'user',
            width: { ideal: 320 },
            height: { ideal: 240 }
          }
        };
        try {
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          videoRef.current.srcObject = stream;
          return new Promise((resolve) => {
            videoRef.current.onloadedmetadata = () => {
              resolve(videoRef.current);
            };
          });
        } catch (error) {
          console.error('Error accessing the camera:', error);
        }
      }
    };

    const stopVideo = () => {
      const tracks = videoRef.current.srcObject?.getTracks() || [];
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    };

    loadVideo();

    return () => {
      stopVideo();
    };
  }, []);

  return (
    <video
      ref={videoRef}
      width={320}
      height={240}
      style={{ display: 'none' }} // CSSで隠す
      autoPlay
    />
  );
};

export default VideoComponent;
