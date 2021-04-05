import firebase from 'firebase/app';
import 'firebase/database';
import { DeckType, EWorkflowState } from '../../components';

export function getWorkflowRef(boardKey: string): firebase.database.Reference {
    return firebase.database().ref(`boards/${boardKey}/workflow`);
}

export function assignScrumMaster(boardKey: string, pigKey: string) {
    firebase.database().ref(`boards/${boardKey}//workflow/scrumMaster`).set(pigKey);
    firebase.database().ref(`boards/${boardKey}/pigs/${pigKey}/isScrumMaster`).set(true);
}

export function unassignScrumMaster(boardKey: string, pigKey: string) {
    firebase.database().ref(`boards/${boardKey}/workflow/scrumMaster`).remove();
    firebase.database().ref(`boards/${boardKey}/pigs/${pigKey}/isScrumMaster`).remove();
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

export function transitionTo(boardKey: string, nextState: EWorkflowState) {
    switch (nextState) {
        case EWorkflowState.DISCUSSION:
            prepareDiscussion(boardKey, nextState);
            break;
        case EWorkflowState.VOTE:
            setState(boardKey, nextState);
            break;
        case EWorkflowState.FINAL_ESTIMATE:
            setState(boardKey, nextState);
            break;
        case EWorkflowState.REVOTE:
            nextState = EWorkflowState.VOTE
            prepareRevote(boardKey, nextState);
            break;
        case EWorkflowState.PAUSE:
            preparePause(boardKey, nextState);
            break;
        case EWorkflowState.UNPAUSE:
            prepareUnpause(boardKey);
            break;
        case EWorkflowState.FINAL_RESULTS:
            prepareFinalResult(boardKey, nextState);
            break;
    }
}

export function saveDeckType(boardKey: string, deckType: DeckType) {
    firebase.database().ref(`boards/${boardKey}/workflow/deckType`).set(deckType);
}

function getStep(boardKey: string): Promise<{ story: number, round: number }> {
    return firebase.database().ref(`boards/${boardKey}/workflow/step`).once('value')
        .then(value => ({ story: value.child('story').val(), round: value.child('round').val() }));
}

function prepareDiscussion(boardKey: string, state: EWorkflowState) {
    getStep(boardKey).then((step) => {
        let story = 1
        const round = 1;

        if (step.story) {
            story = step.story + 1;
        }

        firebase.database().ref(`boards/${boardKey}/workflow/step`).update({ story, round });
        firebase.database().ref(`boards/${boardKey}/workflow/stories/${story}/dateStarted`).set(new Date().getTime());

        setState(boardKey, state);
    });
}

function prepareRevote(boardKey: string, state: EWorkflowState) {
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

function preparePause(boardKey: string, state: EWorkflowState) {
    firebase.database().ref(`boards/${boardKey}/workflow/state`).once('value', (value) => {
        firebase.database().ref(`boards/${boardKey}/workflow/step/afterPause`).set(value.val());
        firebase.database().ref(`boards/${boardKey}/workflow/step/paused`).set(new Date().getTime());

        setState(boardKey, state);
    });
}

function prepareUnpause(boardKey: string) {
    firebase.database().ref(`boards/${boardKey}/workflow/step`).once('value', (value) => {
        const state = value.child('afterPause').val()
        const pauses = value.child('pauses').val() || 0;
        const paused = value.child('paused').val();
        const newPauses = pauses + new Date().getTime() - paused;

        firebase.database().ref(`boards/${boardKey}/workflow/step/pauses`).set(newPauses);
        firebase.database().ref(`boards/${boardKey}/workflow/step/paused`).remove();
        firebase.database().ref(`boards/${boardKey}/workflow/step/afterPause`).remove();

        setState(boardKey, state);
    });
}

function prepareFinalResult(boardKey: string, state: EWorkflowState) {
    getStep(boardKey).then((value) => {
        firebase.database().ref(`boards/${boardKey}/workflow/stories/${value.story}`).remove();
        firebase.database().ref(`boards/${boardKey}/workflow/step/story`).set(value.story - 1);

        setState(boardKey, state);
    });
}

function setState(boardKey: string, state: EWorkflowState) {
    firebase.database().ref(`boards/${boardKey}/workflow/state`).set(state.toString());
    firebase.database().ref(`boards/${boardKey}/workflow/nextState`).remove();
}
