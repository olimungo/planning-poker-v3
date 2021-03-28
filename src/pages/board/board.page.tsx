import './board.page.css';
import { useParams, useHistory } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/database';
import {
    AppHeader,
    QrCode,
    EWorkflowState,
    ErrorMessage,
    AppFooter,
    WorkflowState,
    EBadgeTheme,
    getWorkflowStateFromString,
    WorkflowBlock,
} from '../../components';
import { useEffect, useState } from 'react';
import { PigsListHandler, WorkflowHandler } from './handlers';
import { EResultTheme, OverviewHandler, ResultsHandler } from '../common';
import { getWorkflowStateRef, createBoardKey, checkBoardExists } from '../services';

export function BoardPage() {
    const { key } = useParams<{ key: string }>();
    const history = useHistory();
    const [currentState, setCurrentState] = useState(EWorkflowState.UNKNOWN);
    const [errorMessage, setErrorMessage] = useState('');
    const [workflowStateRef, setWorkflowStateRef] = useState<firebase.database.Reference | null>(null);
    const [showVote, setShowVote] = useState(false);

    // Initialise board
    useEffect(() => {
        if (!key) {
            const boardKey = createBoardKey();

            if (boardKey) {
                history.push(`/board/${boardKey}`);
            } else {
                setErrorMessage('A mystic error occured while creating a board')
            }
        } else {
            checkBoardExists(key).then(boardExists => {
                if (!boardExists) {
                    setErrorMessage('The board referenced in the URL doesn\'t exist.')
                } else {
                    setWorkflowStateRef(getWorkflowStateRef(key));
                }
            });
        }

    }, [key, history]);

    // Watch the database for the current state
    useEffect(() => {
        if (workflowStateRef) {
            workflowStateRef.on('value', (value) => {
                setCurrentState(getWorkflowStateFromString(value.val()));
            });
        }

        // The return statement is executed on ComponentWillUnmount React event
        return () => {
            if (workflowStateRef) {
                workflowStateRef.off();
            }
        };
    }, [workflowStateRef]);

    const handleAllPigsHaveVoted = (value: boolean) => setShowVote(value);

    return (
        <div className="board">
            <AppHeader hideBadge={true} />
            <OverviewHandler boardKey={key} />
            <WorkflowState state={currentState} />
            <WorkflowHandler currentState={currentState} boardKey={key} onAllPigsHaveVoted={handleAllPigsHaveVoted} />

            <WorkflowBlock currentState={currentState} displayState={EWorkflowState.REGISTRATION}>
                <QrCode value={`${window.location.origin}/pig/${key}`} />
            </WorkflowBlock>

            <WorkflowBlock currentState={currentState} displayState={[
                EWorkflowState.REGISTRATION, EWorkflowState.DISCUSSION, EWorkflowState.PAUSE,
                EWorkflowState.VOTE, EWorkflowState.FINAL_ESTIMATE]}>
                <PigsListHandler boardKey={key} showVote={showVote} isClickable={false} theme={EBadgeTheme.PRIMARY} />
            </WorkflowBlock>

            <WorkflowBlock currentState={currentState} displayState={EWorkflowState.FINAL_RESULTS}>
                <ResultsHandler boardKey={key} theme={EResultTheme.PRIMARY} />
            </WorkflowBlock>

            <AppFooter hideToggle={true} />

            <ErrorMessage message={errorMessage} />

            <div className="board--spacer"></div>
        </div>
    );
}
