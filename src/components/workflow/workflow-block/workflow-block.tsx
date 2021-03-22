import './workflow-block.css';
import { EWorkflowState } from '../workflow-state/workflow-state-enum'
import React, { useEffect, useState } from 'react';

type Props = { children: React.ReactElement, currentState: EWorkflowState, displayState: EWorkflowState | EWorkflowState[] };

export function WorkflowBlock(props: Props) {
    const { children, currentState, displayState } = props;
    const [displayBlock, setDisplayBlock] = useState(false);

    useEffect(() => {
        if (Array.isArray(displayState)) {
            if (displayState.some((elem) => elem === currentState)) {
                setDisplayBlock(true);
            } else {
                setDisplayBlock(false);
            }
        } else {
            if (currentState === displayState) {
                setDisplayBlock(true);
            } else {
                setDisplayBlock(false);
            }
        }
    }, [currentState, displayState])

    return (
        <div className="workflow-block">
            { displayBlock ? children : ''}
        </div>
    );
}