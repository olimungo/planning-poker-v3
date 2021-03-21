import firebase from 'firebase/app';
import 'firebase/database';

export function checkBoardExists(boardKey: string): Promise<boolean> {
    return firebase.database().ref(`boards/${boardKey}`).once('value').then(value => value.val() ? true : false);
}

export function getScrumMasterRef(boardKey: string): firebase.database.Reference {
    return firebase.database().ref(`boards/${boardKey}/scrumMaster`);
}