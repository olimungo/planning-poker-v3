import firebase from 'firebase/app';
import 'firebase/database';

export function getWorkflowRef(boardKey: string): firebase.database.Reference {
    return firebase.database().ref(`boards/${boardKey}/workflow`);
}

export function getWorkflowStateRef(boardKey: string): firebase.database.Reference {
    return firebase.database().ref(`boards/${boardKey}/workflow/state`);
}