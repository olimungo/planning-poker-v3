import './progress-bar.css';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause, faTimes } from '@fortawesome/free-solid-svg-icons';

type Props = { duration: number, onClose: Function };

export function ProgressBar(props: Props) {
    const { duration, onClose } = props;
    const [percentage, setPercentage] = useState('0%');
    const [timer, setTimer] = useState<NodeJS.Timeout>();
    const [close, setClose] = useState(false);

    useEffect(() => {
        if (duration) {
            let percent = 0;
            const frameRate = 50; // milliseconds
            const frames = duration / frameRate
            const increment = 100 / frames;

            const interval = setInterval(() => {
                if (percent >= 100) {
                    clearInterval(interval);
                    setClose(true);
                }

                setPercentage(percent + '%');
                percent += increment;

            }, frameRate);

            setTimer(interval);

            return () => clearInterval(interval);
        }
    }, [duration, close]);

    useEffect(() => {
        if (close) {
            onClose();
        }
    }, [close, onClose]);

    const handlePause = () => {
        if (timer) {
            clearInterval(timer);
            setTimer(undefined);
        }
    };

    const handleClose = () => setClose(true);

    return (
        <div className="progress-bar">
            <div className="progress-bar--container">
                <div className="progress-bar--border">
                    <div className="progress-bar--back-bar">
                        <div className="progress-bar--bar" style={{ width: percentage }}>
                        </div>
                    </div>
                </div>
            </div>

            <div className="progress-bar--buttons">
                <button className={!timer ? 'progress-bar--hidden' : ''} onClick={handlePause}><FontAwesomeIcon icon={faPause} /></button>
                <button onClick={handleClose} ><FontAwesomeIcon icon={faTimes} /></button>
            </div>
        </div>
    );
}