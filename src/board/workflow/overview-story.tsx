import './overview-story.css';

type Props = { story: number, round: number };

export function OverviewStory(props: Props) {
    const { story, round } = props;

    return (
        <div className="overview-story">
            &gt; story {story} | round {round}
        </div>
    );
}