import './cards-deck.handler.css'
import { useState, useEffect, useContext } from 'react';
import { CardsDeck, EWorkflowState, WorkflowBlock, getWorkflowStateFromString, DeckType } from '../../../../components';
import { saveFinalEstimate, saveVote } from '../../../services';
import { AppContext } from '../../..';

type Props = { deckType: DeckType };

export function CardsDeckHandler(props: Props) {
    const { deckType } = props;
    const appContext = useContext(AppContext);
    const [vote, setVote] = useState<string | undefined>(undefined);
    const [voted, setVoted] = useState<string | undefined>(undefined);
    const [finalEstimate, setFinalEstimate] = useState<string | undefined>(undefined);
    const [isScrumMaster, setIsScrumMaster] = useState(false);

    useEffect(() => {
        if (appContext.workflow?.scrumMaster) {
            setIsScrumMaster(appContext.workflow.scrumMaster === appContext.pigKey);
        } else {
            setIsScrumMaster(false);
        }
    }, [appContext.pigKey, appContext.workflow?.scrumMaster]);

    useEffect(() => {
        const pigKey = appContext.pigKey || '';

        if (appContext.pigs && appContext.pigs[pigKey]) {
            setTimeout(() => {
                if (appContext.pigs && appContext.pigs[pigKey]) {
                    setVoted(appContext.pigs[pigKey].vote);
                }
            }, 250);
        }
    }, [appContext.pigKey, appContext.pigs]);

    useEffect(() => {
        if (appContext.workflow?.nextState) {
            const nextState = getWorkflowStateFromString(appContext.workflow.nextState);

            if (nextState === EWorkflowState.VOTE || nextState === EWorkflowState.REVOTE) {
                setVoted(undefined);
                setVote(undefined);
                setFinalEstimate(undefined);
            }
        }
    }, [appContext.workflow?.nextState]);

    // Save vote to the database
    useEffect(() => {
        if (vote && appContext.boardKey && appContext.pigKey) {
            saveVote(appContext.boardKey, appContext.pigKey, vote);
        }
    }, [appContext.boardKey, appContext.pigKey, vote])

    // Save the final estimate to the database
    useEffect(() => {
        if (finalEstimate && appContext.boardKey) {
            saveFinalEstimate(appContext.boardKey, finalEstimate);
            setVoted(undefined);
            setFinalEstimate(undefined)
        }
    }, [appContext.boardKey, finalEstimate])

    const handleClickVote = (value: string) => setVote(value);
    const handleClickFinalEstimates = (value: string) => setFinalEstimate(value);

    return (
        <div>
            <WorkflowBlock state={getWorkflowStateFromString(appContext.workflow?.state || EWorkflowState.UNKNOWN)} displayState={EWorkflowState.VOTE}>
                <div className="cards-deck-handler">
                    {!voted ? <CardsDeck deckType={deckType} onClick={handleClickVote} /> : ''}
                </div>
            </WorkflowBlock>

            <WorkflowBlock state={getWorkflowStateFromString(appContext.workflow?.state || EWorkflowState.UNKNOWN)} displayState={EWorkflowState.FINAL_ESTIMATE}>
                <div className="cards-deck-handler">
                    {isScrumMaster ? <CardsDeck deckType={deckType} showCoffe={false} onClick={handleClickFinalEstimates} /> : ''}
                </div>
            </WorkflowBlock>
        </div>
    );
};