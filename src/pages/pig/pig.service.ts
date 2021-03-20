import firebase from 'firebase/app';
import 'firebase/database';
import { Observable } from 'rxjs';

export function checkBoardExists(boardKey: string): Promise<boolean> {
    return firebase.database().ref(`boards/${boardKey}`).once('value').then(value => value.val() ? true : false);
}

export function checkPigExists(boardKey: string, pigKey: string): Promise<{ name: string, email: string }> {
    return firebase.database().ref(`boards/${boardKey}/pigs/${pigKey}`).once('value')
        .then(value => ({ name: value.child('name').val(), email: value.child('email').val() }));
}

export function createPig(boardKey: string): string | null {
    const pigs = firebase.database().ref(`boards/${boardKey}/pigs`);
    const newPig = pigs.push({ 'dateCreated': new Date().getTime(), 'isActive': true });

    if (newPig.key) {
        pigs.orderByChild('dateCreated').once('value').then((values) => {
            let index = 0;

            values.forEach(value => {
                index++;

                if (value.key === newPig.key) {
                    newPig.set({ name: `Pig${index}` });
                }
            });

        });

        return newPig.key;
    }

    return null;
}