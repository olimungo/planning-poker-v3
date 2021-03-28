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
    console.log('saveNextState', nextState.toString())
    firebase.database().ref(`boards/${boardKey}/workflow/nextState`).set(nextState)
}

export function transitionTo(boardKey: string, nexState: EWorkflowState) {
    let state = nexState.toString();

    switch (state) {
        case EWorkflowState.DISCUSSION:
            prepareDiscussion(boardKey);
            break;
        case EWorkflowState.VOTE:
            prepareVote(boardKey);
            break;
        case EWorkflowState.REVOTE:
            prepareRevote(boardKey);
            state = EWorkflowState.VOTE
            break;
        case EWorkflowState.PAUSE:
            pauseStart(boardKey);
            break;
        case EWorkflowState.UNPAUSE:
            pauseStop(boardKey);
            state = EWorkflowState.DISCUSSION;
            break;
        case EWorkflowState.FINAL_RESULTS:
            prepareFinalResult(boardKey);
            break;
    }

    firebase.database().ref(`boards/${boardKey}/workflow/state`).set(state);
    firebase.database().ref(`boards/${boardKey}/workflow/nextState`).remove();
}

// ==============================================================================================

function getStep(boardKey: string): Promise<{ story: number, round: number }> {
    return firebase.database().ref(`boards/${boardKey}/workflow/step`).once('value')
        .then(value => ({ story: value.child('story').val(), round: value.child('round').val() }));
}

function prepareDiscussion(boardKey: string) {
    getStep(boardKey).then((step) => {
        let story = 1
        const round = 1;

        if (step.story) {
            story = step.story + 1;
        } else {
            // First Story... lets also record when we started the session
            firebase.database().ref(`boards/${boardKey}/workflow/duration/dateStarted`).set(new Date().getTime());
        }

        firebase.database().ref(`boards/${boardKey}/workflow/step`).set({ story, round });

    });
}

function prepareRevote(boardKey: string) {
    firebase.database().ref(`boards/${boardKey}/workflow/step/round`).once('value', (value) => {
        const round = value.val();
        firebase.database().ref(`boards/${boardKey}/workflow/step/round`).set(round + 1);
        removeVotes(boardKey);
    });
}

function prepareVote(boardKey: string) {
    firebase.database().ref(`boards/${boardKey}/workflow/step/story`).once('value', (value) => {
        const story = value.val();
        firebase.database().ref(`boards/${boardKey}/workflow/stories/${story}/dateStarted`).set(new Date().getTime());
    });
}

function removeVotes(boardKey: string): Promise<any> {
    return firebase.database().ref(`boards/${boardKey}/pigs`).once('value', (pigs) => {
        pigs.forEach(pig => {
            firebase.database().ref(`boards/${boardKey}/pigs/${pig.key}/vote`).remove();
        });
    });
}

function pauseStart(boardKey: string) {
    firebase.database().ref(`boards/${boardKey}/workflow/duration/paused`).set(new Date().getTime());
}

function pauseStop(boardKey: string) {
    firebase.database().ref(`boards/${boardKey}/workflow/duration`).once('value', (value) => {
        const pauses = value.child('pauses').val() || 0;
        const paused = value.child('paused').val();
        const newPauses = pauses + new Date().getTime() - paused;

        firebase.database().ref(`boards/${boardKey}/workflow/duration/pauses`).set(newPauses);
        firebase.database().ref(`boards/${boardKey}/workflow/duration/paused`).remove();
    });
}

function prepareFinalResult(boardKey: string) {
    console.log('prepareFinalResult')
    firebase.database().ref(`boards/${boardKey}/workflow/duration/dateEnded`).set(new Date().getTime());
}
