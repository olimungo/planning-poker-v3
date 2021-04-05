import './overview-time.css';
import { useTranslation } from 'react-i18next';

type Props = { start: string | null, end: string | null, duration: string | null, pauses: string | null };

export function OverviewTime(props: Props) {
    const { start, end, duration, pauses } = props;
    const { t } = useTranslation();

    return (
        <div className="overview-time">
            <div>{start ? `$ (${t('overview:start')} | ${start})` : ''}</div>
            <div className="overview-time--item">{end ? `$ (${t('overview:end')} | ${end})` : ''}</div>
            <div className="overview-time--item">{duration ? `$ (${t('overview:duration')} | ${duration})` : ''}</div>
            <div className="overview-time--item">{pauses ? `$ (${t('overview:pauses')} | ${pauses})` : ''}</div>
        </div>
    );
}