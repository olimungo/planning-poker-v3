import './cards-deck.css';
import { Card } from './card'
import { useEffect, useState } from 'react';

type Props = { showCoffe?: boolean, onClick: Function };

export function CardsDeck(props: Props) {
    const { showCoffe = true, onClick } = props;
    const [deck, setDeck] = useState<string[]>([]);

    useEffect(() => {
        const cards = ['?', '0', '1/2', '1', '2', '3', '5', '8', '13', '20', '40', '100', 'INFINITY'];

        if (showCoffe) {
            setDeck([...cards, 'COFFEE']);
        } else {
            setDeck(cards);
        }
    }, [showCoffe]);

    return (
        <div className="cards-deck">
            {
                deck.map(card => <Card key={card} value={card} onClick={onClick} />)
            }
        </div>
    );
};