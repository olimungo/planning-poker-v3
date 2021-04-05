import './remove-pig-form.css';
import { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

type Props = { name: string, onOk: Function, onCancel: Function };

export function RemovePigForm(props: Props) {
    const { name, onOk, onCancel } = props;
    const { t } = useTranslation();

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        onOk();
    };

    return (
        <form className="remove-pig-form" onSubmit={handleSubmit}>
            <h1>{t('form:Remove')} &nbsp; {'>>'} {name} {'<<'} &nbsp; {t('form:from the session?')}</h1>

            <div className="remove-pig-form--buttons">
                <input type="submit" value="/ OK /" />
                <button onClick={() => onCancel()}>/ {t('form:CANCEL')} /</button>
            </div>
        </form>
    );
}