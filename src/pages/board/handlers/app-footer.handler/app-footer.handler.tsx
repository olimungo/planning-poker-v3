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
            setScrumMaster(value.val());
        });

        return () => {
            scrumMasterRef.off();
        }
    }, [boardKey, pigKey]);

    useEffect(() => {
        const iAmScrumMaster = Boolean(scrumMaster && scrumMaster === pigKey);

        if (!scrumMaster || scrumMaster === pigKey) {
            setHideToggle(false);
        } else {
            setHideToggle(true);
        }

        setIsScrumMaster((prevIsScrumMaster) => {
            if (prevIsScrumMaster !== iAmScrumMaster) {
                return iAmScrumMaster;
            }

            return prevIsScrumMaster;
        });
    }, [pigKey, scrumMaster]);

    useEffect(() => {
        // Don't do anything when component starts up
        if (init.current) {
            init.current = false;
            return;
        }

        isScrumMaster ? assignScrumMaster(boardKey, pigKey) : unassignScrumMaster(boardKey);
    }, [boardKey, pigKey, isScrumMaster]);

    const handleToggleScrumMaster = (value: boolean) => value ? setScrumMaster(pigKey) : setScrumMaster(null);

    return (
        <div>
            <AppFooter hideToggle={hideToggle} toggleChecked={isScrumMaster} onToggleScrumMaster={handleToggleScrumMaster} />
        </div>
    );
};