import './card.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfinity, faCoffee } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

type Props = { value: string, onClick: Function };

export function Card(props: Props) {
    const { value, onClick } = props;

    return (
        <div data-id={value} className="card" onClick={(event: React.MouseEvent) => onClick(event.currentTarget.getAttribute('data-id'))}>
            {
                value !== 'INFINITY' && value !== 'COFFEE'
                    ? <div>{value}</div>
                    : value !== 'COFFEE'
                        ? <FontAwesomeIcon icon={faInfinity} />
                        : <FontAwesomeIcon icon={faCoffee} />
            }
        </div>
    );
};