export enum EWorkflowState {
    REGISTRATION = 'REGISTRATION',
    PREPARATION = 'PREPARATION',
    DISCUSSION = 'DISCUSSION',
    DISCUSSION_POST_VOTE = 'DISCUSSION',
    VOTE = 'VOTE',
    REVOTE = 'REVOTE',
    RESULTS = 'RESULTS',
    FINAL_RESULTS = 'FINAL RESULT',
    PAUSE = 'PAUSE',
    UNPAUSE = 'UNPAUSE'
};

export function getWorkflowStateFromString(state: string): EWorkflowState {
    switch (state) {
        case 'REGISTRATION':
            return EWorkflowState.REGISTRATION
        case 'PREPARATION':
            return EWorkflowState.PREPARATION
        case 'DISCUSSION':
            return EWorkflowState.DISCUSSION
        case 'DISCUSSION_POST_VOTE':
            return EWorkflowState.DISCUSSION_POST_VOTE
        case 'VOTE':
            return EWorkflowState.VOTE
        case 'REVOTE':
            return EWorkflowState.REVOTE
        case 'RESULTS':
            return EWorkflowState.RESULTS
        case 'FINAL_RESULTS':
            return EWorkflowState.FINAL_RESULTS
        case 'PAUSE':
            return EWorkflowState.PAUSE
        case 'UNPAUSE':
            return EWorkflowState.UNPAUSE
        default:
            return EWorkflowState.REGISTRATION
    }
}