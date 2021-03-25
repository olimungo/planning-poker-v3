import { EWorkflowState, WorkflowActions } from '../../../../components';
import { useEffect, useRef, useState } from 'react';
import { getScrumMasterRef } from '../../../services';

type Props = { boardKey: string, pigKey: string, currentState: EWorkflowState, onAction: Function };

export function WorkflowActionsHandler(props: Props) {
    const init = useRef(true);
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
    }, [boardKey]);

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