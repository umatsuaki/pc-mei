/**
 * speechToText.ts
 * WebSpeechAPI のラッパー。言語、コールバックを受け取り、音声認識を行います。
 * パラメータ:
 * - lang: 言語コード（例: 'ja-JP'）
 * - clbk: 認識されたテキストを受け取るコールバック関数
 * - repeat: 終了・エラーイベントが発生しても継続的に認識を行うかどうか
 * - stat: ステータスを表示する HTML 要素
 */


import { SpeechRecognitionState } from '../../../libs/types/speechRecognitionState';
import { ImageDataItem } from '../../../libs/types/ImageDataItem';
import { Callback } from '../../../libs/types/callback';

// グローバル変数の宣言
declare const voicerec: boolean;
declare const imgtak: boolean;
declare let audioDataIndex: number;
declare let audioDataDest: string;
declare let imgDataIndex: number;
declare const videostm: HTMLVideoElement;
let t1: Date = new Date();
const audioDataRepoUserName: string = import.meta.env.NEXTCLOUD_USERNAME;
const audioDataRepoPassword: string = import.meta.env.NEXTCLOUD_PASSWORD;

class SpeechToText {
  private fields: SpeechRecognitionState;

  // -------------------- 録音に関する設定 --------------------
  constructor(
    lang: string,
    clbk: Callback | null,
    repeat: boolean = false,
    status: string
  ) {
    this.fields = {
      lang,
      clbk,
      repeat,
      status,
      running: false,
      speech: null,
      finalResult: null,
      audioStream: null,
    };
  }

  private init(): void {
    const self = this;
    const f = self.fields;

    // 録音関連の変数
    let audioData: Float32Array[] = [];
    let audioSampleRate: number;
    const bufferSize: number = 1024;
    let audioContext: AudioContext;
    let scriptProcessor: ScriptProcessorNode;
    let mediaStreamSource: MediaStreamAudioSourceNode;

    // WAV ファイルに変換する関数
    const exportWAV = (audioData: Float32Array[]): Blob => {
      const encodeWAV = (samples: Float32Array, sampleRate: number): ArrayBuffer => {
        const buffer = new ArrayBuffer(44 + samples.length * 2);
        const view = new DataView(buffer);

        const writeString = (view: DataView, offset: number, string: string) => {
          for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
          }
        };

        const floatTo16BitPCM = (output: DataView, offset: number, input: Float32Array) => {
          for (let i = 0; i < input.length; i++, offset += 2) {
            let s = Math.max(-1, Math.min(1, input[i]));
            output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
          }
        };

        writeString(view, 0, 'RIFF'); // RIFF ヘッダ
        view.setUint32(4, 32 + samples.length * 2, true); // ファイルサイズ
        writeString(view, 8, 'WAVE'); // WAVE ヘッダ
        writeString(view, 12, 'fmt '); // fmt チャンク
        view.setUint32(16, 16, true); // fmt チャンクのバイト数
        view.setUint16(20, 1, true); // フォーマット ID (PCM)
        view.setUint16(22, 1, true); // チャンネル数
        view.setUint32(24, sampleRate, true); // サンプリングレート
        view.setUint32(28, sampleRate * 2, true); // データ速度 (Byte Rate)
        view.setUint16(32, 2, true); // ブロックサイズ (Block Align)
        view.setUint16(34, 16, true); // サンプルあたりのビット数
        writeString(view, 36, 'data'); // data チャンク
        view.setUint32(40, samples.length * 2, true); // 波形データのバイト数
        floatTo16BitPCM(view, 44, samples); // 波形データ

        return view.buffer;
      };

      const mergeBuffers = (audioData: Float32Array[]): Float32Array => {
        const sampleLength = audioData.reduce((acc, curr) => acc + curr.length, 0);
        const samples = new Float32Array(sampleLength);
        let sampleIdx = 0;
        for (const buffer of audioData) {
          samples.set(buffer, sampleIdx);
          sampleIdx += buffer.length;
        }
        return samples;
      };

      const mergedSamples = mergeBuffers(audioData);
      const wavBuffer = encodeWAV(mergedSamples, audioSampleRate);
      return new Blob([wavBuffer], { type: 'audio/wav' });
    };

