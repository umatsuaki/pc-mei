import { Callback } from './callback';

export type SpeechRecognitionState = {
    lang: string;
    clbk: Callback | null;
    repeat: boolean;
    status: HTMLElement | null;
    running: boolean;
    voicerec: boolean;
    imgtak: boolean;
    audioDataIndex: number;
    audioDataDest: string;
    imgDataIndex: number;
    videostm: HTMLVideoElement;
    speech: SpeechRecognition | null;
    finalResult: string | null;
    audioStream: MediaStream | null;
}


