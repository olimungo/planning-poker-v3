import { useEffect, useState } from 'react';
import { EWorkflowState, WorkflowActions } from '../../../../components';
import { getNextStateRef, getScrumMasterRef, saveNextState } from '../../../services';

type Props = { boardKey: string, pigKey: string, currentState: EWorkflowState };

export function WorkflowActionsHandler(props: Props) {
    const { boardKey, pigKey, currentState } = props;
    const [nextState, setNextState] = useState(EWorkflowState.UNKNOWN);
    const [isScrumMaster, setIsScrumMaster] = useState(false);

    // Watch the database for a scrum master to be assigned or unassigned
    useEffect(() => {
        const scrumMasterRef = getScrumMasterRef(boardKey);

        scrumMasterRef.on('value', (value) => {
            setIsScrumMaster(value.val() === pigKey);
        });

        return () => scrumMasterRef.off();
    }, [boardKey, pigKey]);

    // Watch next state
    useEffect(() => {
        const nextStateRef = getNextStateRef(boardKey);

        nextStateRef.on('value', (value) => {
            setNextState(EWorkflowState.UNKNOWN);
        });

        return () => nextStateRef.off();
    }, [boardKey])

    // Transition to next state in the database
    useEffect(() => {
        if (nextState !== EWorkflowState.UNKNOWN) {
            saveNextState(boardKey, nextState);
        }
    }, [boardKey, nextState])

    const handleAction = (value: EWorkflowState) => setNextState(value);

    return (
        <div>
            {
                isScrumMaster
                    ? <WorkflowActions currentState={currentState} onAction={handleAction}></WorkflowActions>
                    : ''
            }
        </div>
    );
};