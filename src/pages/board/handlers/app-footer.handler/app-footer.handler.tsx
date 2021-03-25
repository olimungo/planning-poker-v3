import { AppFooter } from '../../../../components';
import { useEffect, useRef, useState } from 'react';
import { getScrumMasterRef, assignScrumMaster, unassignScrumMaster } from '../../../services';

type Props = { boardKey: string, pigKey: string };

export function AppFooterHandler(props: Props) {
    const init = useRef(true);
    const { boardKey, pigKey } = props;
    const [scrumMaster, setScrumMaster] = useState<string | null>(null);
    const [isScrumMaster, setIsScrumMaster] = useState(false);
    const [hideToggle, setHideToggle] = useState(true);

    // Watch the database for a scrum master to be assigned or unassigned
    useEffect(() => {
        const scrumMasterRef = getScrumMasterRef(boardKey);

        scrumMasterRef.on('value', (value) => {
            const iAmScrumMaster = value.val() === pigKey;

            setIsScrumMaster(iAmScrumMaster);

            if (iAmScrumMaster || value.val() === null) {
                setHideToggle(false);
            } else {
                setHideToggle(true);
            }
        });

        return () => {
            scrumMasterRef.off();
        }
    }, [boardKey, pigKey]);

    useEffect(() => {
        // Don't do anything when component starts up
        if (init.current) {
            init.current = false;
            return;
        }

        scrumMaster === pigKey ? assignScrumMaster(boardKey, pigKey) : unassignScrumMaster(boardKey, pigKey);
    }, [boardKey, pigKey, scrumMaster]);

    const handleToggleScrumMaster = (value: boolean) => value ? setScrumMaster(pigKey) : setScrumMaster(null);

    return (
        <div>
            <AppFooter hideToggle={hideToggle} toggleChecked={isScrumMaster} onToggleScrumMaster={handleToggleScrumMaster} />
        </div>
    );
};