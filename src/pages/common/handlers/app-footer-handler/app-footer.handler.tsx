import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppFooter, LanguageSelector } from '../../../../components';
import { assignScrumMaster, unassignScrumMaster } from '../../../services';
import { AppContext } from '../..';

type Props = { hideToggle?: boolean };

export function AppFooterHandler(props: Props) {
    const { hideToggle } = props;
    const appContext = useContext(AppContext);
    const { i18n } = useTranslation();
    const [scrumMaster, setScrumMaster] = useState<Boolean | null>(null);
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        if (scrumMaster !== null && appContext.boardKey && appContext.pigKey) {
            scrumMaster ? assignScrumMaster(appContext.boardKey, appContext.pigKey) : unassignScrumMaster(appContext.boardKey, appContext.pigKey);
        }
    }, [appContext.boardKey, appContext.pigKey, scrumMaster]);

    const handleSettings = () => {
        setShowSettings(!showSettings);
    }

    const handleLanguageSelected = (value: string) => {
        i18n.changeLanguage(value);
        setShowSettings(false);
    }

    return (
        <div>
            <AppFooter
                hideToggle={Boolean(hideToggle || (appContext.workflow?.scrumMaster && appContext.workflow.scrumMaster !== appContext.pigKey))}
                toggleChecked={Boolean(appContext.workflow?.scrumMaster && appContext.workflow.scrumMaster === appContext.pigKey)}
                onSettings={handleSettings}
                onToggleScrumMaster={(value: boolean) => setScrumMaster(value)} />

            {
                showSettings
                    ? <LanguageSelector onLanguageSelected={handleLanguageSelected} onCancel={() => setShowSettings(false)} />
                    : ''
            }
        </div>
    );
};