import './cards-deck.css';
import { Card } from './card'
import { useEffect, useState } from 'react';
import { DeckType } from '../deck-type';

type Props = { deckType: DeckType, showCoffe?: boolean, onClick: Function };

export function CardsDeck(props: Props) {
    const { deckType = DeckType.FIBONACCI, showCoffe = true, onClick } = props;
    const [deck, setDeck] = useState<string[]>([]);
    const [cards, setCards] = useState<string[]>([]);

    useEffect(() => {
        const fibonacci = ['?', '0', '1/2', '1', '2', '3', '5', '8', '13', '20', '40', '100', 'INFINITY'];
        const animals = ['?', 'SPIDER', 'FISH', 'CAT', 'HORSE', 'HIPPO', 'DRAGON', 'INFINITY'];
        const sizes = ['?', 'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'INFINITY'];

        switch (deckType) {
            case DeckType.FIBONACCI:
                setCards(fibonacci);
                break;
            case DeckType.ANIMALS:
                setCards(animals);
                break;
            case DeckType.SIZES:
                setCards(sizes);
                break;
        }
    }, [deckType]);

    useEffect(() => {
        if (showCoffe) {
            setDeck([...cards, 'COFFEE']);
        } else {
            setDeck(cards);
        }
    }, [showCoffe, cards]);

    return (
        <div className="cards-deck">
            {
                deck.map(card => <Card key={card} value={card} onClick={onClick} />)
            }
        </div>
    );
};