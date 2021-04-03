import './app-header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { Badge } from '..';
import { BadgeTheme } from '../badge/badge';

type Props = { theme?: BadgeTheme, name?: string, email?: string, vote?: string, hideBadge?: boolean, onChange?: Function };

export function AppHeader(props: Props) {
    const { theme = BadgeTheme.PRIMARY, name, email, vote, hideBadge = false, onChange } = props;

    const handleChange = (value: any) => {
        if (onChange) {
            onChange(value);
        }
    }

    return (
        <div className="app-header">
            <h1>
                <FontAwesomeIcon icon={faAngleRight} /> PLANNING POKER
            </h1>

            {
                hideBadge
                    ? ''
                    : <Badge name={name} email={email} vote={vote} showVote={true} theme={theme} isClickable={true} onChange={handleChange} />
            }
        </div>
    );
};