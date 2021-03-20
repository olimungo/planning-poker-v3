import './app-header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { Badge } from '..';
import { EBadgeTheme } from '../badge/badge';

type Props = { theme?: EBadgeTheme, name?: string, email?: string, hideBadge?: boolean };

export function AppHeader(props: Props) {
    const { theme = EBadgeTheme.PRIMARY, name, email, hideBadge = false } = props;

    return (
        <div className="app-header">
            <h1>
                <FontAwesomeIcon className="card--icon" icon={faAngleRight} /> PLANNING POKER
            </h1>

            {
                hideBadge
                    ? ''
                    : <Badge name={name} email={email} theme={theme} isClickable={true} />
            }
        </div>
    );
};