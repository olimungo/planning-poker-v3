import './form.css';
import { useState, useEffect, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

type Props = { name?: string, email?: string, onOk: Function, onCancel: Function };

export function Form(props: Props) {
    const { name, email, onOk, onCancel } = props;
    const { t } = useTranslation();
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
        <form className="badge-form" onSubmit={handleSubmit}>
            <h1>{t('Display your name and gravatar picture')}</h1>

            <div className="badge-form--input">
                <input type="text" placeholder={t('Enter your name')}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setNameForm(event.currentTarget.value)}
                    value={nameForm}
                    autoFocus />

                <input type="text" placeholder={t('Enter your email address')}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmailForm(event.currentTarget.value)}
                    value={emailForm} />
            </div>

            <div className="badge-form--buttons">
                <input type="submit" value="/ OK /" />
                <button onClick={() => onCancel()}>/ {t('form:CANCEL')} /</button>
            </div>
        </form>
    );
};