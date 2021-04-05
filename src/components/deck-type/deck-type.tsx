import './deck-type.css';
import { useTranslation } from 'react-i18next';
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { AppContext } from '../../pages';

type Props = { deckType: DeckType, onChange: Function };

export enum DeckType { FIBONACCI, ANIMALS, SIZES };

export function DeckSelector(props: Props) {
    const { deckType, onChange } = props;
    const appContext = useContext(AppContext);
    const { t } = useTranslation();
    const [isScrumMaster, setIsScrumMaster] = useState(false);

    useEffect(() => {
        if (appContext.workflow?.scrumMaster === appContext.pigKey) {
            setIsScrumMaster(true)
        } else {
            setIsScrumMaster(false);
        }
    }, [appContext.pigKey, appContext.workflow?.scrumMaster]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const type = parseInt(event.target.getAttribute("data-type") || '0');
        onChange(type);
    };

    return (
        <div className="deck-type">
            {
                isScrumMaster
                    ? <div>
                        <h1>{t('**deck_type')}</h1>
                        <div className="deck-type--container">
                            <ul>
                                <li>
                                    <input data-type={DeckType.FIBONACCI} type="radio" id="fibonacci" name="selector"
                                        onChange={handleChange} checked={deckType === DeckType.FIBONACCI} />
                                    <label htmlFor="fibonacci">{`{ ${t('fibonacci-like')} }`}</label>

                                    <div className="check"></div>
                                </li>

                                <li>
                                    <input data-type={DeckType.ANIMALS} type="radio" id="animals" name="selector"
                                        onChange={handleChange} checked={deckType === DeckType.ANIMALS} />
                                    <label htmlFor="animals">{`{ ${t('animals')} }`}</label>

                                    <div className="check"></div>
                                </li>

                                <li>
                                    <input data-type={DeckType.SIZES} type="radio" id="sizes" name="selector"
                                        onChange={handleChange} checked={deckType === DeckType.SIZES} />
                                    <label htmlFor="sizes">{`{ ${t('sizes')} }`}</label>

                                    <div className="check"></div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    : ''
            }
        </div>
    );
}