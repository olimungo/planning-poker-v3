import './deck-selector.handler.css'
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../..';
import { DeckSelector, DeckType } from '../../../../components';
import { saveDeckType } from '../../../services';

type Props = { onChange: Function };

export function DeckSelectorHandler(props: Props) {
    const { onChange } = props;
    const appContext = useContext(AppContext);
    const [deckType, setDeckType] = useState(DeckType.FIBONACCI);

    useEffect(() => {
        if (appContext.workflow?.deckType || appContext.workflow?.deckType === 0) {
            setDeckType(appContext.workflow.deckType);
            onChange(appContext.workflow.deckType);
        }
    }, [appContext.workflow?.deckType, onChange]);

    const handleChange = (value: number) => {
        if (appContext.boardKey) {
            saveDeckType(appContext.boardKey, value);
            onChange(value);
        }
    };

    return (
        <div>
            <DeckSelector deckType={deckType} onChange={handleChange} />
        </div>
    );
};