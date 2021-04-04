import './deck-type.css';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';

type Props = { onChange: Function };

export enum DeckType { FIBONACCI, ANIMALS, SIZES };

export function DeckSelector(props: Props) {
    const { onChange } = props;
    const [defaultDeck, setDefaultDeck] = useState(0)

    const checkLocalStorage = useCallback(() => {
        let deckType = parseInt(window.localStorage.getItem('deck-type') || '-1');

        if (deckType === -1) {
            deckType = 0;
            window.localStorage.setItem('deck-type', "0");
        }

        setDefaultDeck(deckType);
    }, []);

    useEffect(() => {
        checkLocalStorage();
    }, [checkLocalStorage]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const type = parseInt(event.target.getAttribute("data-type") || '0');

        window.localStorage.setItem('deck-type', type.toString());

        setDefaultDeck(type);
        onChange(type);
    };

    return (
        <div className="deck-type">
            <h1>**deck-type</h1>
            <div className="container">
                <ul>
                    <li>
                        <input data-type={DeckType.FIBONACCI} type="radio" id="fibonacci" name="selector"
                            onChange={handleChange} checked={defaultDeck === DeckType.FIBONACCI} />
                        <label htmlFor="fibonacci">{'{ fibonacci-like }'}</label>

                        <div className="check"></div>
                    </li>

                    <li>
                        <input data-type={DeckType.ANIMALS} type="radio" id="animals" name="selector"
                            onChange={handleChange} checked={defaultDeck === DeckType.ANIMALS} />
                        <label htmlFor="animals">{'{ animals }'}</label>

                        <div className="check"></div>
                    </li>

                    <li>
                        <input data-type={DeckType.SIZES} type="radio" id="sizes" name="selector"
                            onChange={handleChange} checked={defaultDeck === DeckType.SIZES} />
                        <label htmlFor="sizes">{'{ sizes }'}</label>

                        <div className="check"></div>
                    </li>
                </ul>
            </div>
        </div>
    );
}