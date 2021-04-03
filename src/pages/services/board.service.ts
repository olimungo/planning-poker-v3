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

export function getLock(boardKey: string): string | null {
    return firebase.database().ref(`boards/${boardKey}/lock`).push().key;
}

export function lockBoard(boardKey: string, key: string): Promise<any> {
    return firebase.database().ref(`boards/${boardKey}/lock`).set({ timeStamp: new Date().getTime(), key });
}