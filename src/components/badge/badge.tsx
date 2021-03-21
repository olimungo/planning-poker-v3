import './badge.css';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faStar } from '@fortawesome/free-solid-svg-icons';
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
    vote?: number,
    isClickable?: boolean,
    onChange?: Function
};

export function Badge(props: Props) {
    const { theme = EBadgeTheme.PRIMARY, reference, scrumMasterRef, name, email, vote, isClickable, onChange } = props;
    const [showForm, setShowForm] = useState(false);
    const [emailInput, setEmailInput] = useState('');
    const [nameInput, setNameInput] = useState('');
    const [isScrumMaster, setIsScrumMaster] = useState(false);

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

    useEffect(() => {
        if (reference) {
            reference.child('name').on('value', (value) => {
                setNameInput(value.val());
            });

            reference.child('email').on('value', (value) => {
                setEmailInput(value.val());
            });

            if (scrumMasterRef) {
                scrumMasterRef.on('value', (value) => setIsScrumMaster(value.val() === reference.key));
            }
        }
    }, [reference, scrumMasterRef]);


    const handleOk = (result: { name: string, email: string }) => {
        setNameInput(result.name);
        setEmailInput(result.email);
        setShowForm(false);

        if (onChange) {
            onChange({ name: result.name, email: result.email });
        }
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
                            icon={faUserCircle} />
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

                {
                    isScrumMaster
                        ? <FontAwesomeIcon className='badge--star' icon={faStar} />
                        : ''
                }
            </div>

            {
                showForm ? <Form name={nameInput} email={emailInput} onOk={handleOk} onCancel={() => setShowForm(false)} /> : ''
            }
        </div>
    );
};