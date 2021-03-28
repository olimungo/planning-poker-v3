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

export function getStoriesRef(boardKey: string): firebase.database.Reference {
    return firebase.database().ref(`boards/${boardKey}/workflow/stories`);
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

        firebase.database().ref(`boards/${boardKey}/workflow/stories/${story}/finalEstimate`).set(finalEstimate);
        firebase.database().ref(`boards/${boardKey}/workflow/stories/${story}/dateEnded`).set(new Date().getTime());

        removeVotes(boardKey).then(() => {
            saveNextState(boardKey, EWorkflowState.DISCUSSION);
        });
    });
}

export function saveNextState(boardKey: string, nextState: EWorkflowState) {
    firebase.database().ref(`boards/${boardKey}/workflow/nextState`).set(nextState)
}

export function transitionTo(boardKey: string, nexState: EWorkflowState) {
    let state = nexState.toString();

    switch (state) {
        case EWorkflowState.DISCUSSION:
            prepareDiscussion(boardKey, state);
            break;
        case EWorkflowState.VOTE:
            setState(boardKey, state);
            break;
        case EWorkflowState.REVOTE:
            state = EWorkflowState.VOTE
            prepareRevote(boardKey, state);
            break;
        case EWorkflowState.PAUSE:
            pauseStart(boardKey, state);
            break;
        case EWorkflowState.UNPAUSE:
            pauseStop(boardKey, state);
            state = EWorkflowState.DISCUSSION;
            break;
        case EWorkflowState.FINAL_RESULTS:
            prepareFinalResult(boardKey, state);
            break;
    }
}

// ==============================================================================================

function getStep(boardKey: string): Promise<{ story: number, round: number }> {
    return firebase.database().ref(`boards/${boardKey}/workflow/step`).once('value')
        .then(value => ({ story: value.child('story').val(), round: value.child('round').val() }));
}

function prepareDiscussion(boardKey: string, state: string) {
    getStep(boardKey).then((step) => {
        let story = 1
        const round = 1;

        if (step.story) {
            story = step.story + 1;
        }

        firebase.database().ref(`boards/${boardKey}/workflow/step`).set({ story, round });
        firebase.database().ref(`boards/${boardKey}/workflow/stories/${story}/dateStarted`).set(new Date().getTime());

        setState(boardKey, state);
    });
}

function prepareRevote(boardKey: string, state: string) {
    firebase.database().ref(`boards/${boardKey}/workflow/step/round`).once('value', (value) => {
        const round = value.val();
        firebase.database().ref(`boards/${boardKey}/workflow/step/round`).set(round + 1);

        removeVotes(boardKey).then(() => {
            setState(boardKey, state);
        });
    });
}

function removeVotes(boardKey: string): Promise<any> {
    return firebase.database().ref(`boards/${boardKey}/pigs`).once('value', (pigs) => {
        pigs.forEach(pig => {
            firebase.database().ref(`boards/${boardKey}/pigs/${pig.key}/vote`).remove();
        });
    });
}

function pauseStart(boardKey: string, state: string) {
    firebase.database().ref(`boards/${boardKey}/workflow/duration/paused`).set(new Date().getTime());
    setState(boardKey, state);
}

function pauseStop(boardKey: string, state: string) {
    firebase.database().ref(`boards/${boardKey}/workflow/duration`).once('value', (value) => {
        const pauses = value.child('pauses').val() || 0;
        const paused = value.child('paused').val();
        const newPauses = pauses + new Date().getTime() - paused;

        firebase.database().ref(`boards/${boardKey}/workflow/duration/pauses`).set(newPauses);
        firebase.database().ref(`boards/${boardKey}/workflow/duration/paused`).remove();

        setState(boardKey, state);
    });
}

function prepareFinalResult(boardKey: string, state: string) {
    firebase.database().ref(`boards/${boardKey}/workflow/duration/dateEnded`).set(new Date().getTime());
    setState(boardKey, state);
}

function setState(boardKey: string, state: string) {
    firebase.database().ref(`boards/${boardKey}/workflow/state`).set(state);
    firebase.database().ref(`boards/${boardKey}/workflow/nextState`).remove();
}
