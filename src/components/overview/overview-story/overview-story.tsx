import './overview-story.css';
import { useTranslation } from 'react-i18next';

type Props = { story: number | null, round: number | null, stories: number | null };

export function OverviewStory(props: Props) {
    const { story, round, stories } = props;
    const { t } = useTranslation();

    return (
        <div className="overview-story">
            {
                stories
                    ? `$ (${t('overview:stories')} | ${stories})`
                    : story
                        ? `$ ${t('overview:story')} ${story} > ${t('overview:round')} ${round}`
                        : ''
            }
        </div>
    );
}