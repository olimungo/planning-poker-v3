import firebase from 'firebase/app';
import 'firebase/database';

export function checkPigExists(boardKey: string, pigKey: string): Promise<Boolean> {
    return firebase.database().ref(`boards/${boardKey}/pigs/${pigKey}`).once('value')
        .then(value => value.exists());
}

export function createPig(boardKey: string): string | null {
    const pigs = firebase.database().ref(`boards/${boardKey}/pigs`);

    const newPig = pigs.push({ dateCreated: new Date().getTime() });

    if (newPig.key) {
        pigs.orderByChild('dateCreated').once('value').then((values) => {
            let index = 0;

            values.forEach(value => {
                index++;

                if (value.key === newPig.key) {
                    newPig.update({ name: `Pig${index}` });
                }
            });
        });

        return newPig.key;
    }

    return null;
}

export function getPigRef(boardKey: string, pigKey: string): firebase.database.Reference {
    return firebase.database().ref(`boards/${boardKey}/pigs/${pigKey}`);
}

export function savePig(boardKey: string, pigKey: string, name: string | null, email: string | null): Promise<any> | null {
    if (name && name !== '') {
        email = email === '' ? null : email;
        return firebase.database().ref(`boards/${boardKey}/pigs/${pigKey}`).update({ name, email });
    }

    return null;
}

export function getPigsRef(boardKey: string): firebase.database.Reference {
    return firebase.database().ref(`boards/${boardKey}/pigs`);
}

export function saveVote(boardKey: string, pigKey: string, vote: string) {
    firebase.database().ref(`boards/${boardKey}/pigs/${pigKey}/vote`).set(vote);
}