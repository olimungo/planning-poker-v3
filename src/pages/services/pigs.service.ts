import firebase from 'firebase/app';
import 'firebase/database';

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

export function savePig(boardKey: string, pigKey: string, name: string, email: string | null): Promise<any> | null {
    if (name !== '') {
        email = email === '' ? null : email;
        return firebase.database().ref(`boards/${boardKey}/pigs/${pigKey}`).set({ name, email });
    }

    return null;
}

export function checkPigExists(boardKey: string, pigKey: string): Promise<{ name: string, email: string }> {
    return firebase.database().ref(`boards/${boardKey}/pigs/${pigKey}`).once('value')
        .then(value => ({ name: value.child('name').val(), email: value.child('email').val() }));
}

export function getPigRef(boardKey: string, pigKey: string): firebase.database.Reference {
    return firebase.database().ref(`boards/${boardKey}/pigs/${pigKey}`);
}

export function getPigsRef(boardKey: string): firebase.database.Reference {
    return firebase.database().ref(`boards/${boardKey}/pigs`);
}

export function getVote(boardKey: string, pigKey: string): Promise<string> {
    return firebase.database().ref(`boards/${boardKey}/pigs/${pigKey}/vote`).once('value').then((value) => value.val());
}

export function saveVote(boardKey: string, pigKey: string, vote: string) {
    firebase.database().ref(`boards/${boardKey}/pigs/${pigKey}/vote`).set(vote);
}