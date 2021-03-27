import './overview-time.css';

type Props = { start: string, end?: string, duration: string, pause?: string };

export function OverviewTime(props: Props) {
    const { start, end, duration, pause } = props;

    return (
        <div className="overview-time">
            {`$ start ${start} | `}
            { end ? `end ${end} | ` : ''}
            { `duration ${duration} | `}
            { pause ? `pause ${pause}` : ''}
        </div>
    );
}