import './remove-pig-form.css';
import { FormEvent } from 'react';

type Props = { name: string, onOk: Function, onCancel: Function };

export function RemovePigForm(props: Props) {
    const { name, onOk, onCancel } = props;

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        onOk();
    };

    return (
        <form className="remove-pig-form" onSubmit={handleSubmit}>
            <h1>Remove &nbsp; {'>>'} {name} {'<<'} &nbsp; from the session?</h1>

            <div className="remove-pig-form--buttons">
                <input type="submit" value="/ OK /" />
                <button onClick={() => onCancel()}>/ CANCEL /</button>
            </div>
        </form>
    );
}