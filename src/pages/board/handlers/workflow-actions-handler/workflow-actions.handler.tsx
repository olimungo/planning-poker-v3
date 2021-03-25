import { EWorkflowState, WorkflowActions } from '../../../../components';
import { useEffect, useState } from 'react';
import { getScrumMasterRef } from '../../../services';

type Props = { boardKey: string, pigKey: string, currentState: EWorkflowState, onAction: Function };

export function WorkflowActionsHandler(props: Props) {
    const { boardKey, pigKey, currentState, onAction } = props;
    const [isScrumMaster, setIsScrumMaster] = useState(false);

    // Watch the database for a scrum master to be assigned or unassigned
    useEffect(() => {
        const scrumMasterRef = getScrumMasterRef(boardKey);

        scrumMasterRef.on('value', (value) => {
            setIsScrumMaster(value.val() === pigKey);
        });

        return () => {
            scrumMasterRef.off();
        }
    }, [boardKey, pigKey]);

    return (
        <div>
            {
                isScrumMaster
                    ? <WorkflowActions currentState={currentState} onAction={onAction}></WorkflowActions>
                    : ''
            }
        </div>
    );
};