import './workflow-state.css';
import { useContext, useEffect, useState } from 'react';
import { EWorkflowState, getStringFromWorkflowState, getWorkflowStateFromString } from './workflow-state.enum'
import { AppContext } from '../../../pages';

export function WorkflowState() {
    const appContext = useContext(AppContext);
    const [title, setTitle] = useState('');

    useEffect(() => {
        if (appContext.workflow?.state) {
            const stateDb = appContext.workflow.state;

            if (stateDb === EWorkflowState.UNKNOWN.toString()) {
                setTitle('');
            } else {
                const state = getWorkflowStateFromString(stateDb)
                const sateString = getStringFromWorkflowState(state);
                setTitle(sateString);
            }
        }
    }, [appContext.workflow?.state]);

    return (
        <div className="workflow-state">
            {`>> ${title}`}
        </div>
    );
}