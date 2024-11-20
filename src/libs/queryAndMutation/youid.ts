
/* 
 * youid.ts
 * YouIdサービスからユーザ情報を取得する
 */

import { Person } from "../types/person";
import { PersonPreference } from "../types/personPreference";


const youidEndpoint: string = import.meta.env.VITE_YOUID_API_URL;

/**
 * 指定されたUIDのユーザー情報を取得する
 * @param uid ユーザーID
 * @returns Promise<PersonInfo>
 */
const getPersonInfo = async (uid: string): Promise<Person> => {
    const url: string = `${youidEndpoint}/${uid}`;
    return fetch(url)
        .then(response => {
            if (response.status === 200) {
                return response.json() as Promise<Person>;
            } else {
                throw new Error(`Error fetching person info: ${response.status} ${response.statusText}`);
            }
        })
        .catch(err => {
            console.error(`Failed to fetch ${url}`, err);
            throw err;
        });
};

/**
 * 指定されたUIDのユーザープリファレンスを取得する
 * @param uid ユーザーID
 * @returns Promise<PersonPreference>
 */
const getPersonPreference = async (uid: string): Promise<PersonPreference> => {
    const url: string = `${youidEndpoint}/prefs/${uid}/va_keicho`;
    return fetch(url)
        .then(response => {
            if (response.status === 200) {
                return response.json() as Promise<PersonPreference>;
            } else {
                throw new Error(`Error fetching person preference: ${response.status} ${response.statusText}`);
            }
        })
        .catch(err => {
            console.error(`Failed to fetch ${url}`, err);
            throw err;
        });
};

/**
 * 指定されたUIDのユーザープリファレンスを更新する
 * @param uid ユーザーID
 * @param pref 更新するプリファレンスデータ
 * @returns Promise<PersonPreference>
 */
const putPersonPreference = async (uid: string, pref: PersonPreference): Promise<PersonPreference> => {
    const url: string = `${youidEndpoint}/prefs/${uid}/va_keicho/`;
    console.log(pref);
    console.log(url);
    return fetch(url, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(pref),
        mode: 'cors',
    })
        .then(response => {
            if (response.status === 200) {
                return response.json() as Promise<PersonPreference>;
            } else {
                throw new Error(`Error updating person preference: ${response.status} ${response.statusText}`);
            }
        })
        .then(json => {
            console.log(json);
            return json;
        })
        .catch(err => {
            console.error(`Failed to fetch ${url}`, err);
            throw err;
        });
};

export { getPersonInfo, getPersonPreference, putPersonPreference };
