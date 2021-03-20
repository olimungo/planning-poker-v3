import firebase from 'firebase/app';
import 'firebase/database';
import { Observable } from 'rxjs';

export function getBoardKey(): string | null {
    return firebase.database().ref('boards').push().key;
}

export function getBoardDateCreated(boardKey: string): Promise<number> {
    return firebase.database().ref(`boards/${boardKey}/dateCreated`).once('value').then(value => value.val());
};

export function waitForPig$(boardKey: string): Observable<boolean> {
    return new Observable(subscriber => {
        const pigsRef = firebase.database().ref(`boards/${boardKey}/pigs`);

        pigsRef.on('child_added', () => {
            subscriber.next(true);
            pigsRef.off();
        });
    });
};

export function setBoardDateCreated(boardKey: string): Promise<any> {
    return firebase.database().ref(`boards/${boardKey}/dateCreated`).set(new Date().getTime());
}