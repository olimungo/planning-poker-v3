import './workflow-actions.css'
import { useTranslation } from 'react-i18next';
import { EWorkflowState, WorkflowBlock } from "../";

export type Props = { state: EWorkflowState, onAction: Function };

export function WorkflowActions(props: Props) {
    const { state, onAction } = props;
    const { t } = useTranslation();

    return (
        <div className="workflow-actions">
            <WorkflowBlock state={state} displayState={EWorkflowState.REGISTRATION}>
                <button onClick={() => onAction(EWorkflowState.DISCUSSION)}>{t('action-button:START')}</button>
            </WorkflowBlock>

            <WorkflowBlock state={state} displayState={EWorkflowState.DISCUSSION}>
                <button onClick={() => onAction(EWorkflowState.VOTE)}>{t('action-button:VOTE')}</button>
            </WorkflowBlock>

            <WorkflowBlock state={state} displayState={EWorkflowState.FINAL_ESTIMATE}>
                <button onClick={() => onAction(EWorkflowState.REVOTE)}>{t('action-button:RE-VOTE')}</button>
            </WorkflowBlock>

            <WorkflowBlock state={state} displayState={EWorkflowState.VOTE}>
                <button onClick={() => onAction(EWorkflowState.FINAL_ESTIMATE)}>{t('action-button:STOP VOTES')}</button>
            </WorkflowBlock>

            <WorkflowBlock state={state} displayState={[EWorkflowState.DISCUSSION, EWorkflowState.VOTE]}>
                <button onClick={() => onAction(EWorkflowState.PAUSE)}>{t('action-button:PAUSE')}</button>
            </WorkflowBlock>

            <WorkflowBlock state={state} displayState={EWorkflowState.PAUSE}>
                <button onClick={() => onAction(EWorkflowState.UNPAUSE)}>{t('action-button:STOP PAUSE')}</button>
            </WorkflowBlock>

            <WorkflowBlock state={state} displayState={EWorkflowState.DISCUSSION}>
                <button onClick={() => onAction(EWorkflowState.FINAL_RESULTS)}>{t('action-button:END')}</button>
            </WorkflowBlock>
        </div>
    );
}