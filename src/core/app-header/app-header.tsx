import './app-header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { Badge } from '..';

export function AppHeader() {
    return (
        <div className="app-header">
            <h1>
                <FontAwesomeIcon className="card--icon" icon={faAngleRight} /> PLANNING POKER
            </h1>

            <Badge isClickable={true} />
        </div>
    );
};