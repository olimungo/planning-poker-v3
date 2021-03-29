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
    const { boardKey, showVote = false, isClickable = false, theme = EBadgeTheme.PRIMARY } = props;
    const [pigs, setPigs] = useState<firebase.database.DataSnapshot[]>([]);

    // Watch when pigs register and update the display
    useEffect(() => {
        const pigsRef = getPigsRef(boardKey);

        pigsRef.on('child_added', (value) => {
            console.log('pig added')
            if (value) {
                setPigs((prevState) => [...prevState, value]);
            }
        });

        return () => {
            console.log('off')
            pigsRef.off()
        };
    }, [boardKey]);

    return (
        <div className="pigs-list">
            {
                pigs.map(pig => <Pig key={pig.key} boardKey={boardKey} pigKey={pig.key} showVote={showVote} isClickable={isClickable} theme={theme} />)
            }
        </div>
    );
};