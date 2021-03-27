import firebase from 'firebase/app';
import 'firebase/database';
import { EWorkflowState } from '../../components';

export function getWorkflowRef(boardKey: string): firebase.database.Reference {
    return firebase.database().ref(`boards/${boardKey}/workflow`);
}

export function getScrumMasterRef(boardKey: string): firebase.database.Reference {
    return firebase.database().ref(`boards/${boardKey}/workflow/scrumMaster`);
}

export function getNextStateRef(boardKey: string): firebase.database.Reference {
    return firebase.database().ref(`boards/${boardKey}/workflow/nextState`);
}

export function assignScrumMaster(boardKey: string, pigKey: string) {
    firebase.database().ref(`boards/${boardKey}//workflow/scrumMaster`).set(pigKey);
    firebase.database().ref(`boards/${boardKey}/pigs/${pigKey}/isScrumMaster`).set(true);
}

export function unassignScrumMaster(boardKey: string, pigKey: string) {
    firebase.database().ref(`boards/${boardKey}/workflow/scrumMaster`).remove();
    firebase.database().ref(`boards/${boardKey}/pigs/${pigKey}/isScrumMaster`).remove();
}

export function getWorkflowStateRef(boardKey: string): firebase.database.Reference {
    return firebase.database().ref(`boards/${boardKey}/workflow/state`);
}

export function saveFinalEstimate(boardKey: string, finalEstimate: string) {
    getStep(boardKey).then((value) => {
        const story = value.story;

        firebase.database().ref(`boards/${boardKey}/pigs`).once('value', (pigs) => {
            pigs.forEach(pig => {
                firebase.database().ref(`boards/${boardKey}/pigs/${pig.key}/vote`).remove();
            });

            firebase.database().ref(`boards/${boardKey}/workflow/stories/${story}`).set(finalEstimate);
            saveNextState(boardKey, EWorkflowState.DISCUSSION);
        });
    });
}

export function saveNextState(boardKey: string, nextState: EWorkflowState) {
    firebase.database().ref(`boards/${boardKey}/workflow/nextState`).set(nextState)
}

export function transitionTo(boardKey: string, nextState: EWorkflowState) {
    switch (nextState) {
        case EWorkflowState.DISCUSSION:
            transitionToDiscussion(boardKey);
            break;
    }

    firebase.database().ref(`boards/${boardKey}/workflow/state`).set(nextState.toString());
    firebase.database().ref(`boards/${boardKey}/workflow/nextState`).remove();
}

// ==============================================================================================

function getStep(boardKey: string): Promise<{ story: number, round: number }> {
    return firebase.database().ref(`boards/${boardKey}/workflow/step`).once('value')
        .then(value => ({ story: value.child('story').val(), round: value.child('round').val() }));
}

function transitionToDiscussion(boardKey: string) {
    getStep(boardKey).then((step) => {
        let story = 1
        const round = 1;

        if (step.story) {
            story = step.story + 1;
        }

        firebase.database().ref(`boards/${boardKey}/workflow/step`).set({ story, round });
    });
}