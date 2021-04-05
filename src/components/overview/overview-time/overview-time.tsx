import './overview-time.css';
import { useTranslation } from 'react-i18next';

type Props = { start: string | null, end: string | null, duration: string | null, pauses: string | null };

export function OverviewTime(props: Props) {
    const { start, end, duration, pauses } = props;
    const { t } = useTranslation();

    return (
        <div className="overview-time">
            { start ? `$ (${t('overview:start')} | ${start})` : ''}
            { end ? ` (${t('overview:end')} | ${end})` : ''}
            { duration ? ` (${t('overview:duration')} | ${duration})` : ''}
            { pauses ? ` (${t('overview:pauses')} | ${pauses})` : ''}
        </div>
    );
}