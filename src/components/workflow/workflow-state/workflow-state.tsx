import './workflow-state.css';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EWorkflowState, getStringFromWorkflowState, getWorkflowStateFromString } from './workflow-state.enum'
import { AppContext } from '../../../pages';

export function WorkflowState() {
    const appContext = useContext(AppContext);
    const { t } = useTranslation();
    const [title, setTitle] = useState('');

    useEffect(() => {
        if (appContext.workflow?.state) {
            const stateDb = appContext.workflow.state;

            if (stateDb === EWorkflowState.UNKNOWN.toString()) {
                setTitle('');
            } else {
                const state = getWorkflowStateFromString(stateDb)
                const stateString = getStringFromWorkflowState(state);
                setTitle(t(`state:${stateString}`));
            }
        }
    }, [appContext.workflow?.state, t]);

    return (
        <div className="workflow-state">
            {`>> ${title}`}
        </div>
    );
}