    // 録音した音声を NextCloud に送信する関数
    const sendRecordedAudio = async (data: Blob): Promise<void> => {
      const fileName = `${audioDataIndex}.wav`;
      const dest = `${audioDataDest}/${fileName}`;

      const file = new File([data], fileName, { type: 'application/octet-stream' });

      const headers = new Headers();
      headers.append(
        'Authorization',
        'Basic ' + btoa(`${audioDataRepoUserName}:${audioDataRepoPassword}`)
      );

      try {
        const response = await fetch(dest, {
          method: 'PUT',
          headers,
          body: file,
          mode: 'cors',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error(`Failed to fetch ${dest}`, error);
        throw error;
      }
    };

    // 録音を停止する関数
    const stopRecord = (): void => {
      console.log('録音停止');
      if (mediaStreamSource) mediaStreamSource.disconnect();
      if (scriptProcessor) scriptProcessor.disconnect();
      if (audioContext) audioContext.close();

      const audioBlob = exportWAV(audioData);
      sendRecordedAudio(audioBlob).catch((err) => {
        console.error('録音音声の送信エラー:', err);
      });
    };

    // 録音を開始する関数
    const startRecord = (): void => {
      console.log('録音開始');
      audioContext = new AudioContext();
      audioSampleRate = audioContext.sampleRate;
      scriptProcessor = audioContext.createScriptProcessor(bufferSize, 1, 1);
      mediaStreamSource = audioContext.createMediaStreamSource(f.audioStream as MediaStream);
      mediaStreamSource.connect(scriptProcessor);
      scriptProcessor.onaudioprocess = (e: AudioProcessingEvent) => {
        const input = e.inputBuffer.getChannelData(0);
        const bufferData = new Float32Array(bufferSize);
        bufferData.set(input);
        audioData.push(bufferData);
      };
      scriptProcessor.connect(audioContext.destination);
    };

    // -------------------- 撮影に関する設定 --------------------

    // 画像の base64 データを一時保存する配列
    let base64arr: ImageDataItem[] = [];

    // ビデオストリームから画像をキャプチャして canvas に描画し、base64 を取得する関数
    const drawImg = (video: HTMLVideoElement): string => {
      const imgcvs = document.getElementById('imgcvs') as HTMLCanvasElement;
      const imgctx = imgcvs.getContext('2d');

      if (!imgctx) {
        console.error('canvas のコンテキスト取得に失敗しました');
        return '';
      }

      imgcvs.width = video.videoWidth;
      imgcvs.height = video.videoHeight;

      imgctx.clearRect(0, 0, imgcvs.width, imgcvs.height);
      imgctx.save();
      imgctx.drawImage(video, 0, 0, imgcvs.width, imgcvs.height);
      const base64 = imgcvs.toDataURL('image/jpeg');
      imgctx.restore();

      return base64;
    };

    // base64 を Blob に変換する関数
    const toBlob = (base64: string): Blob => {
      const bin = atob(base64.split(',')[1]);
      const buffer = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) {
        buffer[i] = bin.charCodeAt(i);
      }
      return new Blob([buffer.buffer], { type: 'image/png' });
    };

    // キャプチャした画像を NextCloud に送信する関数
    const sendTookImg = async (data: ImageDataItem): Promise<void> => {
      const fileName = `${data.imgDataIndex}.jpg`;
      const dest = `${audioDataDest}/${fileName}`;

      const fileData = toBlob(data.base64);
      const file = new File([fileData], fileName, { type: 'application/octet-stream' });

      const headers = new Headers();
      headers.append(
        'Authorization',
        'Basic ' + btoa(`${audioDataRepoUserName}:${audioDataRepoPassword}`)
      );

      try {
        const response = await fetch(dest, {
          method: 'PUT',
          headers,
          body: file,
          mode: 'cors',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error(`Failed to fetch ${dest}`, error);
        throw error;
      }
    };

    // --------------------- 音声認識処理 ---------------------

    window.SpeechRecognition =
      (window.SpeechRecognition as any) || (window as any).webkitSpeechRecognition;

    if (!window.SpeechRecognition) {
      console.error('このブラウザは SpeechRecognition をサポートしていません。');
      return;
    }

    f.speech = new SpeechRecognition();
    f.speech.lang = f.lang;
    f.speech.interimResults = true;
    f.speech.continuous = true;

    // 結果をログに記録（オプション）
    f.speech.addEventListener('result', (e: SpeechRecognitionEvent) => {
      // console.log(e);
    });

    // イベントハンドラの設定
    f.speech.onaudiostart = () => {
      if (voicerec) {
        console.log('録音開始');
        startRecord();
      }
    };

    f.speech.onsoundstart = () => {
      f.status = '【音声認識中】';
    };

    f.speech.onnomatch = () => {
      f.status = '【音声が聞き取れません】';
      f.running = false;
      if (voicerec) {
        stopRecord();
      }
      if (f.repeat) {
        console.log('STT を再起動しています...');
        self.reset();
      }
    };

    f.speech.onerror = () => {
      f.status = '【音声認識エラー】';
      f.running = false;
      if (voicerec) {
        stopRecord();
      }
      console.log('STT を再起動しています...');
      self.reset();
    };

    f.speech.onsoundend = () => {
      f.status = '【音声認識終了】';
      f.running = false;
      if (voicerec) {
        stopRecord();
      }
      console.log('STT を再起動しています...');
      self.reset();
    };

    f.speech.onresult = (event: SpeechRecognitionEvent) => {
      const results = event.results;
      for (let i = event.resultIndex; i < results.length; i++) {
        const result = results[i];
        if (result.isFinal) {
          const t2 = new Date();
          const result_text = result[0].transcript.trim();
          f.status = `【認識結果】 「${result_text}」`;
          if (f.clbk) {
            f.clbk(result_text);
          } else {
            console.log(`${result_text}: 認識されましたが、コールバックが指定されていません。`);
          }

          if (voicerec) {
            stopRecord();
          }

          if (imgtak) {
            const diff = t2.getTime() - t1.getTime();
            const diffHour = diff / (1000 * 60 * 60);
            const diffMinute = (diffHour - Math.floor(diffHour)) * 60;
            const diffSecond = (diffMinute - Math.floor(diffMinute)) * 60;

            if (diffSecond >= 1) {
              const base64 = drawImg(videostm);
              base64arr.push({
                base64,
                imgDataIndex,
              });
              console.log(`画像を取得しました: ${imgDataIndex}`);
              t1 = t2;
            }
          }

          if (imgtak && base64arr.length > 0) {
            base64arr.forEach((dataItem) => {
              sendTookImg(dataItem).catch((err) => {
                console.error('画像送信エラー:', err);
              });
            });
            console.log('画像を NextCloud に送信しました。');
            base64arr = [];
          }

          self.fields.finalResult = result_text;

          if (!f.repeat) {
            self.stop();
          }
        } else {
          f.status = `【認識中】> ${result[0].transcript}`;
          if (!f.running) {
            f.running = true; // 認識中フラグをセット
          }
        }
      }
    };
  }

  /**
   * 音声認識を開始します。
   */
  public start(): void {
    const self = this;
    if (voicerec) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream: MediaStream) => {
          self.fields.audioStream = stream;
          self.init();
          if (self.fields.speech) {
            self.fields.speech.start();
          }
          self.fields.status = "【音声認識準備完了】";
          console.log('STT が開始されました。');
        })
        .catch((err) => {
          console.error('マイクへのアクセスエラー:', err);
        });
    } else {
      self.fields.audioStream = null;
      self.init();
      if (self.fields.speech) {
        self.fields.speech.start();
      }
      self.fields.status = "【音声認識準備完了】";
      console.log('STT が開始されました。');
    }
  }

  /**
   * 音声認識を停止します。
   */
  public stop(): void {
    if (voicerec && this.fields.audioStream) {
      this.fields.audioStream.getTracks().forEach((track) => track.stop());
    }
    if (this.fields.speech) {
      this.fields.speech.onsoundend = null;
      this.fields.speech.stop();
    }
    console.log('STT が停止されました。');
  }

  /**
   * 音声認識をリセットします。
   */
  public reset(): void {
    console.log('STT をリセットします。');
    const self = this;
    if (voicerec) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream: MediaStream) => {
          self.fields.audioStream = stream;
          self.init();
          if (self.fields.speech) {
            self.fields.speech.start();
          }
          self.fields.status = "【音声認識準備完了】";
          console.log('STT が再開始されました。');
        })
        .catch((err) => {
          console.error('マイクへのアクセスエラー:', err);
        });
    } else {
      self.fields.audioStream = null;
      self.init();
      if (self.fields.speech) {
        self.fields.speech.start();
      }
      self.fields.status = "【音声認識準備完了】";
      console.log('STT が再開始されました。');
    }
  }

  /**
   * 音声認識が実行中かどうかを確認します。
   * @returns {boolean} 実行中の場合は true、そうでない場合は false。
   */
  public isRunning(): boolean {
    return this.fields.running;
  }

  //--------------------------------------------------------
}

export default SpeechToText;
