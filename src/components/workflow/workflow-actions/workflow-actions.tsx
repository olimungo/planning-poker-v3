import './workflow-actions.css'
import { EWorkflowState, WorkflowBlock } from "../";

export type Props = { currentState: EWorkflowState, onAction: Function };

export function WorkflowActions(props: Props) {
    const { currentState, onAction } = props;

    return (
        <div className="workflow-actions">
            <WorkflowBlock currentState={currentState} displayState={EWorkflowState.REGISTRATION}>
                <button onClick={() => onAction(EWorkflowState.DISCUSSION)}>START</button>
            </WorkflowBlock>

            <WorkflowBlock currentState={currentState} displayState={EWorkflowState.DISCUSSION}>
                <button onClick={() => onAction(EWorkflowState.VOTE)}>VOTE</button>
            </WorkflowBlock>

            <WorkflowBlock currentState={currentState} displayState={EWorkflowState.FINAL_ESTIMATE}>
                <button onClick={() => onAction(EWorkflowState.REVOTE)}>RE-VOTE</button>
            </WorkflowBlock>

            <WorkflowBlock currentState={currentState} displayState={EWorkflowState.DISCUSSION}>
                <button onClick={() => onAction(EWorkflowState.PAUSE)}>PAUSE</button>
            </WorkflowBlock>

            <WorkflowBlock currentState={currentState} displayState={EWorkflowState.VOTE}>
                <button onClick={() => onAction(EWorkflowState.FINAL_ESTIMATE)}>STOP VOTES</button>
            </WorkflowBlock>

            <WorkflowBlock currentState={currentState} displayState={EWorkflowState.PAUSE}>
                <button onClick={() => onAction(EWorkflowState.UNPAUSE)}>STOP PAUSE</button>
            </WorkflowBlock>

            <WorkflowBlock currentState={currentState} displayState={EWorkflowState.DISCUSSION}>
                <button onClick={() => onAction(EWorkflowState.FINAL_RESULTS)}>END</button>
            </WorkflowBlock>
        </div>
    );
}