import './sign.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfinity, faCoffee } from '@fortawesome/free-solid-svg-icons';

type Props = { value: string };

export function Sign(props: Props) {
    const { value } = props;

    return (
        <div>
            {
                value === 'COFFEE'
                    ? <div className="sign"><FontAwesomeIcon icon={faCoffee} /></div>
                    : value === 'INFINITY'
                        ? <div className="sign"><FontAwesomeIcon icon={faInfinity} /></div>
                        : <div className="sign">{value}</div>
            }
        </div>
    )
};