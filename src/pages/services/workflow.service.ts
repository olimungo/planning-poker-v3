import firebase from 'firebase/app';
import 'firebase/database';
import { EWorkflowState, getStringFromWorkflowState } from '../../components';

export function getWorkflowRef(boardKey: string): firebase.database.Reference {
    return firebase.database().ref(`boards/${boardKey}/workflow`);
}

export function getWorkflowStateRef(boardKey: string): firebase.database.Reference {
    return firebase.database().ref(`boards/${boardKey}/workflow/state`);
}

export function transitionToDiscussion(boardKey: string) {
    getStep(boardKey).then((step) => {
        let story = 1
        const round = 1;

        if (step.story) {
            story = step.story + 1;
        }

        firebase.database().ref(`boards/${boardKey}/workflow/step`).set({ story, round });
        firebase.database().ref(`boards/${boardKey}/workflow/state`).set(EWorkflowState.DISCUSSION);
    });
}

export function transitionTo(boardKey: string, state: EWorkflowState) {
    firebase.database().ref(`boards/${boardKey}/workflow/state`).set(getStringFromWorkflowState(state));
}

// ==============================================================================================

function getStep(boardKey: string): Promise<{ story: number, round: number }> {
    return firebase.database().ref(`boards/${boardKey}/step`).once('value')
        .then(value => ({ story: value.child('story').val(), round: value.child('round').val() }));
}