import './form.css';
import { useState, useEffect, FormEvent } from 'react';

type Props = { name?: string, email?: string, onOk: Function, onCancel: Function };

export function Form(props: Props) {
    const { name, email, onOk, onCancel } = props;
    const [nameForm, setNameForm] = useState('');
    const [emailForm, setEmailForm] = useState('');

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

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        onOk({ name: nameForm, email: emailForm });
    };

    return (
        <form className="email-form" onSubmit={handleSubmit}>
            <h1>Display your name and gravatar picture</h1>

            <div className="email-form--input">
                <input type="text" placeholder="Enter your name"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setNameForm(event.currentTarget.value)}
                    value={nameForm}
                    autoFocus />

                <input type="text" placeholder="Enter your email address"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmailForm(event.currentTarget.value)}
                    value={emailForm} />
            </div>

            <div className="email-form--buttons">
                <input type="submit" value="/ OK /" />
                <button onClick={() => onCancel()}>/ CANCEL /</button>
            </div>
        </form>
    );
};