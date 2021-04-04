import './badge.css';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUserCircle, faStar, faInfinity, faCoffee, faSpider, faFish, faCat,
    faHorse, faHippo, faDragon, IconDefinition
} from '@fortawesome/free-solid-svg-icons';
import md5 from 'md5';
import { Form } from './form';
import { AppTheme } from '..';

type Props = {
    theme?: AppTheme,
    name?: string,
    email?: string,
    vote?: string,
    showVote?: boolean,
    displayStar?: boolean,
    isClickable?: boolean,
    onChange?: Function,
};

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

export function Badge(props: Props) {
    const { theme = AppTheme.PRIMARY, name, email, vote, showVote = false, displayStar = false,
        isClickable = false, onChange } = props;
    const [showForm, setShowForm] = useState(false);
    const [emailForm, setEmailForm] = useState('');
    const [nameForm, setNameForm] = useState('');
    const [icon, setIcon] = useState<IconDefinition | null>(null);

    useEffect(() => {
        if (name) {
            setNameForm(name)
        }

        if (email) {
            setEmailForm(email)
        }
    }, [name, email]);

    useEffect(() => {
        const elem = iconsMap.filter((icon) => icon.value === vote);

        if (elem.length > 0) {
            setIcon(elem[0].icon);
        } else {
            setIcon(null);
        }
    }, [vote]);

    // The pig changed his/her name or email through the form
    // Update the display and bubble up the event to the parent component
    const handleOk = (result: { name: string, email: string }) => {
        setNameForm(result.name);
        setEmailForm(result.email);
        setShowForm(false);

        if (onChange) {
            onChange({ name: result.name, email: result.email });
        }
    }

    return (
        <div className="badge">
            <div className="badge--avatar" onClick={() => isClickable ? setShowForm(!showForm) : null}>
                {
                    emailForm
                        ? <img className={
                            `badge--image ${theme === AppTheme.PRIMARY
                                ? 'badge--theme-primary'
                                : 'badge--theme-secondary'}`}
                            src={`https://www.gravatar.com/avatar/${md5(emailForm)}`} alt="gravatar" />
                        : <FontAwesomeIcon className={
                            `badge--icon ${theme === AppTheme.PRIMARY
                                ? 'badge--theme-primary'
                                : 'badge--theme-secondary'}`}
                            icon={faUserCircle} />
                }

                {
                    nameForm
                        ? <div className={
                            `badge--name ${theme === AppTheme.PRIMARY
                                ? 'badge--theme-primary-name'
                                : 'badge--theme-secondary-name'}`}>{nameForm}</div>
                        : ''
                }

                <div className={`badge--relative ${!vote ? 'badge--hidden' : ''}`}>
                    <div className={
                        `badge--vote ${theme === AppTheme.PRIMARY
                            ? 'badge--theme-primary-vote'
                            : 'badge--theme-secondary-vote'}`}>
                        {
                            showVote
                                ? icon
                                    ? <FontAwesomeIcon icon={icon} />
                                    : vote
                                : ''
                        }
                    </div>
                </div>

                {
                    displayStar
                        ? <div className="badge--relative"><FontAwesomeIcon className='badge--star' icon={faStar} /></div>
                        : ''
                }
            </div>

            {
                showForm ? <Form name={nameForm} email={emailForm} onOk={handleOk} onCancel={() => setShowForm(false)} /> : ''
            }
        </div>
    );
};