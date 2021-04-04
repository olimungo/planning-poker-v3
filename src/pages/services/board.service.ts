import firebase from 'firebase/app';
import 'firebase/database';
import { EWorkflowState } from '../../components';

export function createBoardKey(): string | null {
    const boardKey = firebase.database().ref('boards').push().key;

    if (boardKey) {
        firebase.database().ref(`boards/${boardKey}/workflow/dateCreated`).set(new Date().getTime());
        firebase.database().ref(`boards/${boardKey}/workflow/state`).set(EWorkflowState.REGISTRATION);
    }

    return boardKey;
}

export function checkBoardExists(boardKey: string): Promise<boolean> {
    return firebase.database().ref(`boards/${boardKey}`).once('value')
        .then(value => value.val() ? true : false);
}

export function getLock(boardKey: string) {
    const lock = window.localStorage.getItem('lock') || '';

    if (!lock) {
        const key = firebase.database().ref(`boards/${boardKey}/lock`).push().key;
        window.localStorage.setItem('lock', key || '');
    }
}

export function lockBoard(boardKey: string): Promise<any> {
    const key = window.localStorage.getItem('lock') || '';
    return firebase.database().ref(`boards/${boardKey}/lock`).set({ timeStamp: new Date().getTime(), key });
}