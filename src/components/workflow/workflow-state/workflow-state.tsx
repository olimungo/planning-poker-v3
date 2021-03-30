import './workflow-state.css';
import { useEffect, useState } from 'react';
import { EWorkflowState, getStringFromWorkflowState } from './workflow-state.enum'

type Props = { state: EWorkflowState };

export function WorkflowState(props: Props) {
    const { state } = props;
    const [title, setTitle] = useState('');

    useEffect(() => {
        if (state === EWorkflowState.UNKNOWN) {
            setTitle('');
        } else {
            setTitle(getStringFromWorkflowState(state));
        }
    }, [state]);

    return (
        <div className="workflow-state">
            {`>> ${title}`}
        </div>
    );
}