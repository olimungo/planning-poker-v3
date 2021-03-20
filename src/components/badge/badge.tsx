import './badge.css';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import md5 from 'md5';
import { Form } from './form';

export enum EBadgeTheme {
    'PRIMARY',
    'SECONDARY'
}

type Props = { theme?: EBadgeTheme, name?: string, email?: string, vote?: number, isClickable?: boolean };

export function Badge(props: Props) {
    const { theme = EBadgeTheme.PRIMARY, name, email, vote, isClickable } = props;
    const [showForm, setShowForm] = useState(false);
    const [emailInput, setEmailInput] = useState('');
    const [nameInput, setNameInput] = useState('');

    useEffect(() => {
        if (name) {
            setNameInput(name)
        }
    }, [name]);

    useEffect(() => {
        if (email) {
            setEmailInput(email)
        }
    }, [email]);

    const handleOk = (result: { name: string, email: string }) => {
        setNameInput(result.name);
        setEmailInput(result.email);
        setShowForm(false);
    }

    return (
        <div className="badge">
            <div className="badge--avatar" onClick={() => isClickable ? setShowForm(!showForm) : null}>
                {
                    emailInput
                        ? <img className={
                            `badge--image ${theme === EBadgeTheme.PRIMARY
                                ? 'badge--theme-primary'
                                : 'badge--theme-secondary'}`}
                            src={`https://www.gravatar.com/avatar/${md5(emailInput)}`} alt="gravatar" />
                        : <FontAwesomeIcon className={
                            `badge--icon ${theme === EBadgeTheme.PRIMARY
                                ? 'badge--theme-primary'
                                : 'badge--theme-secondary'}`}
                            icon={faUserCircle} onClick={() => null} />
                }

                {
                    nameInput
                        ? <div className={
                            `badge--name ${theme === EBadgeTheme.PRIMARY
                                ? 'badge--theme-primary-name'
                                : 'badge--theme-secondary-name'}`}>{nameInput}</div>
                        : ''
                }

                {
                    vote ?
                        <div className={
                            `badge--vote ${theme === EBadgeTheme.PRIMARY
                                ? 'badge--theme-primary-vote'
                                : 'badge--theme-secondary-vote'}`}>{vote}</div>
                        : ''
                }
            </div>

            {
                showForm ? <Form name={nameInput} email={emailInput} onOk={handleOk} onCancel={() => setShowForm(false)} /> : ''
            }
        </div>
    );
};