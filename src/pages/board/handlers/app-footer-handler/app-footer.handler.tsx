import { AppFooter } from '../../../../components';
import { useEffect, useRef, useState } from 'react';
import { assignScrumMaster, unassignScrumMaster, getWorkflowRef } from '../../../services';

type Props = { boardKey: string, pigKey: string };

export function AppFooterHandler(props: Props) {
    const init = useRef(true);
    const { boardKey, pigKey } = props;
    const [scrumMaster, setScrumMaster] = useState<string | null>('-1');
    const [isScrumMaster, setIsScrumMaster] = useState(false);
    const [hideToggle, setHideToggle] = useState(true);

    // Watch the database for a scrum master to be assigned or unassigned
    useEffect(() => {
        const workflowRef = getWorkflowRef(boardKey);

        workflowRef.on('value', (value) => {
            const scrumMasterVal = value.child('scrumMaster').val();
            const iAmScrumMaster = scrumMasterVal === pigKey;

            setIsScrumMaster(iAmScrumMaster);

            if (iAmScrumMaster || scrumMasterVal === null) {
                setHideToggle(false);
            } else {
                setHideToggle(true);
            }
        });

        return () => workflowRef.off();
    }, [boardKey, pigKey]);

    useEffect(() => {
        // Don't do anything when component starts up
        if (init.current) {
            init.current = false;
            return;
        }

        if (scrumMaster !== '-1') {
            scrumMaster === pigKey ? assignScrumMaster(boardKey, pigKey) : unassignScrumMaster(boardKey, pigKey);
        }
    }, [boardKey, pigKey, scrumMaster]);

    const handleToggleScrumMaster = (value: boolean) => value ? setScrumMaster(pigKey) : setScrumMaster(null);

    return (
        <div>
            <AppFooter hideToggle={hideToggle} toggleChecked={isScrumMaster} onToggleScrumMaster={handleToggleScrumMaster} />
        </div>
    );
};