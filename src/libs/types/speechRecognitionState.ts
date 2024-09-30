import { Callback } from './callback';

export interface SpeechRecognitionState {
    lang: string;
    clbk: Callback | null;
    repeat: boolean;
    status: string;
    running: boolean;
    speech: SpeechRecognition | null;
    finalResult: string | null;
    audioStream: MediaStream | null;
}


