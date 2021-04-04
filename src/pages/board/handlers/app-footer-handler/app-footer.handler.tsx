import { AppFooter } from '../../../../components';
import { useContext, useEffect, useState } from 'react';
import { assignScrumMaster, unassignScrumMaster } from '../../../services';
import { AppContext } from '../../../common';

type Props = { hideToggle?: boolean };

export function AppFooterHandler(props: Props) {
    const { hideToggle } = props;
    const appContext = useContext(AppContext);
    const [scrumMaster, setScrumMaster] = useState<Boolean | null>(null);

    useEffect(() => {
        if (scrumMaster !== null && appContext.boardKey && appContext.pigKey) {
            scrumMaster ? assignScrumMaster(appContext.boardKey, appContext.pigKey) : unassignScrumMaster(appContext.boardKey, appContext.pigKey);
        }
    }, [appContext.boardKey, appContext.pigKey, scrumMaster]);

    return (
        <AppFooter
            hideToggle={Boolean(hideToggle || (appContext.workflow?.scrumMaster && appContext.workflow.scrumMaster !== appContext.pigKey))}
            toggleChecked={Boolean(appContext.workflow?.scrumMaster && appContext.workflow.scrumMaster === appContext.pigKey)}
            onToggleScrumMaster={(value: boolean) => setScrumMaster(value)} />
    );
};