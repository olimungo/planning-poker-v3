import './pigs-list.handler.css';
import firebase from 'firebase/app';
import 'firebase/database';
import { Pig } from './pig';
import { EBadgeTheme } from '../../../../components';
import { useEffect, useState } from 'react';
import { getPigsRef } from '../../../services';

type Props = {
    boardKey: string,
    showVote?: boolean,
    isClickable?: boolean,
    theme?: EBadgeTheme
};

export function PigsListHandler(props: Props) {
    const { boardKey, showVote = true, isClickable = false, theme = EBadgeTheme.PRIMARY } = props;
    const [pigsRef, setPigsRef] = useState<firebase.database.Reference | null>(null);
    const [pigs, setPigs] = useState<firebase.database.DataSnapshot[]>([]);

    // Get a reference to the pigs
    useEffect(() => {
        if (boardKey) {
            setPigsRef(getPigsRef(boardKey));
        }
    }, [boardKey]);

    // Watch when pigs register and update the display
    useEffect(() => {
        if (pigsRef) {
            pigsRef.on('child_added', (value) => {
                if (value) {
                    setPigs((prevState) => [...prevState, value]);
                }
            });
        }

        // The return statement is executed on ComponentWillUnmount React event
        return () => {
            // Stop watching the pigs when component is discarded
            if (pigsRef) {
                pigsRef.off();
            }
        };
    }, [pigsRef]);

    return (
        <div className="pigs-list">
            {
                pigs.map(pig => <Pig key={pig.key} boardKey={boardKey} pigKey={pig.key} showVote={showVote} isClickable={isClickable} theme={theme} />)
            }
        </div>
    );
};