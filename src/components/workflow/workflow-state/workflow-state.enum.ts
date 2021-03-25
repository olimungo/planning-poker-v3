export enum EWorkflowState {
    UNKNOWN = 'UNKNOWN',
    REGISTRATION = 'REGISTRATION',
    PREPARATION = 'PREPARATION',
    DISCUSSION = 'DISCUSSION',
    FINAL_ESTIMATE = 'FINAL_ESTIMATE',
    VOTE = 'VOTE',
    REVOTE = 'REVOTE',
    RESULTS = 'RESULTS',
    FINAL_RESULTS = 'FINAL_RESULT',
    PAUSE = 'PAUSE',
    UNPAUSE = 'UNPAUSE'
};

export function getStringFromWorkflowState(state: EWorkflowState): string {
    switch (state) {
        case EWorkflowState.REGISTRATION:
            return 'REGISTRATION';
        case EWorkflowState.PREPARATION:
            return 'PREPARATION';
        case EWorkflowState.DISCUSSION:
            return 'DISCUSSION';
        case EWorkflowState.FINAL_ESTIMATE:
            return 'DISCUSSION_POST_VOTE';
        case EWorkflowState.VOTE:
            return 'VOTE';
        case EWorkflowState.REVOTE:
            return 'REVOTE';
        case EWorkflowState.RESULTS:
            return 'RESULTS';
        case EWorkflowState.FINAL_RESULTS:
            return 'FINAL_RESULTS';
        case EWorkflowState.PAUSE:
            return 'PAUSE';
        case EWorkflowState.UNPAUSE:
            return 'UNPAUSE';
        default:
            return 'UNKNOWN';
    }
}

export function getWorkflowStateFromString(state: string): EWorkflowState {
    switch (state) {
        case 'REGISTRATION':
            return EWorkflowState.REGISTRATION;
        case 'PREPARATION':
            return EWorkflowState.PREPARATION;
        case 'DISCUSSION':
            return EWorkflowState.DISCUSSION;
        case 'FINAL_ESTIMATE':
            return EWorkflowState.FINAL_ESTIMATE;
        case 'VOTE':
            return EWorkflowState.VOTE;
        case 'REVOTE':
            return EWorkflowState.REVOTE;
        case 'RESULTS':
            return EWorkflowState.RESULTS;
        case 'FINAL_RESULTS':
            return EWorkflowState.FINAL_RESULTS;
        case 'PAUSE':
            return EWorkflowState.PAUSE;
        case 'UNPAUSE':
            return EWorkflowState.UNPAUSE;
        default:
            return EWorkflowState.UNKNOWN;
    }
}