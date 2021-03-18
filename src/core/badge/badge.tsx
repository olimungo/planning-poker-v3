import './badge.css';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import md5 from 'md5';
import { Form } from './form';

type Props = { name?: string, email?: string, vote?: number, isClickable?: boolean };

export function Badge(props: Props) {
    const { name, email, vote, isClickable } = props;
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
                        ? <img className="badge--image" src={`https://www.gravatar.com/avatar/${md5(emailInput)}`} alt="gravatar" />
                        : <FontAwesomeIcon className="badge--icon" icon={faUserCircle} onClick={() => null} />
                }

                {
                    nameInput ? <div className="badge--name">{nameInput}</div> : ''
                }

                {
                    vote ? <div className="badge--vote">{vote}</div> : ''
                }
            </div>

            {
                showForm ? <Form name={nameInput} email={emailInput} onOk={handleOk} onCancel={() => setShowForm(false)} /> : ''
            }
        </div>
    );
};