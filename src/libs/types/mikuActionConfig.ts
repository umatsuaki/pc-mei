import SpeechToText  from '../../routes/KeichoPage/utils/speechToText';

export interface MikuActionConfig {
    uid: string;
    stt: SpeechToText | null;
    voicerec: boolean;
    imgtak: boolean;
    audioDataIndex: number;
    audioDataDest: string;
    imgDataIndex: number;
    videostm: HTMLVideoElement;
    talking?: boolean;
}