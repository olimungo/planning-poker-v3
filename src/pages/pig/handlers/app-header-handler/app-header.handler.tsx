import { useState, useEffect } from 'react';
import { AppHeader, EBadgeTheme } from '../../../../components';
import { getPigRef } from '../../../services';

type Props = {
    boardKey: string,
    pigKey: string
};

export function AppHeaderHandler(props: Props) {
    const { boardKey, pigKey } = props;
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [pigChanges, setPigChanges] = useState<{ name: string, email: string } | null>(null);

    // Get a reference to the specified pig
    useEffect(() => {
        const pigRef = getPigRef(boardKey, pigKey);

        pigRef.on('value', (value) => {
            if (value.child('name').exists()) {
                setName(value.child('name').val());
            }

            if (value.child('email').exists()) {
                setEmail(value.child('email').val());
            }
        });

        return () => pigRef.off();
    }, [boardKey, pigKey]);

    // Save the name and email to the database
    useEffect(() => {
        if (pigChanges?.name) {
            getPigRef(boardKey, pigKey).update({ name: pigChanges.name, email: pigChanges.email });
        }
    }, [boardKey, pigKey, pigChanges]);

    const handleChange = (value: { name: string, email: string }) => setPigChanges({ name: value.name, email: value.email });

    return (
        <AppHeader name={name} email={email} theme={EBadgeTheme.SECONDARY} onChange={handleChange} />
    );
};