import './badge.css';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faStar, faInfinity } from '@fortawesome/free-solid-svg-icons';
import md5 from 'md5';
import firebase from 'firebase/app';
import 'firebase/database';
import { Form } from './form';

export enum EBadgeTheme {
    'PRIMARY',
    'SECONDARY'
}

type Props = {
    theme?: EBadgeTheme,
    reference?: firebase.database.Reference,
    scrumMasterRef?: firebase.database.Reference,
    name?: string,
    email?: string,
    isClickable?: boolean,
    onChange?: Function
};

export function Badge(props: Props) {
    const { theme = EBadgeTheme.PRIMARY, reference, scrumMasterRef, name, email, isClickable, onChange } = props;
    const [showForm, setShowForm] = useState(false);
    const [emailForm, setEmailForm] = useState('');
    const [nameForm, setNameForm] = useState('');
    const [vote, setVote] = useState('');
    const [isScrumMaster, setIsScrumMaster] = useState(false);

    useEffect(() => {
        if (name) {
            setNameForm(name)
        }
    }, [name]);

    useEffect(() => {
        if (email) {
            setEmailForm(email)
        }
    }, [email]);

    // Watch child properties of the current pig and update the display
    useEffect(() => {
        if (reference) {
            reference.child('name').on('value', (value) => setNameForm(value.val()));
            reference.child('email').on('value', (value) => setEmailForm(value.val()));
            reference.child('vote').on('value', (value) => setVote(value.val()));

            if (scrumMasterRef) {
                scrumMasterRef.on('value', (value) => setIsScrumMaster(value.val() === reference.key));
            }
        }
    }, [reference, scrumMasterRef]);

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

                <div className={
                    `badge--vote ${theme === EBadgeTheme.PRIMARY
                        ? 'badge--theme-primary-vote'
                        : 'badge--theme-secondary-vote'}
                        ${vote === '' || vote === null ? 'badge--hidden' : ''}`}>
                    {vote !== 'INF' ? vote : <FontAwesomeIcon icon={faInfinity} />}
                </div>

                {
                    isScrumMaster
                        ? <FontAwesomeIcon className='badge--star' icon={faStar} />
                        : ''
                }
            </div>

            {
                showForm ? <Form name={nameForm} email={emailForm} onOk={handleOk} onCancel={() => setShowForm(false)} /> : ''
            }
        </div>
    );
};