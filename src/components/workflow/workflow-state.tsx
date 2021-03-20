import './workflow-state.css';
import { EWorkflowState } from './workflow-state-enum'

type Props = { value: EWorkflowState };

export function WorkflowState(props: Props) {
    const { value } = props;

    return (
        <div className="workflow-state">
            {value.toString()}
        </div>
    );
}