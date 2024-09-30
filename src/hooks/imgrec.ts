/**
 * imgrec.ts - 発話時のユーザの画像を記録するルーチン
 * 画像データの保存先は音声データと同じ
 */

// ビデオストリームを定義
let videostm: MediaStream | null = null;


// カメラをオン．ビデオストリームを映す (CSSで隠す)
async function loadVideo(): Promise<HTMLVideoElement | void> {
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
        videostm = stream;

        return new Promise<HTMLVideoElement>((resolve) => {
            video.onloadedmetadata = () => {
                resolve(video);
            };
        });
    }
}

// カメラをオフ
async function stopVideo(): Promise<void> {
    const videoElement = document.getElementById('videostm') as HTMLVideoElement;

    if (videoElement.srcObject) {
        const stream = videoElement.srcObject as MediaStream;
        const tracks = stream.getTracks();

        tracks.forEach((track: MediaStreamTrack) => {
            track.stop();
        });

        videoElement.srcObject = null;
        videostm = null;
    }
}

export { loadVideo, stopVideo };
