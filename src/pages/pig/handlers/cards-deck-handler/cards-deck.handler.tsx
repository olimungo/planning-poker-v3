import './cards-deck.handler.css'
import { useState, useEffect } from 'react';
import { CardsDeck, EWorkflowState, WorkflowBlock, Sign, getWorkflowStateFromString } from '../../../../components';
import { getNextStateRef, getScrumMasterRef, getVote, saveFinalEstimate, saveVote } from '../../../services';

type Props = { boardKey: string, pigKey: string, currentState: EWorkflowState };

export function CardsDeckHandler(props: Props) {
    const { boardKey, pigKey, currentState } = props;
    const [vote, setVote] = useState('');
    const [voted, setVoted] = useState('');
    const [finalEstimate, setFinalEstimate] = useState('');
    const [isScrumMaster, setIsScrumMaster] = useState(false);

    // Get the vote from the database
    useEffect(() => {
        const scrumMasterRef = getScrumMasterRef(boardKey);
        const nextStateRef = getNextStateRef(boardKey);

        scrumMasterRef.on('value', (value) => {
            setIsScrumMaster(value.val() === pigKey);
        });

        getVote(boardKey, pigKey).then((value) => {
            if (value) {
                setVoted(value);
            }
        });

        nextStateRef.on('value', (value) => {
            if (value.val()) {
                const nextState = getWorkflowStateFromString(value.val());

                if (nextState === EWorkflowState.VOTE || nextState === EWorkflowState.REVOTE) {
                    setVoted('');
                    setVote('');
                    setFinalEstimate('');
                }
            }
        });

        return () => scrumMasterRef.off();
    }, [boardKey, pigKey])

    // Save vote to the database
    useEffect(() => {
        if (vote) {
            saveVote(boardKey, pigKey, vote);

            // Delay a bit the operation for the ScrumMaster so to prevent a flashing effect
            // by showing his own vote, and then immediately the deck when he's the last one
            // to vote.
            if (isScrumMaster) {
                setTimeout(() => {
                    setVoted(vote);
                    setVote('');
                }, 500);
            } else {
                setVoted(vote);
                setVote('');
            }
        }
    }, [boardKey, pigKey, vote, isScrumMaster])

    // Save the final estimate to the database
    useEffect(() => {
        if (finalEstimate) {
            saveFinalEstimate(boardKey, finalEstimate);
            setVoted('');
            setFinalEstimate('')
        }
    }, [boardKey, finalEstimate])

    const handleClickVote = (value: string) => setVote(value);
    const handleClickFinalEstimates = (value: string) => setFinalEstimate(value);

    return (
        <div>
            <WorkflowBlock currentState={currentState} displayState={EWorkflowState.VOTE}>
                <div className="cards-deck-handler">
                    {
                        !voted
                            ? <CardsDeck onClick={handleClickVote} />
                            : <div className="cards-deck--sign"><Sign value={voted} /></div>
                    }
                </div>
            </WorkflowBlock>

            <WorkflowBlock currentState={currentState} displayState={EWorkflowState.FINAL_ESTIMATE}>
                <div className="cards-deck-handler">
                    {
                        isScrumMaster
                            ? <CardsDeck showCoffe={false} onClick={handleClickFinalEstimates} />
                            : <div className="cards-deck--sign"><Sign value={voted} /></div>
                    }
                </div>
            </WorkflowBlock>
        </div>
    );
};