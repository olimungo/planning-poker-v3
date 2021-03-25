import firebase from 'firebase/app';
import 'firebase/database';
import { EWorkflowState, getStringFromWorkflowState } from '../components';

export function checkBoardExists(boardKey: string): Promise<boolean> {
    return firebase.database().ref(`boards/${boardKey}`).once('value')
        .then(value => value.val() ? true : false);
}

export function getScrumMasterRef2(boardKey: string): firebase.database.Reference {
    return firebase.database().ref(`boards/${boardKey}/scrumMaster`);
}

export function getWorkflowStateRef2(boardKey: string): firebase.database.Reference {
    return firebase.database().ref(`boards/${boardKey}/workflow/state`);
}

export function getVote(boardKey: string, pigKey: string): Promise<string> {
    return firebase.database().ref(`boards/${boardKey}/pigs/${pigKey}/vote`).once('value').then((value) => value.val());
}

export function transitionToDiscussion(boardKey: string) {
    getStepRef(boardKey).then((step) => {
        if (step.story) {
        } else {
            firebase.database().ref(`boards/${boardKey}/workflow/step`).set({ story: 1, round: 1 });
        }

        firebase.database().ref(`boards/${boardKey}/workflow/state`).set(EWorkflowState.DISCUSSION);
    });
}

export function transitionTo(boardKey: string, state: EWorkflowState) {
    firebase.database().ref(`boards/${boardKey}/workflow/state`).set(getStringFromWorkflowState(state));
}

export function saveVote(boardKey: string, pigKey: string, vote: string) {
    firebase.database().ref(`boards/${boardKey}/pigs/${pigKey}/vote`).set(vote);
}

// ==========================

function getStepRef(boardKey: string): Promise<{ story: number, round: number }> {
    return firebase.database().ref(`boards/${boardKey}/step`).once('value')
        .then(value => ({ story: value.child('story').val(), round: value.child('round').val() }));
}