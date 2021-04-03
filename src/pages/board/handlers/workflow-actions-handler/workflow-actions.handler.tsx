import { useContext, useEffect, useState } from 'react';
import { EWorkflowState, getWorkflowStateFromString, WorkflowActions } from '../../../../components';
import { AppContext } from '../../../common';
import { saveNextState } from '../../../services';

export function WorkflowActionsHandler() {
    const appContext = useContext(AppContext);
    const [nextState, setNextState] = useState(EWorkflowState.UNKNOWN);
    const [isScrumMaster, setIsScrumMaster] = useState(false);

    // Watch the database for a scrum master to be assigned or unassigned
    useEffect(() => {
        if (appContext.workflow?.scrumMaster) {
            setIsScrumMaster(appContext.workflow.scrumMaster === appContext.pigKey);
        } else {
            setIsScrumMaster(false);
        }
    }, [appContext.pigKey, appContext.workflow?.scrumMaster]);

    // Transition to next state in the database
    useEffect(() => {
        if (nextState !== EWorkflowState.UNKNOWN && appContext.boardKey) {
            saveNextState(appContext.boardKey, nextState);
            setNextState(EWorkflowState.UNKNOWN);
        }
    }, [appContext.boardKey, nextState])

    const handleAction = (value: EWorkflowState) => setNextState(value);

    return (
        <div>
            {
                isScrumMaster
                    ? <WorkflowActions state={getWorkflowStateFromString(appContext.workflow?.state || EWorkflowState.UNKNOWN)} onAction={handleAction}></WorkflowActions>
                    : ''
            }
        </div>
    );
};