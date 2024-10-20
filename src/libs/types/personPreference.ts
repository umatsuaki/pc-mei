export type PersonPreference<T = any> ={
    prefId: string;
    uid: string;
    aid: string;
    preferences: T;
    keys?: string[];
}


