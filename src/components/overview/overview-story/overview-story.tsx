import './overview-story.css';

type Props = { story: number | null, round: number | null };

export function OverviewStory(props: Props) {
    const { story, round } = props;

    return (
        <div className="overview-story">
            {`$ story ${story} | round ${round}`}
        </div>
    );
}