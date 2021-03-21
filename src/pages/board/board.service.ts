import firebase from 'firebase/app';
import 'firebase/database';
import { Observable } from 'rxjs';

export function createBoardKey(): string | null {
    const boardKey = firebase.database().ref('boards').push().key;

    if (boardKey) {
        firebase.database().ref(`boards/${boardKey}/dateCreated`).set(new Date().getTime());
    }

    return boardKey;
}

export function getPigsRef(boardKey: string): firebase.database.Reference {
    return firebase.database().ref(`boards/${boardKey}/pigs`);
}

export function getPigRef(boardKey: string, pigKey: string): firebase.database.Reference {
    return firebase.database().ref(`boards/${boardKey}/pigs/${pigKey}`);
}

export function waitForPig$(boardKey: string): Observable<boolean> {
    return new Observable(subscriber => {
        const pigsRef = firebase.database().ref(`boards/${boardKey}/pigs`);

        pigsRef.on('child_added', () => {
            subscriber.next(true);
            pigsRef.off();
        });
    });
};