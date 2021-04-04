import './card.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfinity, faCoffee, faSpider, faFish, faCat, faHorse, faHippo, faDragon, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';

type Props = { value: string, onClick: Function };

const iconsMap = [
    { value: 'COFFEE', icon: faCoffee },
    { value: 'INFINITY', icon: faInfinity },
    { value: 'SPIDER', icon: faSpider },
    { value: 'FISH', icon: faFish },
    { value: 'CAT', icon: faCat },
    { value: 'HORSE', icon: faHorse },
    { value: 'HIPPO', icon: faHippo },
    { value: 'DRAGON', icon: faDragon }
];

export function Card(props: Props) {
    const { value, onClick } = props;
    const [icon, setIcon] = useState<IconDefinition | null>(null);

    useEffect(() => {
        const elem = iconsMap.filter((icon) => icon.value === value);

        if (elem.length > 0) {
            setIcon(elem[0].icon);
        } else {
            setIcon(null);
        }
    }, [value]);

    return (
        <div data-id={value} className="card" onClick={(event: React.MouseEvent) => onClick(event.currentTarget.getAttribute('data-id'))}>
            {
                icon
                    ? <FontAwesomeIcon icon={icon} />
                    : <div>{value}</div>
            }
        </div>
    );
};