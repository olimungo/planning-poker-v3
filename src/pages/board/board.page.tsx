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
} from '../../components';
import { useEffect, useState } from 'react';
import { createBoardKey } from './board.service';
import { checkBoardExists } from '..';
import { PigsListHandler } from './handlers/pigs-list-handler';
import { OverviewHandler } from '../common/handlers';
import { getWorkflowStateRef, getScrumMasterRef } from '../services';

export function BoardPage() {
    const { key } = useParams<{ key: string }>();
    const history = useHistory();
    const [currentState, setCurrentState] = useState(EWorkflowState.UNKNOWN);
    const [errorMessage, setErrorMessage] = useState('');
    const [workflowStateRef, setWorkflowStateRef] = useState<firebase.database.Reference | null>(null);
    const [allPigsHaveVoted, setAllPigsHaveVoted] = useState(false);
    const [pigsRef, setPigsRef] = useState<firebase.database.Reference[]>([]);
    const scrumMasterRef = getScrumMasterRef(key)

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
            // Stop watching the workflow state when component is discarded
            if (workflowStateRef) {
                workflowStateRef.off();
            }
        };
    }, [workflowStateRef]);

    // // Watch pigs for their votes
    // useEffect(() => {
    //     getPigsRef(key).on('value', (pigs) => {
    //         let allVoted = true;

    //         pigs.forEach(pig => allVoted = allVoted && pig.child('vote').val());

    //         if (allVoted) {
    //             setAllPigsHaveVoted(true);
    //         }
    //     });
    // }, [key]);

    // // If all pigs have voted
    // useEffect(() => {
    //     if (currentState === EWorkflowState.VOTE && allPigsHaveVoted) {
    //         transitionTo(key, EWorkflowState.DISCUSSION_POST_VOTE);
    //     }
    // }, [currentState, allPigsHaveVoted]);

    // // While waiting for pigs to register
    // useEffect(() => {
    //     if (key) {
    //         getPigsRef(key).on('child_added', (value) => {
    //             if (value && value.key) {
    //                 const pig = getPigRef(key, value.key);

    //                 if (pig) {
    //                     setPigsRef((prevState) => [...prevState, pig]);
    //                 }
    //             }
    //         });
    //     }
    // }, [key]);
    return (
        <div className="board">
            <AppHeader hideBadge={true} />
            <OverviewHandler boardKey={key} />
            <WorkflowState value={currentState} />

            <div className="board--qrcode">
                <QrCode value={`${window.location.origin}/pig/${key}`} />
            </div>

            <PigsListHandler boardKey={key} showVote={false} isClickable={false} theme={EBadgeTheme.PRIMARY} />

            <AppFooter hideToggle={true} />

            {
                errorMessage
                    ? <ErrorMessage message={errorMessage} />
                    : ''
            }

            <div className="board--spacer"></div>
        </div>
    );
}
