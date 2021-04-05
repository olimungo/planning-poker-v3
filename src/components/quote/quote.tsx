import { useEffect, useState } from 'react';
import { ProgressBar } from '../progress-bar';
import './quote.css';
import quotes from './quotes.json';

export function Quote() {
    const [quote, setQuote] = useState('');
    const [index, setIndex] = useState(-1);
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        if (index === -1) {
            const idx = Math.floor(Math.random() * 12);

            setIndex(idx + 1);
            setQuote(quotes[idx]);

            if (window.location.hostname === 'localhost') {
                setHidden(true);
            }
        }
    }, [index]);

    const handleCloseQuote = () => setHidden(true);

    return (
        <div>
            {
                !hidden
                    ? <div className="quote">
                        <div className="quote--number">
                            Agile Manifesto Principle #{index}<br />
                        </div>

                        <div className="quote--quote">
                            {quote}
                        </div>

                        <div className="quote--a">
                            <a href="https://agilemanifesto.org">https://agilemanifesto.org</a>
                        </div>

                        <ProgressBar duration={10000} onClose={handleCloseQuote} />
                    </div>
                    : ''
            }
        </div>
    );
}