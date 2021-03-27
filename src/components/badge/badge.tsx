import './badge.css';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faStar, faInfinity, faCoffee } from '@fortawesome/free-solid-svg-icons';
import md5 from 'md5';
import { Form } from './form';

export enum EBadgeTheme {
    'PRIMARY',
    'SECONDARY'
}

type Props = {
    theme?: EBadgeTheme,
    name?: string,
    email?: string,
    vote?: string,
    showVote?: boolean,
    displayStar?: boolean,
    isClickable?: boolean,
    onChange?: Function,
};

export function Badge(props: Props) {
    const { theme = EBadgeTheme.PRIMARY, name, email, vote, showVote = false, displayStar = false, isClickable = false, onChange } = props;
    const [showForm, setShowForm] = useState(false);
    const [emailForm, setEmailForm] = useState('');
    const [nameForm, setNameForm] = useState('');

    useEffect(() => {
        if (name) {
            setNameForm(name)
        }

        if (email) {
            setEmailForm(email)
        }
    }, [name, email]);

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
                            `badge--image ${theme === EBadgeTheme.PRIMARY
                                ? 'badge--theme-primary'
                                : 'badge--theme-secondary'}`}
                            src={`https://www.gravatar.com/avatar/${md5(emailForm)}`} alt="gravatar" />
                        : <FontAwesomeIcon className={
                            `badge--icon ${theme === EBadgeTheme.PRIMARY
                                ? 'badge--theme-primary'
                                : 'badge--theme-secondary'}`}
                            icon={faUserCircle} />
                }

                {
                    nameForm
                        ? <div className={
                            `badge--name ${theme === EBadgeTheme.PRIMARY
                                ? 'badge--theme-primary-name'
                                : 'badge--theme-secondary-name'}`}>{nameForm}</div>
                        : ''
                }

                <div className={`badge--relative ${!vote ? 'badge--hidden' : ''}`}>
                    <div className={
                        `badge--vote ${theme === EBadgeTheme.PRIMARY
                            ? 'badge--theme-primary-vote'
                            : 'badge--theme-secondary-vote'}`}>
                        {
                            showVote
                                ? vote !== 'INFINITY' && vote !== 'COFFEE'
                                    ? vote
                                    : vote !== 'COFFEE'
                                        ? <FontAwesomeIcon icon={faInfinity} />
                                        : <FontAwesomeIcon icon={faCoffee} />
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