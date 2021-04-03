import './workflow-actions.css'
import { EWorkflowState, WorkflowBlock } from "../";

export type Props = { state: EWorkflowState, onAction: Function };

export function WorkflowActions(props: Props) {
    const { state, onAction } = props;

    return (
        <div className="workflow-actions">
            <WorkflowBlock state={state} displayState={EWorkflowState.REGISTRATION}>
                <button onClick={() => onAction(EWorkflowState.DISCUSSION)}>START</button>
            </WorkflowBlock>

            <WorkflowBlock state={state} displayState={EWorkflowState.DISCUSSION}>
                <button onClick={() => onAction(EWorkflowState.VOTE)}>VOTE</button>
            </WorkflowBlock>

            <WorkflowBlock state={state} displayState={EWorkflowState.FINAL_ESTIMATE}>
                <button onClick={() => onAction(EWorkflowState.REVOTE)}>RE-VOTE</button>
            </WorkflowBlock>

            <WorkflowBlock state={state} displayState={EWorkflowState.VOTE}>
                <button onClick={() => onAction(EWorkflowState.FINAL_ESTIMATE)}>STOP VOTES</button>
            </WorkflowBlock>

            <WorkflowBlock state={state} displayState={[EWorkflowState.DISCUSSION, EWorkflowState.VOTE]}>
                <button onClick={() => onAction(EWorkflowState.PAUSE)}>PAUSE</button>
            </WorkflowBlock>

            <WorkflowBlock state={state} displayState={EWorkflowState.PAUSE}>
                <button onClick={() => onAction(EWorkflowState.UNPAUSE)}>STOP PAUSE</button>
            </WorkflowBlock>

            <WorkflowBlock state={state} displayState={EWorkflowState.DISCUSSION}>
                <button onClick={() => onAction(EWorkflowState.FINAL_RESULTS)}>END</button>
            </WorkflowBlock>
        </div>
    );
}