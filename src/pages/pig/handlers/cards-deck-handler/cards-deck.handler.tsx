import './cards-deck.handler.css'
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfinity, faCoffee } from '@fortawesome/free-solid-svg-icons';
import { CardsDeck, EWorkflowState, WorkflowBlock } from '../../../../components';
import { getVote, saveVote } from '../../../services';

type Props = {
    boardKey: string,
    pigKey: string,
    currentState: EWorkflowState
};

export function CardsDeckHandler(props: Props) {
    const { boardKey, pigKey, currentState } = props;
    const [vote, setVote] = useState('');
    const [voted, setVoted] = useState('');

    // Get the vote from the database
    useEffect(() => {
        getVote(boardKey, pigKey).then((value) => {
            if (value) {
                setVoted(value);
            }
        })
    }, [boardKey, pigKey])

    // Save vote to the database
    useEffect(() => {
        if (vote) {
            saveVote(boardKey, pigKey, vote);
            setVoted(vote)
        }
    }, [boardKey, pigKey, vote])

    const handleClick = (value: string) => setVote(value);

    return (
        <WorkflowBlock currentState={currentState} displayState={EWorkflowState.VOTE}>
            <div className="cards-deck-handler">
                {
                    !voted
                        ? <CardsDeck onClick={handleClick} />
                        : voted === 'COFFEE'
                            ? <div className="cards-deck-handler--voted"><FontAwesomeIcon icon={faCoffee} /></div>
                            : voted === 'INFINITY'
                                ? <div className="cards-deck-handler--voted"><FontAwesomeIcon icon={faInfinity} /></div>
                                : <div className="cards-deck-handler--voted">{voted}</div>
                }
            </div>
        </WorkflowBlock>
    );
};