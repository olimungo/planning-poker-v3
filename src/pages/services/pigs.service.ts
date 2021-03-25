import firebase from 'firebase/app';
import 'firebase/database';

export function getPigRef(boardKey: string, pigKey: string): firebase.database.Reference {
    return firebase.database().ref(`boards/${boardKey}/pigs/${pigKey}`);
}

export function getPigsRef(boardKey: string): firebase.database.Reference {
    return firebase.database().ref(`boards/${boardKey}/pigs`);
}

export function getScrumMasterRef(boardKey: string): firebase.database.Reference {
    return firebase.database().ref(`boards/${boardKey}/scrumMaster`);
}

export function assignScrumMaster(boardKey: string, pigKey: string): Promise<any> {
    return firebase.database().ref(`boards/${boardKey}/scrumMaster`).set(pigKey);
}

export function unassignScrumMaster(boardKey: string): Promise<any> {
    return firebase.database().ref(`boards/${boardKey}/scrumMaster`).remove();
}