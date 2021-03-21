import './switch.css';
import { useEffect, useState } from 'react';

type Props = { value?: boolean, onToggle: Function };

export function Switch(props: Props) {
    const { value = false, onToggle } = props;
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (value) {
            setChecked(value);
        }
    }, [value])

    const handleChange = () => {
        onToggle(!checked);
        setChecked(!checked);
    };

    return (
        <div className="switch">
            <input id="switch1" name="switch1" type="checkbox" className="switch--toggle" onChange={handleChange} checked={checked} />

            <label htmlFor="switch1" className="switch--toggle-background">
                <div className="switch--ball"></div>
            </label>
        </div>
    );
}