import './overview-time.css';

type Props = { start: string, end?: string, duration: string, story?: string, pause?: string };

export function OverviewTime(props: Props) {
    const { start, end, duration, story, pause } = props;

    return (
        <div className="overview-time">
            {`$ start ${start} | `}
            { end ? `end ${end} | ` : ''}
            { `duration ${duration} | `}
            { story ? `story ${story} | ` : ''}
            { pause ? `pause ${pause}` : ''}
        </div>
    );
}