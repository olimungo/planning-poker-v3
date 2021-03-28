import './result.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfinity, faCoffee } from '@fortawesome/free-solid-svg-icons';

type Props = { story: number, estimate: string, duration: string };

export function Result(props: Props) {
    const { story, estimate, duration } = props;

    return (
        <div className="result">
            <div className="result--story">{story}</div>
            <div className='result--estimate'>
                {
                    estimate === 'INFINITY'
                        ? <FontAwesomeIcon icon={faInfinity} />
                        : estimate === 'COFFEE'
                            ? <FontAwesomeIcon icon={faCoffee} />
                            : estimate
                }
            </div>

            <div className="result--duration">{duration}</div>
        </div>
    );
}