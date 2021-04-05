import './quote.css';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ProgressBar } from '../progress-bar';
import quotes from './quotes.json';

export function Quote() {
    const { t } = useTranslation();
    const [quote, setQuote] = useState('');
    const [principleNumber, setPrincipleNumber] = useState(-1);
    const [hidden, setHidden] = useState(false);

    const pickQuote = useCallback(() => {
        const idx = Math.floor(Math.random() * 12);

        setPrincipleNumber(idx + 1);

        if (window.location.hostname === 'localhost') {
            setHidden(true);
        }
    }, []);

    const translateQuote = useCallback(() => {
        let tmpQuote = t(`agile-manifesto:${principleNumber}`);

        // If no translation, then take the english one from the quotes.json file
        tmpQuote = tmpQuote === principleNumber.toString() ? quotes[principleNumber] : tmpQuote;

        setQuote(tmpQuote);
    }, [principleNumber, t]);

    useEffect(() => {
        pickQuote();
    }, [pickQuote]);

    useEffect(() => {
        translateQuote();
    }, [translateQuote]);

    const handleCloseQuote = () => setHidden(true);

    return (
        <div>
            {
                !hidden
                    ? <div className="quote">
                        <h1>
                            Agile Manifesto {t('agile-manifesto:Principle')} #{principleNumber}<br />
                        </h1>

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