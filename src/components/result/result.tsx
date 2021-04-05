import './result.css';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfinity, faCoffee, faSpider, faFish, faCat, faHorse, faHippo, faDragon, IconDefinition } from '@fortawesome/free-solid-svg-icons';

type Props = { story: number, estimate: string, duration: string };

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

export function Result(props: Props) {
    const { story, estimate, duration } = props;
    const [icon, setIcon] = useState<IconDefinition | null>(null);

    useEffect(() => {
        const elem = iconsMap.filter((icon) => icon.value === estimate);

        if (elem.length > 0) {
            setIcon(elem[0].icon);
        } else {
            setIcon(null);
        }
    }, [estimate]);

    return (
        <div className="result">
            <div className="result--story">{story}</div>
            <div className='result--estimate'>
                {
                    icon
                        ? <FontAwesomeIcon icon={icon} />
                        : <div>{estimate}</div>
                }
            </div>

            <div className="result--duration">{duration}</div>
        </div>
    );
}