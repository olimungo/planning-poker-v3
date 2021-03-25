import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/database';
import { Badge, EBadgeTheme } from '../../../../../components';
import { getPigRef } from '../../../../services/pigs.service';

type Props = {
    boardKey: string,
    pigKey: string | null,
    showVote?: boolean,
    isClickable?: boolean,
    theme?: EBadgeTheme
};

export function Pig(props: Props) {
    const { boardKey, pigKey, showVote = true, isClickable = false, theme = EBadgeTheme.PRIMARY } = props;
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [vote, setVote] = useState('');
    const [isScrumMaster, setIsScrumMaster] = useState(false);
    const [pigRef, setPigRef] = useState<firebase.database.Reference | null>(null);

    // Get a reference to the specified pig
    useEffect(() => {
        if (boardKey && pigKey) {
            setPigRef(getPigRef(boardKey, pigKey));
        }
    }, [boardKey, pigKey]);

    // Watch child properties of the current pig and update the display
    useEffect(() => {
        if (pigRef) {
            pigRef.child('name').on('value', (value) => setName(value.val()));
            pigRef.child('email').on('value', (value) => setEmail(value.val()));
            pigRef.child('vote').on('value', (value) => setVote(value.val()));
            pigRef.child('isScrumMaster').on('value', (value) => setIsScrumMaster(value.val() !== null));
        }

        // The return statement is executed on ComponentWillUnmount React event
        return () => {
            // Stop watching the pig when component is discarded
            if (pigRef) {
                pigRef.child('name').off();
                pigRef.child('email').off();
                pigRef.child('vote').off();
                pigRef.child('isScrumMaster').off();
            }
        };
    }, [pigRef]);

    return (
        <Badge name={name} email={email} vote={vote} showVote={showVote} displayStar={isScrumMaster} isClickable={isClickable} theme={theme} />
    );
};