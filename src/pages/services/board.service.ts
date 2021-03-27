import firebase from 'firebase/app';
import 'firebase/database';
import { EWorkflowState } from '../../components';

export function createBoardKey(): string | null {
    const boardKey = firebase.database().ref('boards').push().key;

    if (boardKey) {
        firebase.database().ref(`boards/${boardKey}/dateCreated`).set(new Date().getTime());
        firebase.database().ref(`boards/${boardKey}/workflow/state`).set(EWorkflowState.REGISTRATION);
    }

    return boardKey;
}

export function checkBoardExists(boardKey: string): Promise<boolean> {
    return firebase.database().ref(`boards/${boardKey}`).once('value')
        .then(value => value.val() ? true : false);
}

// export function waitForPig$(boardKey: string): Observable<boolean> {
//     return new Observable(subscriber => {
//         const pigsRef = firebase.database().ref(`boards/${boardKey}/pigs`);

//         pigsRef.on('child_added', () => {
//             subscriber.next(true);
//             pigsRef.off();
//         });
//     });
// };