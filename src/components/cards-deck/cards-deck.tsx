import './cards-deck.css';
import { Card } from './card'
import React from 'react';

type Props = { onClick: Function };

export function CardsDeck(props: Props) {
    const { onClick } = props;
    const cards = ['?', '0', '1/2', '1', '2', '3', '5', '8', '13', '20', '40', '100', 'INFINITY', 'COFFEE'];

    return (
        <div className="cards-deck">
            {
                cards.map(card => <Card key={card} value={card} onClick={onClick}></Card>)
            }
        </div>
    );
};