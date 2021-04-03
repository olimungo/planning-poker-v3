import './overview-time.css';

type Props = { start: string | null, end: string | null, duration: string | null, pauses: string | null };

export function OverviewTime(props: Props) {
    const { start, end, duration, pauses } = props;

    return (
        <div className="overview-time">
            { start ? `$ (start | ${start})` : ''}
            { end ? ` (end | ${end})` : ''}
            { duration ? ` (duration | ${duration})` : ''}
            { pauses ? ` (pauses | ${pauses})` : ''}
        </div>
    );
}