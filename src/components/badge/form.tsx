import './form.css';
import { useState, useEffect, FormEvent } from 'react';

type Props = { name?: string, email?: string, onOk: Function, onCancel: Function };

export function Form(props: Props) {
    const { name, email, onOk, onCancel } = props;
    const [nameInput, setNameInput] = useState('');
    const [emailInput, setEmailInput] = useState('');

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

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        onOk({ name: nameInput, email: emailInput });
    };

    return (
        <form className="email-form" onSubmit={handleSubmit}>
            <h1>Display your name and gravatar picture</h1>

            <div className="email-form--input">
                <input type="text" placeholder="Enter your name"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setNameInput(event.currentTarget.value)}
                    value={nameInput}
                    autoFocus />

                <input type="text" placeholder="Enter your email address"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmailInput(event.currentTarget.value)}
                    value={emailInput} />
            </div>

            <div className="email-form--buttons">
                <input type="submit" value="/ OK /" />
                <button onClick={() => onCancel()}>/ CANCEL /</button>
            </div>
        </form>
    );
};