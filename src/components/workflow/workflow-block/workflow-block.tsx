import './workflow-block.css';
import { EWorkflowState } from '../workflow-state/workflow-state.enum'
import React, { useEffect, useState } from 'react';

type Props = { children: React.ReactElement, state: EWorkflowState, displayState: EWorkflowState | EWorkflowState[] };

export function WorkflowBlock(props: Props) {
    const { children, state, displayState } = props;
    const [displayBlock, setDisplayBlock] = useState(false);

    useEffect(() => {
        if (Array.isArray(displayState)) {
            if (displayState.some((elem) => elem === state)) {
                setDisplayBlock(true);
            } else {
                setDisplayBlock(false);
            }
        } else {
            if (state === displayState) {
                setDisplayBlock(true);
            } else {
                setDisplayBlock(false);
            }
        }
    }, [state, displayState])

    return (
        <div className="workflow-block">
            { displayBlock ? children : ''}
        </div>
    );
}