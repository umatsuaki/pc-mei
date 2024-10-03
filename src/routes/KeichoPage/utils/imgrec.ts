/**
 * imgrec.ts - 発話時のユーザの画像を記録するルーチン
 * 画像データの保存先は音声データと同じ
 */

// カメラをオン．ビデオストリームを映す (CSSで隠す)
const loadVideo = async (): Promise<HTMLVideoElement> => {
    const video = document.getElementById('videostm') as HTMLVideoElement;
    video.width = 320;
    video.height = 240;

    const constraints: MediaStreamConstraints = {
        video: {
            facingMode: 'user',
            width: { ideal: 320 },
            height: { ideal: 240 },
        },
    };

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;

        return new Promise<HTMLVideoElement>((resolve) => {
            video.onloadedmetadata = () => {
                resolve(video);
            };
        });
    } else {
        throw new Error("メディアデバイスが利用できません");
    }
}

// カメラをオフ
const stopVideo = async (): Promise<void> => {
    const videoElement = document.getElementById('videostm') as HTMLVideoElement;

    if (videoElement.srcObject) {
        const stream = videoElement.srcObject as MediaStream;
        const tracks = stream.getTracks();

        tracks.forEach((track: MediaStreamTrack) => {
            track.stop();
        });

        videoElement.srcObject = null;
    }
}

export { loadVideo, stopVideo };
