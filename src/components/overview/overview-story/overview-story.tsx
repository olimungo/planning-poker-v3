import './overview-story.css';

type Props = { story: number | null, round: number | null, stories: number | null };

export function OverviewStory(props: Props) {
    const { story, round, stories } = props;

    return (
        <div className="overview-story">
            {
                stories
                    ? `$ stories ${stories}`
                    : story
                        ? `$ story ${story} > round ${round}`
                        : ''
            }
        </div>
    );
}