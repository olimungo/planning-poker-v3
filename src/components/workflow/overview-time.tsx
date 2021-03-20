import './overview-time.css';

type Props = { start: string, end?: string, duration: string, story?: string, pause?: string };

export function OverviewTime(props: Props) {
    const { start, end, duration, story, pause } = props;

    return (
        <div className="overview-time">
            &gt;
                start {start} |&nbsp;
            { end ? `end ${end} | ` : ''}
                duration {duration} |&nbsp;
            { story ? `story ${story} | ` : ''}
            { pause ? `pause ${pause}` : ''}
        </div>
    );
}